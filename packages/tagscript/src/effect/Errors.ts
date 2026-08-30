import * as Data from 'effect/Data';

/**
 * Raised by a parser when the template is wrong: a malformed payload, a parameter that cannot be
 * read, a value the parser cannot make sense of.
 *
 * The person who wrote the template is usually not the person running the process, and has no
 * console to read, so the interpreter renders `message` in place of the tag that raised it and
 * carries on with the rest of the template.
 *
 * Write messages for a template author, not for a developer.
 *
 * @example
 * ```ts showLineNumbers
 * parse: Effect.fnUntraced(function* (ctx) {
 * 	const seconds = Number.parseInt(ctx.tag.parameter!, 10);
 * 	if (Number.isNaN(seconds)) {
 * 		return yield* new TemplateError({ message: 'cooldown needs a number of seconds', tag: 'cooldown' });
 * 	}
 *
 * 	return '';
 * });
 * ```
 */
export class TemplateError extends Data.TaggedError('TemplateError')<{
	readonly message: string;
	readonly tag: string | null;
}> {}

/**
 * Wraps a defect a parser threw rather than failing with, which means a bug in the parser rather
 * than a mistake in the template.
 *
 * The interpreter renders {@link GENERIC_PARSER_ERROR_MESSAGE} instead of the real message, so a
 * stack trace or an internal detail never reaches whoever reads the output.
 */
export class ParserError extends Data.TaggedError('ParserError')<{
	readonly cause: unknown;
	readonly tag: string | null;
}> {}

/**
 * Raised when a render produces more characters than the char limit allows.
 *
 * Unlike the other two this is not rendered into the output, it fails the effect, because a render
 * that blew its budget has no trustworthy output to show.
 */
export class WorkloadExceededError extends Data.TaggedError('WorkloadExceededError')<{
	readonly attempted: number;
	readonly limit: number;
}> {}

/**
 * Ends the render early, keeping everything rendered so far and appending `message`.
 *
 * This is control flow rather than a failure, so it is not recorded on the response.
 */
export class StopSignal extends Data.TaggedError('StopSignal')<{
	readonly message: string;
}> {}

/**
 * Every error the interpreter itself can add to the error channel. A parser adds its own on top.
 */
export type TagScriptError = ParserError | TemplateError | WorkloadExceededError;

/**
 * What the interpreter renders in place of a tag whose parser threw a defect.
 */
export const GENERIC_PARSER_ERROR_MESSAGE = 'An error occurred while processing this tag.';
