import { Context } from './Context';
import { buildNodeTree, checkWorkload, textDeform, translateNodes } from './engine';
import { Lexer, ParenType } from './Lexer';
import { Response } from './Response';

import { GENERIC_PARSER_ERROR_MESSAGE, ParserError, StopSignal, TemplateError } from '../Errors';
import { asyncFilter } from '../Utils/Util';

import type { ITransformer, IParser, IKeyValues } from '../interfaces';
import type { Node } from './Node';

/**
 * The options a single render accepts.
 */
export interface RunOptions {
	/**
	 * The maximum number of characters the render may produce. Going over it rejects with a
	 * {@link WorkloadExceededError}. `null` means no limit.
	 *
	 * @defaultValue null
	 */
	charLimit?: number | null;
	/**
	 * Arbitrary data for your own parsers to read at `ctx.response.keyValues`. The interpreter
	 * never touches it.
	 *
	 * @defaultValue \{\}
	 */
	keyValues?: IKeyValues;
	/**
	 * Which parameter syntaxes a template may use.
	 *
	 * @defaultValue ParenType.Both
	 */
	parenType?: ParenType;
	/**
	 * Variables the template can read, as name to transformer.
	 *
	 * @defaultValue \{\}
	 */
	seedVariables?: { [key: string]: ITransformer };
	/**
	 * The maximum number of characters read from inside one `\{...\}`. The rest of that tag body
	 * is dropped.
	 *
	 * @defaultValue 2000
	 */
	tagLimit?: number;
}

const RUN_OPTION_KEYS = new Set(['charLimit', 'keyValues', 'parenType', 'seedVariables', 'tagLimit']);

/**
 *
 * Tells a {@link RunOptions} object apart from a bag of seed variables.
 *
 * Both are plain objects, so this goes by key name. A seed variable named after one of the
 * options is the one case it gets wrong, which is why the positional overload still exists.
 *
 * @param value - The second argument passed to `run`.
 * @returns
 */
const isRunOptions = (value: object): value is RunOptions =>
	Object.keys(value).every((key) => RUN_OPTION_KEYS.has(key));

/**
 * The TagScript interpreter.
 */
export class Interpreter {
	protected parsers: IParser[];

	public constructor(...parsers: IParser[]) {
		this.parsers = parsers;
	}

	/**
	 * Add more parsers
	 *
	 * @param parsers - The parsers to add.
	 */
	public addParsers(...parsers: IParser[]) {
		this.parsers = [...this.parsers, ...parsers];
	}

	/**
	 * Set new parsers
	 *
	 * @param parsers - The parsers to set.
	 */
	public setParsers(...parsers: IParser[]) {
		this.parsers = parsers;
	}

	/**
	 * Processes a given TagScript string.
	 *
	 * @param message - The TagScript string that to be processed.
	 * @param options - The options for this render.
	 * @returns - {@link Response} class containing the raw string, processed body, actions and variables.
	 */
	public async run(message: string, options?: RunOptions): Promise<Response>;
	/**
	 * Processes a given TagScript string.
	 *
	 * @deprecated Pass a {@link RunOptions} object instead. This overload will be removed in the
	 * next major.
	 * @param message - The TagScript string that to be processed.
	 * @param seedVariables - A object containing strings to transformer to provide context variables for processing.
	 * @param charLimit - The maximum characters to process.
	 * @param tagLimit - The maximum tags to process.
	 * @param parenType - Whether the parameter should be followed after a "." or use parenthesis or both.
	 * @param keyValues - Additional key value pairs that may be used by parsers during parsing.
	 * @returns - {@link Response} class containing the raw string, processed body, actions and variables.
	 */
	public async run(
		message: string,
		seedVariables?: { [key: string]: ITransformer },
		charLimit?: number | null,
		tagLimit?: number,
		parenType?: ParenType,
		keyValues?: IKeyValues,
	): Promise<Response>;

	public async run(
		message: string,
		seedVariablesOrOptions: RunOptions | { [key: string]: ITransformer } = {},
		charLimit: number | null = null,
		tagLimit = 2_000,
		parenType = ParenType.Both,
		keyValues: IKeyValues = {},
	): Promise<Response> {
		const options: RunOptions =
			arguments.length <= 2 && isRunOptions(seedVariablesOrOptions)
				? seedVariablesOrOptions
				: {
						seedVariables: seedVariablesOrOptions as { [key: string]: ITransformer },
						charLimit,
						tagLimit,
						parenType,
						keyValues,
					};

		const response = new Response(options.seedVariables ?? {}, options.keyValues ?? {});
		const nodeOrderedList = buildNodeTree(message);
		const output = await this.solve(
			message,
			nodeOrderedList,
			response,
			options.charLimit ?? null,
			options.tagLimit ?? 2_000,
			options.parenType ?? ParenType.Both,
		);
		return response.setValues(output, message);
	}

	protected getAcceptors(ctx: Context) {
		return asyncFilter(this.parsers, (parser) => parser.willAccept(ctx));
	}

	private getContext(
		node: Node,
		final: string,
		response: Response,
		originalMessage: string,
		tagLimit: number,
		parenType = ParenType.Both,
	) {
		const [start, end] = node.coordinates;
		node.tag = new Lexer(final.slice(start, end + 1), tagLimit, parenType);
		return new Context(node.tag, response, this, originalMessage);
	}

	private async processTags(ctx: Context, node: Node) {
		const acceptors = await this.getAcceptors(ctx);
		for (const b of acceptors) {
			const value: string | null | undefined = await b.parse(ctx);
			if (value !== null && value !== undefined) {
				node.output = value;
				return value;
			}
		}

		return null;
	}

	/**
	 *
	 * Turns whatever a parser threw into the text that replaces its tag.
	 *
	 * A {@link TemplateError} is the template author's mistake and they are the one reading the
	 * output, so its message goes in as written. Anything else is a bug in the parser, so the
	 * output gets a generic line and the real error is kept on the response for the host
	 * application.
	 *
	 * @param response - The response being built.
	 * @param ctx - The context of the tag that failed.
	 * @param error - Whatever the parser threw.
	 * @returns The text to render in place of the tag.
	 */
	private recordError(response: Response, ctx: Context, error: unknown): string {
		if (error instanceof TemplateError) {
			response.errors.push(error);
			return error.message;
		}

		response.errors.push(new ParserError(ctx.tag.declaration, error));
		return GENERIC_PARSER_ERROR_MESSAGE;
	}

	private async solve(
		message: string,
		nodeOrderedList: Node[],
		response: Response,
		charLimit: number | null,
		tagLimit = 2_000,
		parenType = ParenType.Both,
	) {
		let final = message;
		let totalWork = 0;
		for (let index = 0; index < nodeOrderedList.length; index++) {
			const node = nodeOrderedList[index];
			const [start, end] = node.coordinates;
			const ctx = this.getContext(node, final, response, message, tagLimit, parenType);
			let output: string | null;
			try {
				output = await this.processTags(ctx, node);
			} catch (error) {
				if (error instanceof StopSignal) return `${final.slice(0, start)} ${error.message}`;
				output = this.recordError(response, ctx, error);
			}

			if (output === null) continue;

			totalWork = checkWorkload(charLimit, totalWork, output);
			const [fMessage, differential] = textDeform(start, end, final, output);
			final = fMessage;
			translateNodes(nodeOrderedList, index, start, differential);
		}

		return final;
	}
}
