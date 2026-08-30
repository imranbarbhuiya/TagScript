import * as Effect from 'effect/Effect';

import { CharLimit, ParameterSyntax, TagLimit } from './Config';
import { GENERIC_PARSER_ERROR_MESSAGE, ParserError, StopSignal, TemplateError, WorkloadExceededError } from './Errors';
import { Response } from './Response';

import { buildNodeTree, textDeform, translateNodes } from '../lib/Interpreter/engine';
import { Lexer } from '../lib/Interpreter/Lexer';

import type { IKeyValues, ITransformer } from '../lib/interfaces';
import type { Node } from '../lib/Interpreter/Node';
import type { ParseContext } from './Context';
import type { Parser } from './Parser';

/**
 * The options a single render accepts.
 *
 * Everything else — the character limit, the tag limit, the parameter syntax — is a
 * {@link Context.Reference}, so it is provided once for a whole application rather than repeated at
 * every call.
 */
export interface RunOptions {
	/**
	 * Arbitrary data for your own parsers to read at `ctx.response.keyValues`.
	 */
	readonly keyValues?: IKeyValues;
	/**
	 * Variables the template can read, as name to transformer.
	 */
	readonly seedVariables?: { [key: string]: ITransformer };
}

/**
 * What the interpreter itself can fail with, on top of whatever the parsers declare.
 */
type InterpreterError = WorkloadExceededError;

/**
 * The TagScript interpreter, on the Effect surface.
 *
 * The difference from the classic `Interpreter` is in the type: the errors its parsers can fail
 * with and the services they need travel with it, so the caller has to handle them.
 *
 * @typeParam E - What the parsers can fail with.
 * @typeParam R - The services the parsers need.
 * @example
 * ```ts showLineNumbers
 * const ts = new Interpreter(cooldownParser, randomParser);
 *
 * const response = await Effect.runPromise(
 * 	ts.run('{random:a,b,c}').pipe(
 * 		Effect.provide(CooldownStore.memory),
 * 		Effect.catchTag('OnCooldown', (error) => Effect.succeed(`Try again in ${error.retryAfter}s`)),
 * 	),
 * );
 * ```
 */
export class Interpreter<E = never, R = never> {
	private parsers: readonly Parser<E, R>[];

	public constructor(...parsers: Parser<E, R>[]) {
		this.parsers = parsers;
	}

	/**
	 * Add more parsers.
	 *
	 * @param parsers - The parsers to add.
	 * @returns
	 */
	public addParsers(...parsers: Parser<E, R>[]) {
		this.parsers = [...this.parsers, ...parsers];
		return this;
	}

	/**
	 * Replace the parsers.
	 *
	 * @param parsers - The parsers to set.
	 * @returns
	 */
	public setParsers(...parsers: Parser<E, R>[]) {
		this.parsers = parsers;
		return this;
	}

	/**
	 * Renders a TagScript template.
	 *
	 * A `TemplateError` from a parser is rendered in place of its tag and recorded on the response,
	 * because it describes a mistake the template author can fix. A defect becomes a
	 * {@link ParserError} and the tag renders a generic message. Anything else a parser fails with
	 * reaches the error channel, for the caller to handle.
	 *
	 * @param message - The template to render.
	 * @param options - The seed variables and key values for this render.
	 * @returns The completed {@link Response}.
	 */
	public run(
		message: string,
		options: RunOptions = {},
	): Effect.Effect<Response, Exclude<E, TemplateError> | InterpreterError, R> {
		return Effect.gen({ self: this }, function* () {
			const response = new Response(options.seedVariables ?? {}, options.keyValues ?? {});
			const output = yield* this.solve(message, response);
			return response.setValues(output, message);
		}) as Effect.Effect<Response, Exclude<E, TemplateError> | InterpreterError, R>;
	}

	/**
	 *
	 * Runs the accepting parsers in order until one returns something.
	 *
	 * @param ctx - The tag being processed.
	 * @returns The text to replace the tag with, or `null` when nothing handled it.
	 */
	private processTags(ctx: ParseContext) {
		return Effect.gen({ self: this }, function* () {
			for (const parser of this.parsers) {
				if (!(yield* parser.willAccept(ctx))) continue;

				const value = yield* parser.parse(ctx);
				if (value !== null && value !== undefined) return value;
			}

			return null;
		});
	}

	/**
	 *
	 * Decides what a failed tag renders as.
	 *
	 * A `TemplateError` is the template author's mistake and they are the one reading the output, so
	 * its message goes in as written. A defect is a bug in the parser, so the output gets a generic
	 * line and the real error is kept on the response. Anything else is re-raised for the caller.
	 *
	 * @param ctx - The tag that failed.
	 * @param effect - The parser run for that tag.
	 * @returns The text to render in place of the tag.
	 */
	private recoverTag(ctx: ParseContext, effect: Effect.Effect<string | null, E, R>) {
		return effect.pipe(
			Effect.catch((error: E) => {
				if (error instanceof TemplateError) {
					ctx.response.errors.push(error);
					return Effect.succeed<StopSignal | string | null>(error.message);
				}

				// A stop is control flow, not a failure, so it is unwrapped into the success channel
				// rather than travelling out to the caller as an error.
				if (error instanceof StopSignal) return Effect.succeed<StopSignal | string | null>(error);

				return Effect.fail(error);
			}),
			Effect.catchDefect((defect) => {
				ctx.response.errors.push(new ParserError({ tag: ctx.tag.declaration, cause: defect }));
				return Effect.succeed<StopSignal | string | null>(GENERIC_PARSER_ERROR_MESSAGE);
			}),
		);
	}

	private solve(message: string, response: Response) {
		return Effect.gen({ self: this }, function* () {
			const charLimit = yield* CharLimit;
			const tagLimit = yield* TagLimit;
			const parenType = yield* ParameterSyntax;

			const nodeOrderedList: Node[] = buildNodeTree(message);
			let final = message;
			let totalWork = 0;

			for (let index = 0; index < nodeOrderedList.length; index++) {
				const node = nodeOrderedList[index];
				const [start, end] = node.coordinates;

				node.tag = new Lexer(final.slice(start, end + 1), tagLimit, parenType);
				const ctx: ParseContext = { tag: node.tag, response, originalMessage: message };

				const outcome = yield* this.recoverTag(ctx, this.processTags(ctx));

				if (outcome instanceof StopSignal) return `${final.slice(0, start)} ${outcome.message}`;
				if (outcome === null) continue;

				node.output = outcome;
				totalWork += outcome.length;
				if (charLimit !== null && totalWork > charLimit) {
					return yield* new WorkloadExceededError({ limit: charLimit, attempted: totalWork });
				}

				const [nextFinal, differential] = textDeform(start, end, final, outcome);
				final = nextFinal;
				translateNodes(nodeOrderedList, index, start, differential);
			}

			return final;
		});
	}
}
