/**
 * The base class for everything the interpreter raises or catches.
 */
export abstract class TagScriptError extends Error {
	public override name = 'TagScriptError';
}

/**
 * Raised by a parser when the template is wrong: a malformed payload, a parameter that
 * cannot be read, a value the parser cannot make sense of.
 *
 * The person who wrote the template is usually not the person running the process, and has
 * no console to read, so the interpreter renders `message` into the output in place of the
 * tag that raised it and carries on with the rest of the template. The error is also pushed
 * onto {@link Response.errors} so the host application can inspect it.
 *
 * Write messages for a template author, not for a developer.
 *
 * @example
 * ```ts showLineNumbers
 * public parse(ctx: Context) {
 * 	const seconds = Number.parseInt(ctx.tag.parameter!, 10);
 * 	if (Number.isNaN(seconds)) throw new TemplateError('cooldown needs a number of seconds', ctx.tag.declaration);
 * 	return '';
 * }
 * ```
 */
export class TemplateError extends TagScriptError {
	public override name = 'TemplateError';

	/**
	 * The declaration of the tag that raised this, when the parser passed it.
	 */
	public readonly tag: string | null;

	public constructor(message: string, tag: string | null = null, options?: ErrorOptions) {
		super(message, options);
		this.tag = tag;
	}
}

/**
 * Wraps anything a parser threw that was not a {@link TemplateError}, which means a bug in the
 * parser rather than a mistake in the template.
 *
 * The interpreter renders {@link GENERIC_PARSER_ERROR_MESSAGE} instead of `cause`'s message, so a
 * stack trace or an internal detail never reaches whoever reads the output. The real error is on
 * `cause` and the wrapper is pushed onto {@link Response.errors}.
 */
export class ParserError extends TagScriptError {
	public override name = 'ParserError';

	/**
	 * The declaration of the tag being processed when the parser threw.
	 */
	public readonly tag: string | null;

	public constructor(tag: string | null, cause: unknown) {
		super(`The parser for ${tag === null ? 'a tag' : `{${tag}}`} threw an error.`, { cause });
		this.tag = tag;
	}
}

/**
 * Raised out of `run` when a render produces more characters than `charLimit` allows.
 *
 * Unlike the other two this is not rendered into the output, it rejects, because a render that
 * blew its budget has no trustworthy output to show.
 */
export class WorkloadExceededError extends TagScriptError {
	public override name = 'WorkloadExceededError';

	/**
	 * The limit that was set.
	 */
	public readonly limit: number;

	/**
	 * The number of characters the render had reached when it was stopped.
	 */
	public readonly attempted: number;

	public constructor(limit: number, attempted: number) {
		super(`The TS interpreter had its workload exceeded. The total characters attempted were ${attempted}/${limit}`);
		this.limit = limit;
		this.attempted = attempted;
	}
}

/**
 * Thrown by a parser to end the render early, keeping everything rendered so far and appending
 * `message`. This is control flow rather than a failure, which is why it does not land in
 * {@link Response.errors}.
 *
 * {@link StopParser} is built on it.
 *
 * @example
 * ```ts showLineNumbers
 * public parse(ctx: Context) {
 * 	if (parseIf(ctx.tag.parameter!)) throw new StopSignal(ctx.tag.payload ?? '');
 * 	return '';
 * }
 * ```
 */
export class StopSignal extends TagScriptError {
	public override name = 'StopSignal';
}

/**
 * What the interpreter renders in place of a tag whose parser threw something other than a
 * {@link TemplateError} or a {@link StopSignal}.
 */
export const GENERIC_PARSER_ERROR_MESSAGE = 'An error occurred while processing this tag.';
