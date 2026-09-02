import { Flavour, rulesFor } from './flavour';

/**
 * How far into a line the scanner is, which decides whether a character is syntax.
 */
export const enum LineState {
	/**
	 * Only whitespace so far, so a `#` here would be a heading.
	 */
	Blank,
	/**
	 * Whitespace then digits, so a `.` here would make an ordered list.
	 */
	Numeric,
	/**
	 * Something else has been written, so nothing positional applies.
	 */
	Body,
}

/**
 *
 * Works out what the next line state is after reading a character.
 *
 * @param state - Where the scanner was.
 * @param char - The character just read.
 * @returns
 */
const advance = (state: LineState, char: string): LineState => {
	if (char === '\n') return LineState.Blank;
	if (state === LineState.Body) return LineState.Body;
	if (char === ' ' || char === '\t') return state;
	if (char >= '0' && char <= '9') return LineState.Numeric;
	return LineState.Body;
};

/**
 *
 * Decides whether a character needs a backslash where it sits.
 *
 * @param char - The character in question.
 * @param state - Where in the line it sits.
 * @param flavour - The markdown it is going to be read as.
 * @returns
 */
const needsEscape = (char: string, state: LineState, flavour: Flavour): boolean => {
	const rules = rulesFor(flavour);
	if (rules.inline.has(char)) return true;
	if (state === LineState.Blank && rules.lineStart.has(char)) return true;
	return rules.orderedLists && state === LineState.Numeric && (char === '.' || char === ')');
};

/**
 *
 * Escapes part of a string, carrying the line state in and out so a caller walking a whole body
 * keeps the positional rules right across the boundary.
 *
 * @param source - The string being read.
 * @param from - Where to start.
 * @param to - Where to stop, exclusive.
 * @param state - The line state at `from`.
 * @param flavour - The markdown it is going to be read as.
 * @returns The escaped text and the line state at `to`.
 */
export const escapeRange = (
	source: string,
	from: number,
	to: number,
	state: LineState,
	flavour: Flavour,
): { state: LineState; text: string } => {
	let text = '';
	let current = state;
	for (let index = from; index < to; index++) {
		const char = source[index];
		if (needsEscape(char, current, flavour)) text += '\\';
		text += char;
		current = advance(current, char);
	}

	return { text, state: current };
};

/**
 *
 * Escapes a piece of text so markdown renders it as the characters it is made of.
 *
 * Use this when you have a value on its own. When you have a rendered {@link Response}, use
 * `markdownSafe` instead, which escapes only the parts a tag produced and leaves the formatting
 * the template author wrote alone.
 *
 * A character that only means something at the start of a line, such as `#`, is escaped only
 * there. Escaping those everywhere would put a backslash in front of every hyphen in a phone
 * number and every full stop in a sentence.
 *
 * @param text - The text to escape.
 * @param flavour - The markdown it is going to be read as.
 * @returns
 * @example
 * ```ts showLineNumbers
 * escapeMarkdown('# Ada\n---\n[click](https://evil.tld)', Flavour.GFM);
 * // '\\# Ada\n\\---\n\\[click\\](https://evil.tld)'
 * ```
 */
export const escapeMarkdown = (text: string, flavour: Flavour = Flavour.GFM): string =>
	escapeRange(text, 0, text.length, LineState.Blank, flavour).text;

/**
 *
 * Reads a string without escaping it, only to keep track of where the lines are.
 *
 * @param source - The string being read.
 * @param from - Where to start.
 * @param to - Where to stop, exclusive.
 * @param state - The line state at `from`.
 * @returns The line state at `to`.
 */
export const scanRange = (source: string, from: number, to: number, state: LineState): LineState => {
	let current = state;
	for (let index = from; index < to; index++) current = advance(current, source[index]);
	return current;
};
