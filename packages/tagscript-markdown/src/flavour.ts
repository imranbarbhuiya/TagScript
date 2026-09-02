/**
 * Which markdown a body is going to be read as.
 *
 * They differ in what counts as syntax, so escaping for the wrong one either leaves an opening or
 * litters the output with backslashes that render literally.
 */
export enum Flavour {
	/**
	 * CommonMark, the base every other flavour extends.
	 */
	CommonMark = 'commonmark',
	/**
	 * Discord's subset. No tables, no headings beyond three levels, and `||` for spoilers.
	 */
	Discord = 'discord',
	/**
	 * GitHub Flavored Markdown. CommonMark plus tables and strikethrough, and what
	 * `remark-gfm` and most web renderers accept.
	 */
	GFM = 'gfm',
}

/**
 * What each flavour treats as syntax.
 */
export interface EscapeRules {
	/**
	 * Characters that mean something wherever they appear.
	 */
	readonly inline: ReadonlySet<string>;
	/**
	 * Characters that only mean something as the first non-space character of a line, such as `#`
	 * for a heading. Escaping these everywhere would put a backslash in front of every hyphen and
	 * every full stop.
	 */
	readonly lineStart: ReadonlySet<string>;
	/**
	 * Whether `1.` and `1)` start an ordered list, so the punctuation after a run of digits at the
	 * start of a line needs escaping too.
	 */
	readonly orderedLists: boolean;
}

const COMMONMARK_INLINE = ['\\', '`', '*', '_', '[', ']', '<'];
const COMMONMARK_LINE_START = ['#', '>', '-', '+', '=', '~'];

const RULES: Record<Flavour, EscapeRules> = {
	[Flavour.CommonMark]: {
		inline: new Set(COMMONMARK_INLINE),
		lineStart: new Set(COMMONMARK_LINE_START),
		orderedLists: true,
	},
	[Flavour.GFM]: {
		inline: new Set([...COMMONMARK_INLINE, '~', '|']),
		lineStart: new Set(COMMONMARK_LINE_START),
		orderedLists: true,
	},
	[Flavour.Discord]: {
		// Discord has no tables and no setext headings, but `||` spoilers and `~~` strikethrough
		// are ordinary text, so both have to go wherever they appear.
		inline: new Set(['\\', '`', '*', '_', '~', '|', '[', ']']),
		lineStart: new Set(['#', '>', '-']),
		orderedLists: true,
	},
};

/**
 *
 * Looks up what a flavour treats as syntax.
 *
 * @param flavour - The flavour to describe.
 * @returns
 */
export const rulesFor = (flavour: Flavour): EscapeRules => RULES[flavour];
