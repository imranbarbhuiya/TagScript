import * as Effect from 'effect/Effect';

import { StopSignal, TemplateError } from './Errors';

import {
	ParserError as ClassicParserError,
	StopSignal as ClassicStopSignal,
	TemplateError as ClassicTemplateError,
} from '../lib/Errors';
import { Context as ClassicContext } from '../lib/Interpreter/Context';
import { Interpreter as ClassicInterpreter } from '../lib/Interpreter/Interpreter';
import { Response as ClassicResponse } from '../lib/Interpreter/Response';

import type { IParser } from '../lib/interfaces';
import type { ParseContext } from './Context';
import type { Interpreter } from './Interpreter';
import type { Parser } from './Parser';
import type { Response } from './Response';

/**
 *
 * Translates the two errors a classic parser signals by throwing into their tagged equivalents.
 *
 * Anything else stays untranslated and becomes a defect, which the interpreter reports as a
 * `ParserError` with a generic message, the same as it treats a defect from a native parser.
 *
 * @param error - Whatever the classic parser threw.
 * @returns The tagged error, or `null` when it is not one the Effect entry point models.
 */
const translate = (error: unknown) => {
	if (error instanceof ClassicStopSignal) return new StopSignal({ message: error.message });
	if (error instanceof ClassicTemplateError) return new TemplateError({ message: error.message, tag: error.tag });
	return null;
};

/**
 *
 * Lifts a classic parser onto the Effect entry point.
 *
 * The response is copied across in both directions, so a classic parser that writes to
 * `ctx.response.actions` or defines a variable behaves exactly as it does on the classic entry point.
 *
 * The result is typed `Parser<StopSignal | TemplateError>` with no requirements, because a classic
 * parser has no way to ask for a service.
 *
 * @param parser - The classic parser to lift.
 * @returns
 * @example
 * ```ts showLineNumbers
 * import { CooldownParser } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(fromClassic(new CooldownParser()));
 * ```
 */
export const fromClassic = (parser: IParser): Parser<StopSignal | TemplateError> => {
	const call = <A>(method: (ctx: ClassicContext) => A | PromiseLike<A>) =>
		Effect.fnUntraced(function* (ctx: ParseContext) {
			// A classic parser mutates the response it is handed, so it gets one that shares the
			// same actions and variables, and anything else it set is copied back afterwards.
			const response = new ClassicResponse(ctx.response.variables, ctx.response.keyValues);
			response.actions = ctx.response.actions;
			response.body = ctx.response.body;

			const classicContext = new ClassicContext(ctx.tag, response, new ClassicInterpreter(), ctx.originalMessage);

			const result = yield* Effect.tryPromise({
				try: async () => method(classicContext),
				catch: (error) => error,
			}).pipe(
				Effect.catch((error) => {
					const translated = translate(error);
					return translated === null ? Effect.die(error) : Effect.fail(translated);
				}),
			);

			ctx.response.body = response.body;
			ctx.response.variables = response.variables;

			return result;
		});

	return {
		willAccept: call((classicContext) => parser.willAccept(classicContext)),
		parse: call(async (classicContext) => (await parser.parse(classicContext)) ?? null),
	};
};

/**
 *
 * Lowers an Effect parser onto the classic entry point.
 *
 * Only a parser that needs no services can make the trip, which is why `R` is pinned to `never`.
 * That constraint is the point: a parser that declares a requirement will not compile here, rather
 * than failing at runtime once it is registered on a classic interpreter.
 *
 * A `TemplateError` or `StopSignal` is rethrown as its classic counterpart, so the classic
 * interpreter recovers from it exactly as it would from one of its own parsers.
 *
 * @param parser - The Effect parser to lower.
 * @returns
 */
export const toClassic = <E>(parser: Parser<E, never>): IParser => {
	// The two Response shapes agree on everything a parser touches. They differ only in the type of
	// `errors`, which a parser never writes to; the interpreter is what records those.
	const adapt = (ctx: ClassicContext): ParseContext => ({
		tag: ctx.tag,
		response: ctx.response as unknown as Response,
		originalMessage: ctx.originalMessage,
	});

	// The typed failure is moved into the success channel and rethrown here, rather than dug back
	// out of a `Cause`, so this does not depend on how a Cause is shaped internally. A defect still
	// rejects the promise, and the classic interpreter turns that into a `ParserError` for us.
	const run = async <A>(effect: Effect.Effect<A, E, never>) => {
		const outcome = await Effect.runPromise(
			effect.pipe(Effect.catch((error: E) => Effect.succeed({ failure: error }))),
		);

		if (typeof outcome === 'object' && outcome !== null && 'failure' in outcome) {
			const { failure } = outcome as { failure: unknown };
			if (failure instanceof StopSignal) throw new ClassicStopSignal(failure.message);
			if (failure instanceof TemplateError) throw new ClassicTemplateError(failure.message, failure.tag);
			throw new ClassicParserError(null, failure);
		}

		return outcome as A;
	};

	return {
		willAccept: (ctx) => run(parser.willAccept(adapt(ctx))),
		parse: (ctx) => run(parser.parse(adapt(ctx))),
	};
};

/**
 *
 * Runs an Effect interpreter that needs no services from non-Effect code.
 *
 * The escape hatch for a codebase that is not on Effect yet: the parsers stay typed, the call site
 * stays a promise.
 *
 * @param interpreter - The interpreter to run.
 * @returns A function with the classic `run` shape.
 */
export const toPromise =
	<E>(interpreter: Interpreter<E, never>) =>
	async (...args: Parameters<Interpreter<E, never>['run']>): Promise<Response> =>
		Effect.runPromise(interpreter.run(...args) as Effect.Effect<Response, never, never>);
