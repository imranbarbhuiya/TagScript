import { builtinTags } from 'tagscript';

import { LineState, escapeRange, scanRange } from './escape';
import { Flavour } from './flavour';

import type { OutputSpan, TagDefinition } from 'tagscript';

/**
 * The parts of a rendered response this needs.
 *
 * Declared structurally so it accepts a `Response` from either entry point, since both record the
 * same ranges.
 */
export interface SpannedResponse {
	/**
	 * The rendered body.
	 */
	body: string | null;
	/**
	 * Which ranges of the body a tag produced. Must not be `null`, so render with `spans: true`.
	 */
	spans: OutputSpan[] | null;
}

/**
 * Which tags produce text the template author wrote, and which produce data from elsewhere.
 */
export interface MarkdownSafeOptions {
	/**
	 * Tags whose output is text the template author is responsible for, so their markdown is left
	 * working.
	 *
	 * Defaults to `builtinTags`. Every built-in parser passes its own payload through, which the
	 * author typed, so `\{if(x):**yes**\}` keeps its emphasis. A variable is not in that list, so
	 * whatever your application seeded is escaped.
	 *
	 * Add your own tags here when they return template text. A tag that returns anything fetched,
	 * submitted or configured elsewhere belongs nowhere near this list.
	 *
	 * @defaultValue builtinTags
	 */
	trust?: readonly TagDefinition[] | readonly string[];
	/**
	 * Tags to escape even when {@link MarkdownSafeOptions.trust} covers them.
	 *
	 * Useful for a variable an author defined with `\{=(name):value\}` that you nevertheless do not
	 * want to be able to format.
	 */
	untrust?: readonly string[];
}

/**
 *
 * Reduces a trust list to the names it covers.
 *
 * @param trust - Definitions or plain names.
 * @returns
 */
const namesOf = (trust: readonly TagDefinition[] | readonly string[]): string[] =>
	trust.map((entry) => (typeof entry === 'string' ? entry : entry.name));

/**
 *
 * Escapes the parts of a rendered body that came from a tag, and leaves the rest alone.
 *
 * This is the difference between escaping a whole body and escaping the right parts of it. A
 * template author writing `Welcome **\{name\}**` means the asterisks and does not mean whatever
 * `name` happens to contain, and only a render knows which characters are which.
 *
 * Render with `spans: true` or this throws, because a response without ranges cannot be told apart
 * from a response where nothing was generated, and quietly returning the body unescaped would be
 * the wrong way to be wrong.
 *
 * The result is markdown, not HTML. Whatever you already render with keeps rendering, and escaping
 * here is not a substitute for sanitising HTML afterwards if your renderer allows raw HTML through.
 *
 * @param response - A response rendered with `spans: true`.
 * @param flavour - The markdown the body is going to be read as.
 * @param options - Which tags to treat as the author's own text.
 * @returns The body with generated text escaped, or `null` if the render produced no body.
 * @throws When the response was rendered without `spans: true`.
 * @example
 * ```ts showLineNumbers
 * const response = await ts.run('Welcome **{name}**!', { seedVariables, spans: true });
 * markdownSafe(response, Flavour.GFM);
 * // name = '_ _** @everyone'  ->  'Welcome **\\_ \\_\\*\\* @everyone**!'
 * ```
 */
export const markdownSafe = (
	response: SpannedResponse,
	flavour: Flavour = Flavour.GFM,
	options: MarkdownSafeOptions = {},
): string | null => {
	if (response.spans === null) {
		throw new Error('markdownSafe needs to know which parts of the body came from a tag. Render with `spans: true`.');
	}

	const { body } = response;
	if (body === null) return null;

	const trusted = new Set(namesOf(options.trust ?? builtinTags));
	for (const name of options.untrust ?? []) trusted.delete(name);

	const generated = response.spans
		.filter((span) => span.tags.some((tag) => tag === null || !trusted.has(tag)))
		.sort((a, b) => a.start - b.start);

	let result = '';
	let cursor = 0;
	let state = LineState.Blank;

	for (const span of generated) {
		if (span.start < cursor) continue;
		result += body.slice(cursor, span.start);
		state = scanRange(body, cursor, span.start, state);
		const escaped = escapeRange(body, span.start, span.end, state, flavour);
		result += escaped.text;
		state = escaped.state;
		cursor = span.end;
	}

	return result + body.slice(cursor);
};
