import { readTag, toSource } from './tag';

import type { TagScriptAttributes } from './tag';
import type { JSONContent } from '@tiptap/core';
import type { MarkdownManager } from '@tiptap/markdown';
import type { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';

/*
 * `@tiptap/markdown` only applies marks to text, and closes every open mark around any other inline
 * node, so `**{name}**` loses its bold on load and corrupts the markdown on save. A chip therefore
 * crosses the markdown boundary as text between two private-use characters, which takes marks and
 * escaping like any other text, and becomes a chip again on either side.
 */
const OPEN = '';
const CLOSE = '';
const PLACEHOLDER = /([^]*)/g;

/**
 *
 * The text a tag is parsed into, until {@link restoreChips} turns it into a chip.
 *
 * @param source - The tag, braces included.
 * @returns The placeholder text.
 */
export const placeholder = (source: string) => `${OPEN}${source}${CLOSE}`;

/**
 *
 * Replaces every parsed placeholder in a document with a chip carrying the placeholder's marks.
 *
 * @param state - The state to read.
 * @param type - The chip node type.
 * @returns A transaction doing so, or `null` when there is nothing to replace.
 */
export const restoreChips = (state: EditorState, type: NodeType): Transaction | null => {
	const found: { from: number; to: number; node: ProseMirrorNode }[] = [];

	state.doc.descendants((node, position) => {
		if (!node.isText || !node.text?.includes(OPEN)) return;

		for (const match of node.text.matchAll(PLACEHOLDER)) {
			const chip = readTag(match[1]);
			const from = position + match.index;
			const to = from + match[0].length;
			found.push({
				from,
				to,
				node: chip
					? type.create({ name: chip.name, parameter: chip.parameter }, null, node.marks)
					: state.schema.text(match[1], node.marks),
			});
		}
	});

	if (!found.length) return null;

	const { tr } = state;
	for (const { from, to, node } of found.reverse()) tr.replaceWith(from, to, node);
	return tr;
};

/**
 *
 * Does what {@link restoreChips} does, on content that is not in an editor yet.
 *
 * @param node - The parsed content.
 * @param name - The chip node's name.
 * @returns The content with chips in place of placeholders.
 */
export const restoreChipsInJSON = (node: JSONContent, name: string): JSONContent => {
	if (!node.content) return node;

	const content = node.content.flatMap((child): JSONContent[] => {
		if (child.type !== 'text' || !child.text?.includes(OPEN)) return [restoreChipsInJSON(child, name)];

		const parts: JSONContent[] = [];
		const text = (value: string) => value && parts.push({ ...child, text: value });
		let last = 0;
		for (const match of child.text.matchAll(PLACEHOLDER)) {
			text(child.text.slice(last, match.index));
			const chip = readTag(match[1]);
			if (chip) parts.push({ type: name, attrs: { name: chip.name, parameter: chip.parameter }, marks: child.marks });
			else text(match[1]);
			last = match.index + match[0].length;
		}
		text(child.text.slice(last));
		return parts;
	});

	return { ...node, content };
};

/**
 *
 * Makes a markdown manager write chips as text, so marks around them come out the way they would
 * around any other text.
 *
 * @param manager - The editor's markdown manager.
 * @param name - The chip node's name.
 */
export const serializeChipsAsText = (manager: MarkdownManager, name: string) => {
	const serialize = manager.serialize.bind(manager);

	manager.serialize = (content: JSONContent) => {
		const sources: string[] = [];
		const swap = (node: JSONContent): JSONContent => {
			if (node.type === name) {
				sources.push(toSource(node.attrs as TagScriptAttributes));
				return { type: 'text', text: placeholder(String(sources.length - 1)), marks: node.marks };
			}
			return node.content ? { ...node, content: node.content.map(swap) } : node;
		};

		return serialize(swap(content)).replaceAll(PLACEHOLDER, (_, index: string) => sources[Number(index)]);
	};
};
