import { buildNodeTree } from './engine';
import { Lexer, ParenType } from './Lexer';

import type { TagSpans } from './Lexer';

/**
 * One tag found in a template, with everything needed to point back at the text it came from.
 */
export interface ExtractedTag {
	/**
	 * How deeply this tag is nested. A tag at the top level is `0`.
	 */
	depth: number;
	/**
	 * Where the tag ends, at its closing brace, inclusive.
	 */
	end: number;
	/**
	 * The position this tag would be evaluated at. The interpreter works innermost first, so this
	 * is not document order.
	 */
	order: number;
	/**
	 * Where the tag starts, at its opening brace.
	 */
	start: number;
	/**
	 * Where each part of the tag sits, as offsets into the template rather than into the tag.
	 */
	spans: TagSpans;
	/**
	 * The lexed tag. `declaration`, `parameter` and `payload` read from here.
	 */
	tag: Lexer;
}

/**
 * The settings that change what counts as a tag, matching the ones a render uses.
 */
export interface ExtractOptions {
	/**
	 * Which parameter syntaxes a template may use.
	 *
	 * @defaultValue ParenType.Both
	 */
	parenType?: ParenType;
	/**
	 * The maximum number of characters read from inside one tag.
	 *
	 * @defaultValue 2000
	 */
	tagLimit?: number;
}

/**
 *
 * Shifts a tag-relative span to a template-relative one.
 *
 * @param spans - The spans the lexer recorded.
 * @param start - Where the tag starts in the template.
 * @returns
 */
const absolute = (spans: TagSpans, start: number): TagSpans => ({
	declaration: spans.declaration && { start: spans.declaration.start + start, end: spans.declaration.end + start },
	parameter: spans.parameter && { start: spans.parameter.start + start, end: spans.parameter.end + start },
	payload: spans.payload && { start: spans.payload.start + start, end: spans.payload.end + start },
});

/**
 *
 * Finds every tag in a template without running any of them.
 *
 * This is what the interpreter itself sees, so a tool built on it agrees with a render by
 * construction. Use it to highlight a template, to validate one before saving it, or to load one
 * into an editor.
 *
 * Nothing here says whether a tag will be *handled*. That depends on which parsers are registered,
 * so an unknown tag looks exactly like a known one.
 *
 * @param message - The template to read.
 * @param options - The same settings a render would use, so the result matches what running it
 * would produce.
 * @returns Every tag, in document order.
 * @example
 * ```ts showLineNumbers
 * const [tag] = extractTags('Hi {upper:there}');
 * tag.tag.declaration; // 'upper'
 * message.slice(tag.spans.payload.start, tag.spans.payload.end); // 'there'
 * ```
 */
export const extractTags = (message: string, options: ExtractOptions = {}): ExtractedTag[] => {
	const { tagLimit = 2_000, parenType = ParenType.Both } = options;

	const tags = buildNodeTree(message).map((node, order) => {
		const [start, end] = node.coordinates;
		const tag = new Lexer(message.slice(start, end + 1), tagLimit, parenType);
		return { tag, start, end, order, depth: 0, spans: absolute(tag.spans, start) };
	});

	for (const tag of tags) {
		tag.depth = tags.filter((other) => other.start < tag.start && other.end > tag.end).length;
	}

	return tags.sort((a, b) => a.start - b.start);
};
