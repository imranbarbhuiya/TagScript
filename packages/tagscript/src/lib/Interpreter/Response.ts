import type { TagScriptError } from '../Errors';
import type { ITransformer, IKeyValues, IActions } from '../interfaces';

/**
 * A range of the finished body that a tag produced, rather than the template author typing it.
 *
 * Ranges are half-open, `[start, end)`, and are kept accurate as later tags resize the text around
 * them. A tag nested inside another does not get its own range, because the outer tag replaced it;
 * its declaration is listed in the outer range's {@link OutputSpan.tags} instead.
 */
export interface OutputSpan {
	/**
	 * Where the output ends, exclusive.
	 */
	end: number;
	/**
	 * Where the output starts.
	 */
	start: number;
	/**
	 * Every tag that contributed text to this range, outermost first. `null` is a tag with no
	 * declaration.
	 *
	 * More than one means tags were nested. Anything deciding how to treat this text has to
	 * consider all of them, since `\{upper:\{user\}\}` is as untrustworthy as `\{user\}` is.
	 */
	tags: (string | null)[];
}

/**
 * One tag's turn during a render, recorded when `trace` is on.
 */
export interface TraceStep {
	/**
	 * The body as it stood after this step.
	 */
	body: string;
	/**
	 * Where the tag ended, inclusive, before it was replaced.
	 */
	end: number;
	/**
	 * The error this tag raised, if any.
	 */
	error: TagScriptError | null;
	/**
	 * What replaced the tag, or `null` when no parser handled it and the text stayed as it was.
	 */
	output: string | null;
	/**
	 * Where the tag started, before it was replaced.
	 */
	start: number;
	/**
	 * The tag as written.
	 */
	tag: string;
}

/**
 * An object containing information on a completed TagScript process.
 */
export class Response {
	/**
	 * The raw string that was used to generate this response.
	 */
	public raw!: string;

	/**
	 * The cleaned message with all tags interpreted.
	 */
	public body: string | null;

	/**
	 * An object with all the variables that parsers such as the `LooseVarsParser` can access.
	 */
	public variables: { [key: string]: ITransformer };

	/**
	 * An object containing information on a completed TagScript process.
	 * If you are creating a parser where you need to store info in actions,
	 * then you need to extend this interface.
	 *
	 * ```ts showLineNumbers
	 * import 'tagscript';
	 * declare module 'tagscript' {
	 * 	interface IActions {
	 * foo?: string;
	 *	}
	 * }
	 * ```
	 */
	public actions: IActions;

	public keyValues: IKeyValues;

	/**
	 * Every error a parser raised during the render, in the order they happened.
	 *
	 * The render does not stop for these. A {@link TemplateError} has already been rendered into
	 * `body` in place of its tag; a {@link ParserError} means a parser threw a bug and `body` got a
	 * generic message instead, with the real error on its `cause`.
	 *
	 * An empty array means the render was clean.
	 */
	public errors: TagScriptError[];

	/**
	 * Which ranges of {@link Response.body} came from a tag rather than from the template author,
	 * or `null` unless `spans` was on.
	 *
	 * Needed by anything that has to treat generated text differently from written text, such as
	 * escaping a value for the syntax of the document the body is dropped into. Recording them
	 * costs time proportional to the square of the tag count, so it is off unless asked for, and
	 * `null` rather than `[]` so that not asking is distinguishable from a template with no tags.
	 */
	public spans: OutputSpan[] | null;

	/**
	 * Every step of the render, in the order they ran, or `null` unless `trace` was on.
	 *
	 * Tags are evaluated innermost first, so this is not document order.
	 */
	public trace: TraceStep[] | null;

	public constructor(variables: { [key: string]: ITransformer } = {}, keyValues: IKeyValues = {}) {
		this.body = null;
		this.actions = {};
		this.variables = variables;
		this.keyValues = keyValues;
		this.errors = [];
		this.spans = null;
		this.trace = null;
	}

	public setValues(output: string, raw: string) {
		const source = this.body ?? output;
		this.body = source.trim();
		if (this.spans !== null) this.shiftSpans(source.length - source.trimStart().length);

		this.raw = raw;
		return this;
	}

	/**
	 *
	 * Moves every recorded range to match the trimmed body, and drops any that the trim removed.
	 *
	 * @param offset - How many characters came off the front.
	 */
	private shiftSpans(offset: number) {
		if (this.spans === null) return;
		const length = this.body?.length ?? 0;
		this.spans = this.spans
			.map((span) => ({ ...span, start: span.start - offset, end: span.end - offset }))
			.map((span) => ({ ...span, start: Math.max(span.start, 0), end: Math.min(span.end, length) }))
			.filter((span) => span.start < span.end);
	}

	public toJSON() {
		return {
			body: this.body,
			raw: this.raw,
			actions: this.actions,
			variables: this.variables,
			keyValues: this.keyValues,
			errors: this.errors,
		};
	}
}
