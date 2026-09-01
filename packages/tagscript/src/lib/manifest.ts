import { extractTags } from './Interpreter/extract';

import type { BaseParser } from './Parsers/Base';

/**
 * What one tag is, in terms a person picking it from a list would recognise.
 *
 * The interpreter does not read this. It exists for everything around a template rather than the
 * render itself: an editor offering a list of tags, a check that a saved template only uses tags
 * that exist, a generated reference.
 */
export interface TagDefinition {
	/**
	 * The tag this one is another name for, when it is an alias.
	 */
	aliasOf?: string;
	/**
	 * What this tag does, in a sentence.
	 */
	description?: string;
	/**
	 * Whether an editor should offer this in a list of tags to insert.
	 *
	 * A tag whose payload is template text the author still has to write, such as `if`, is better
	 * typed by hand than inserted as a finished thing.
	 *
	 * @defaultValue false
	 */
	insertable?: boolean;
	/**
	 * What to show a person instead of {@link TagDefinition.name}.
	 */
	label: string;
	/**
	 * The declaration a template writes, lowercase. Matching ignores case, as `willAccept` does.
	 */
	name: string;
	/**
	 * Whether the tag needs a parameter, and what it means.
	 */
	parameter?: { label?: string; required: boolean };
	/**
	 * Whether the tag needs a payload.
	 */
	payload?: { required: boolean };
}

/**
 *
 * Reads the names and requirements straight off a parser.
 *
 * Anything extending `BaseParser` already declares what it accepts, so a plugin author gets a
 * usable manifest without writing one. Labels and descriptions cannot be derived, so pass them in
 * or fill them afterwards.
 *
 * @param parser - The parser to describe.
 * @param details - Label and description, keyed by tag name.
 * @returns One definition per name the parser accepts, aliases marked as such.
 * @example
 * ```ts showLineNumbers
 * describeParser(new StringFormatParser(), { upper: { label: 'Uppercase' } });
 * ```
 */
export const describeParser = (
	parser: BaseParser,
	details: Record<string, Partial<TagDefinition>> = {},
): TagDefinition[] => {
	const { acceptedNames, requiredParameter, requiredPayload } = parser.toJSON();
	const [primary] = acceptedNames;

	return acceptedNames.map((name) => ({
		name,
		label: name,
		...(name === primary ? {} : { aliasOf: primary }),
		parameter: { required: requiredParameter },
		payload: { required: requiredPayload },
		...details[name],
	}));
};

/**
 *
 * Finds the definition for a declaration, ignoring case the way `willAccept` does.
 *
 * @param tags - The definitions to search.
 * @param declaration - What the template wrote.
 * @returns The definition, or `undefined` when nothing matches.
 */
export const findTag = (tags: readonly TagDefinition[], declaration: string | null): TagDefinition | undefined =>
	declaration === null ? undefined : tags.find((tag) => tag.name === declaration.toLowerCase());

/**
 * A tag a template uses that nothing in the manifest defines.
 */
export interface UnknownTag {
	/**
	 * What the template wrote.
	 */
	declaration: string | null;
	/**
	 * Where it ends, at its closing brace.
	 */
	end: number;
	/**
	 * Where it starts, at its opening brace.
	 */
	start: number;
}

/**
 *
 * Reports every tag in a template that the given manifest does not define.
 *
 * A tag nothing handles is not an error at render time. The interpreter leaves it in the output
 * exactly as written, braces included, and records nothing, so a mistyped tag reaches whoever reads
 * the output and nobody finds out. Run this where the template is written instead, and the person
 * who made the typo is the one who hears about it.
 *
 * @param message - The template to check.
 * @param tags - Every tag that is allowed to appear.
 * @returns The offending tags, in document order.
 * @example
 * ```ts showLineNumbers
 * validateTags('Hi {naem}', [{ name: 'name', label: 'Name' }]);
 * // [{ declaration: 'naem', start: 3, end: 8 }]
 * ```
 */
export const validateTags = (message: string, tags: readonly TagDefinition[]): UnknownTag[] =>
	extractTags(message)
		.filter((tag) => !findTag(tags, tag.tag.declaration))
		.map((tag) => ({ declaration: tag.tag.declaration, start: tag.start, end: tag.end }));

const define = (
	names: string[],
	label: string,
	description: string,
	parameter: boolean,
	payload: boolean,
): TagDefinition[] =>
	names.map((name, index) => ({
		name,
		label,
		description,
		...(index === 0 ? {} : { aliasOf: names[0] }),
		parameter: { required: parameter },
		payload: { required: payload },
	}));

/**
 * Every tag the built-in parsers answer to.
 *
 * None are marked insertable. They all take a payload an author has to write, so an editor is
 * better off letting them type it than inserting a shell. Your own tags, especially ones that stand
 * for a value, are the ones worth offering in a list.
 *
 * This is only accurate for an interpreter that registered all of them. Build the list from the
 * parsers you actually passed to `Interpreter` if you registered a subset.
 */
export const builtinTags: readonly TagDefinition[] = [
	...define(['break'], 'Break', 'Replace the whole output with a message when a condition holds.', true, false),
	...define(
		['5050', '50', '?'],
		'Fifty fifty',
		'Render the payload half the time, and nothing the other half.',
		false,
		true,
	),
	...define(['lower'], 'Lowercase', 'Convert the payload to lower case.', false, true),
	...define(['upper'], 'Uppercase', 'Convert the payload to upper case.', false, true),
	...define(['capitalize'], 'Capitalize', 'Capitalize the payload.', false, true),
	...define(['escape'], 'Escape', 'Escape TagScript syntax in the payload.', false, true),
	...define(['ordinal', 'ord'], 'Ordinal', 'Write a number as 1st, 2nd, 3rd.', false, true),
	...define(['slice', 'substr', 'substring'], 'Slice', 'Cut a substring out of the payload.', true, true),
	...define(['random', 'rand'], 'Random', 'Pick one item at random from a list.', false, true),
	...define(['=', 'assign', 'let', 'var'], 'Define', 'Store a value and reuse it by name later.', true, false),
	...define(['if'], 'If', 'Choose between two messages based on a comparison.', true, true),
	...define(['union', 'any', 'or'], 'Any', 'Return the first branch when any expression is true.', true, true),
	...define(
		['intersection', 'all', 'and'],
		'All',
		'Return the first branch only when every expression is true.',
		true,
		true,
	),
	...define(['json'], 'JSON', 'Turn a JSON payload into a variable with named fields.', true, true),
	...define(['range'], 'Range', 'Pick a random whole number between two bounds.', false, true),
	...define(['rangef'], 'Range, decimal', 'Pick a random decimal number between two bounds.', false, true),
	...define(['replace'], 'Replace', 'Swap every occurrence of one string for another.', true, true),
	...define(
		['includes', 'in', 'contain', 'index', 'lindex'],
		'Includes',
		'Report whether a value is in a piece of text, or where.',
		true,
		true,
	),
	...define(['stop', 'halt', 'error'], 'Stop', 'End the render immediately and return a message.', true, false),
	...define(['urlencode', 'encodeuri'], 'URL encode', 'Encode the payload for use in a URL.', false, true),
	...define(['urldecode'], 'URL decode', 'Decode a URL-encoded payload.', false, true),
];
