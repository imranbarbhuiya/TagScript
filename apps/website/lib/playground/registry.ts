import {
	CooldownParser,
	DateFormatParser,
	DeleteParser,
	DenyParser,
	EmbedParser,
	FilesParser,
	RequiredParser,
	SilentParser,
} from '@tagscript/plugin-discord';
import {
	BreakParser,
	extractTags,
	DefineParser,
	FiftyFiftyParser,
	FunctionTransformer,
	IfStatementParser,
	IncludesParser,
	IntegerTransformer,
	IntersectionStatementParser,
	JSONVarParser,
	LooseVarsParser,
	OrdinalFormatParser,
	RandomParser,
	RangeParser,
	ReplaceParser,
	SafeObjectTransformer,
	SliceParser,
	StopParser,
	StrictVarsParser,
	StringFormatParser,
	StringTransformer,
	UnionStatementParser,
	UrlDecodeParser,
	UrlEncodeParser,
} from 'tagscript';

import type { IParser, ITransformer, TagDefinition } from 'tagscript';

/**
 * One parser a visitor can switch on or off.
 */
export interface ParserEntry {
	/**
	 * Which list it belongs to.
	 */
	group: 'core' | 'discord';
	/**
	 * Stable short id, used in the shared link.
	 */
	id: string;
	/**
	 * What to call it.
	 */
	label: string;
	/**
	 * The tags it answers to, shown so a visitor can see what turning it on gives them.
	 */
	tags: string[];
	/**
	 * Builds a fresh one. Parsers hold no state between renders, but `DefineParser` writes to the
	 * response, so a run gets its own.
	 */
	create: () => IParser;
}

export const PARSERS: ParserEntry[] = [
	{
		id: 'vars',
		label: 'Variables, strict',
		tags: ['a seeded name'],
		group: 'core',
		create: () => new StrictVarsParser(),
	},
	{ id: 'loose', label: 'Variables, loose', tags: ['any name'], group: 'core', create: () => new LooseVarsParser() },
	{
		id: 'define',
		label: 'Define',
		tags: ['=', 'assign', 'let', 'var'],
		group: 'core',
		create: () => new DefineParser(),
	},
	{ id: 'if', label: 'If', tags: ['if'], group: 'core', create: () => new IfStatementParser() },
	{ id: 'any', label: 'Any', tags: ['union', 'any', 'or'], group: 'core', create: () => new UnionStatementParser() },
	{
		id: 'all',
		label: 'All',
		tags: ['intersection', 'all', 'and'],
		group: 'core',
		create: () => new IntersectionStatementParser(),
	},
	{
		id: 'format',
		label: 'Text case',
		tags: ['lower', 'upper', 'capitalize', 'escape'],
		group: 'core',
		create: () => new StringFormatParser(),
	},
	{ id: 'ord', label: 'Ordinal', tags: ['ordinal', 'ord'], group: 'core', create: () => new OrdinalFormatParser() },
	{
		id: 'slice',
		label: 'Slice',
		tags: ['slice', 'substr', 'substring'],
		group: 'core',
		create: () => new SliceParser(),
	},
	{ id: 'replace', label: 'Replace', tags: ['replace'], group: 'core', create: () => new ReplaceParser() },
	{
		id: 'includes',
		label: 'Includes',
		tags: ['includes', 'in', 'contain', 'index', 'lindex'],
		group: 'core',
		create: () => new IncludesParser(),
	},
	{ id: 'random', label: 'Random', tags: ['random', 'rand'], group: 'core', create: () => new RandomParser() },
	{ id: 'range', label: 'Range', tags: ['range', 'rangef'], group: 'core', create: () => new RangeParser() },
	{ id: '5050', label: 'Fifty fifty', tags: ['5050', '50', '?'], group: 'core', create: () => new FiftyFiftyParser() },
	{ id: 'json', label: 'JSON', tags: ['json'], group: 'core', create: () => new JSONVarParser() },
	{
		id: 'url',
		label: 'URL encode',
		tags: ['urlencode', 'encodeuri'],
		group: 'core',
		create: () => new UrlEncodeParser(),
	},
	{ id: 'urld', label: 'URL decode', tags: ['urldecode'], group: 'core', create: () => new UrlDecodeParser() },
	{ id: 'break', label: 'Break', tags: ['break'], group: 'core', create: () => new BreakParser() },
	{ id: 'stop', label: 'Stop', tags: ['stop', 'halt', 'error'], group: 'core', create: () => new StopParser() },
	{ id: 'd-embed', label: 'Embed', tags: ['embed'], group: 'discord', create: () => new EmbedParser() },
	{
		id: 'd-date',
		label: 'Timestamp',
		tags: ['date', 'unix', 'currenttime'],
		group: 'discord',
		create: () => new DateFormatParser(),
	},
	{
		id: 'd-cooldown',
		label: 'Cooldown',
		tags: ['cooldown', 'cd'],
		group: 'discord',
		create: () => new CooldownParser(),
	},
	{ id: 'd-silent', label: 'Silent', tags: ['silent'], group: 'discord', create: () => new SilentParser() },
	{ id: 'd-delete', label: 'Delete', tags: ['delete', 'del'], group: 'discord', create: () => new DeleteParser() },
	{ id: 'd-files', label: 'Files', tags: ['files'], group: 'discord', create: () => new FilesParser() },
	{
		id: 'd-require',
		label: 'Require',
		tags: ['require', 'allowlist', 'whitelist'],
		group: 'discord',
		create: () => new RequiredParser(),
	},
	{
		id: 'd-deny',
		label: 'Deny',
		tags: ['deny', 'denylist', 'blacklist'],
		group: 'discord',
		create: () => new DenyParser(),
	},
];

