import { extractTags } from 'tagscript';

/**
 * What a chip stores. The label is looked up from the manifest each time it renders, so only the
 * part of the tag a template actually contains is kept.
 */
export interface TagScriptAttributes {
	/**
	 * The declaration, as the template wrote it.
	 */
	name: string;
	/**
	 * The parameter, or `null` when the tag has none.
	 */
	parameter: string | null;
}

/**
 *
 * Writes a chip back out as the tag it stands for.
 *
 * @param attributes - The chip's attributes.
 * @returns The tag, braces included.
 */
export const toSource = (attributes: TagScriptAttributes): string =>
	attributes.parameter === null ? `{${attributes.name}}` : `{${attributes.name}(${attributes.parameter})}`;

/**
 *
 * Reads a chip from the start of some text, deciding what counts as a tag the same way the
 * interpreter does.
 *
 * Only a tag without a payload qualifies, since a payload is template text the author still has to
 * edit. A tag that would not come back out exactly as written, such as `{ name }` or `{name:}`, is
 * left as text so saving never rewrites what the author typed.
 *
 * @param text - Text that starts at an opening brace.
 * @returns The chip's attributes and the source it covers, or `null` when it is not one.
 */
export const readTag = (text: string): (TagScriptAttributes & { source: string }) | null => {
	if (!text.startsWith('{')) return null;

	const close = text.indexOf('}');
	if (close === -1) return null;

	const source = text.slice(0, close + 1);
	const tag = extractTags(source).at(0);
	if (tag?.start !== 0 || tag.end !== close) return null;

	const { declaration: name, parameter, payload } = tag.tag;
	if (!name || payload !== null || /\s/.test(name)) return null;

	const attributes = { name, parameter };
	return toSource(attributes) === source ? { ...attributes, source } : null;
};
