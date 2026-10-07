import { Flavour } from './flavour';

import type { SkipRange } from 'tagscript';

const FENCE_PREFIX = /^(?:[ \t]*(?:>|[-+*](?=[ \t])|\d{1,9}[.)](?=[ \t])))*[ \t]*/;

/**
 *
 * Reads a fence from the start of a line, after any indentation, quote markers or list markers.
 *
 * @param line - The line.
 * @returns The fence's character, length and offset into the line, or `null` when the line does not
 * open or close one.
 */
const readFence = (line: string): { char: string; length: number; offset: number; rest: string } | null => {
	const offset = FENCE_PREFIX.exec(line)![0].length;
	const text = line.slice(offset);
	const fence = /^(`{3,}|~{3,})/.exec(text)?.[1];
	return fence ? { char: fence[0], length: fence.length, offset, rest: text.slice(fence.length) } : null;
};

/**
 *
 * Finds where a run of backticks of exactly `length` next appears, ignoring longer runs.
 *
 * @param text - The text to search.
 * @param from - Where to start.
 * @param length - The run length to match.
 * @param to - Where to stop.
 * @returns The index after the closing run, or `-1` when there is none.
 */
const closingRun = (text: string, from: number, length: number, to: number): number => {
	let index = from;
	while (index < to) {
		if (text[index] !== '`') {
			index++;
			continue;
		}

		let end = index;
		while (end < to && text[end] === '`') end++;
		if (end - index === length) return end;
		index = end;
	}

	return -1;
};

/**
 *
 * Finds inline code spans between `from` and `to`.
 *
 * @param text - The template.
 * @param from - Where the region starts.
 * @param to - Where the region ends.
 * @param ranges - Where to add what is found.
 * @param discord - Whether three or more backticks open a block that runs to the next three.
 */
const inlineCode = (text: string, from: number, to: number, ranges: SkipRange[], discord: boolean) => {
	let index = from;
	while (index < to) {
		const char = text[index];
		if (char === '\\') {
			index += 2;
			continue;
		}

		if (char !== '`') {
			index++;
			continue;
		}

		let open = index;
		while (open < to && text[open] === '`') open++;
		const length = open - index;
		const close = discord && length >= 3 ? text.indexOf('```', open) : closingRun(text, open, length, to);

		if (close === -1 || close > to) {
			index = open;
			continue;
		}

		const end = discord && length >= 3 ? close + 3 : close;
		ranges.push({ start: index, end });
		index = end;
	}
};

/**
 *
 * Finds the code in a markdown template, so a render can leave it alone.
 *
 * Covers fenced code blocks and inline code spans. It does not parse markdown, so it misses
 * indented code blocks and can be fooled by unusual nesting. If you already parse with remark, use
 * {@link codeRangesFromMdast} for the exact answer.
 *
 * @param template - The markdown template.
 * @param flavour - The markdown the template is written in. Discord closes a block opened with three
 * backticks at the next three, wherever they are, and has no tilde fences.
 * @returns The ranges to pass as `skipRanges`, in document order.
 * @example
 * ```ts showLineNumbers
 * const response = await ts.run(template, { seedVariables, skipRanges: codeRanges(template) });
 * ```
 */
export const codeRanges = (template: string, flavour: Flavour = Flavour.GFM): SkipRange[] => {
	const ranges: SkipRange[] = [];

	if (flavour === Flavour.Discord) {
		inlineCode(template, 0, template.length, ranges, true);
		return ranges;
	}

	let paragraphStart = 0;
	let fence: { char: string; length: number; start: number } | null = null;

	for (let lineStart = 0; lineStart <= template.length;) {
		const newline = template.indexOf('\n', lineStart);
		const lineEnd = newline === -1 ? template.length : newline;
		const line = template.slice(lineStart, lineEnd);
		const found = readFence(line);

		if (fence) {
			if (found?.char === fence.char && found.length >= fence.length && !found.rest.trim()) {
				ranges.push({ start: fence.start, end: lineEnd });
				fence = null;
				paragraphStart = lineEnd;
			}
		} else if (found && !(found.char === '`' && found.rest.includes('`'))) {
			inlineCode(template, paragraphStart, lineStart, ranges, false);
			fence = { ...found, start: lineStart + found.offset };
		} else if (!line.trim()) {
			inlineCode(template, paragraphStart, lineStart, ranges, false);
			paragraphStart = lineEnd;
		}

		if (newline === -1) break;
		lineStart = newline + 1;
	}

	if (fence) ranges.push({ start: fence.start, end: template.length });
	else inlineCode(template, paragraphStart, template.length, ranges, false);

	return ranges;
};

/**
 * The part of an mdast node this package reads. Any tree from `remark-parse` or
 * `mdast-util-from-markdown` fits.
 */
export interface MdastNode {
	children?: MdastNode[];
	position?: { end: { offset?: number }; start: { offset?: number } };
	type: string;
}

/**
 *
 * Finds the code in a markdown template from a tree remark already parsed, which is exact where
 * {@link codeRanges} is an approximation.
 *
 * @param tree - The root of the parsed template. It must have positions, which remark keeps by
 * default.
 * @returns The ranges to pass as `skipRanges`, in document order.
 * @example
 * ```ts showLineNumbers
 * import { fromMarkdown } from 'mdast-util-from-markdown';
 *
 * const skipRanges = codeRangesFromMdast(fromMarkdown(template));
 * ```
 */
export const codeRangesFromMdast = (tree: MdastNode): SkipRange[] => {
	const ranges: SkipRange[] = [];
	const visit = (node: MdastNode) => {
		const { start, end } = node.position ?? {};
		if (
			(node.type === 'code' || node.type === 'inlineCode') &&
			start?.offset !== undefined &&
			end?.offset !== undefined
		) {
			ranges.push({ start: start.offset, end: end.offset });
			return;
		}

		for (const child of node.children ?? []) visit(child);
	};

	visit(tree);
	return ranges;
};