/**
 * Which parsers a first visit starts with. Enough to run the example, not so many that the list
 * reads as noise.
 */
export const DEFAULT_PARSERS = ['vars', 'define', 'if', 'format', 'random', 'range', 'ord'];

/**
 * The kinds of value a visitor can seed, one per transformer the library ships.
 */
export const TRANSFORMERS = {
	string: {
		label: 'Text',
		hint: 'Split with a parameter, as in {name(2)}',
		build: (value: string) => new StringTransformer(value),
	},
	integer: {
		label: 'Number',
		hint: 'Takes ++ and -- as a parameter',
		// The type wants a numeric literal, and a visitor can type anything. The transformer parses
		// it and reports nothing for a value it cannot read, which is what we want to be able to show.
		build: (value: string) => new IntegerTransformer(value as `${number}`),
	},
	object: {
		label: 'JSON',
		hint: 'Read a field with {name(field)}',
		build: (value: string) => new SafeObjectTransformer(value),
	},
	function: {
		label: 'Function',
		hint: 'Returns this text, whatever the tag asks for',
		build: (value: string) => new FunctionTransformer(() => value),
	},
} satisfies Record<string, { build: (value: string) => ITransformer; hint: string; label: string }>;

export type TransformerKind = keyof typeof TRANSFORMERS;

/**
 *
 * Describes every tag the chosen parsers answer to, plus the seeded variables.
 *
 * The tokenizer uses this to tell a tag that will be handled from one that will not, which is what
 * greys out a name nothing is registered for.
 *
 * @param enabled - The ids of the parsers that are on.
 * @param variableNames - The names of the seeded variables.
 * @param template - The template itself, read for the names it defines as it goes.
 * @returns The tags that will be handled, or `null` when that cannot be known, which is when a
 * loose variable parser is on and answers to any name at all.
 */
export const manifestFor = (
	enabled: readonly string[],
	variableNames: readonly string[],
	template: string,
): TagDefinition[] | null => {
	if (enabled.includes('loose')) return null;

	return [
		...PARSERS.filter((parser) => enabled.includes(parser.id) && parser.id !== 'vars')
			.flatMap((parser) => parser.tags)
			.map((name) => ({ name, label: name })),
		...variableNames.map((name) => ({ name, label: name })),
		...definedIn(template).map((name) => ({ name, label: name })),
	];
};

/**
 * Tags that name a new variable in their parameter, so `{=(greeting):hi}` makes `{greeting}` a tag
 * that will be handled even though nothing seeded it.
 */
const DEFINING_TAGS = new Set(['=', 'assign', 'let', 'var', 'json']);

/**
 *
 * Finds the variables a template defines for itself.
 *
 * Without this, a name the template assigned a few lines earlier reads as a typo, which is worse
 * than saying nothing. The only warning worth showing is one that is always right.
 *
 * @param template - The template to read.
 * @returns
 */
function definedIn(template: string): string[] {
	return extractTags(template)
		.filter((tag) => tag.tag.declaration !== null && DEFINING_TAGS.has(tag.tag.declaration.toLowerCase()))
		.map((tag) => tag.tag.parameter)
		.filter((name): name is string => Boolean(name));
}
