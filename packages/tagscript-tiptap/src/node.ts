import { InputRule, mergeAttributes, Node, PasteRule } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';
import { extractTags, findTag } from 'tagscript';

import { placeholder, restoreChips, restoreChipsInJSON, serializeChipsAsText } from './markdown';
import { readTag, toSource } from './tag';

import type { TagScriptAttributes } from './tag';
import type { SuggestionOptions } from '@tiptap/suggestion';
import type { TagDefinition } from 'tagscript';

/**
 * The key the tag picker's plugin is registered under.
 */
export const TagScriptPluginKey = new PluginKey('tagscript');

export interface TagScriptNodeOptions {
	/**
	 * Attributes added to every chip's element.
	 *
	 * @defaultValue \{\}
	 */
	HTMLAttributes: Record<string, unknown>;
	/**
	 * Settings passed through to `@tiptap/suggestion` for the picker. Supply `render` here to show
	 * a list; this package draws none, so it works with any framework.
	 *
	 * @defaultValue \{\}
	 */
	suggestion: Partial<Omit<SuggestionOptions<TagDefinition, TagDefinition>, 'editor'>>;
	/**
	 * Every tag a template is allowed to use. A chip for anything else is marked unknown, and only
	 * the ones marked `insertable` are offered in the picker.
	 *
	 * @defaultValue `[]`
	 */
	tags: readonly TagDefinition[];
	/**
	 * The character that opens the picker, or `null` for no picker.
	 *
	 * @defaultValue '\{'
	 */
	trigger: string | null;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		tagscript: {
			/**
			 * Inserts a tag as a chip at the selection.
			 */
			insertTag: (attributes: { name: string; parameter?: string | null }) => ReturnType;
		};
	}
}

/**
 *
 * Every tag in some text that can become a chip, for a paste.
 *
 * @param text - The pasted text.
 * @returns One match per chip, in document order.
 */
const findChips = (text: string) =>
	extractTags(text)
		.filter((tag) => tag.depth === 0)
		.flatMap((tag) => {
			const chip = readTag(text.slice(tag.start));
			return chip ? [{ index: tag.start, text: chip.source, data: chip }] : [];
		});

/**
 * A TagScript tag as a single inline node.
 *
 * The chip shows the tag's label while the document keeps the tag itself, so renaming a field's
 * label updates every template that uses it. It deletes with one keystroke, and a tag the manifest
 * does not define renders marked as unknown instead of reaching a reader as stray braces.
 *
 * Only `{name}` and `{name(parameter)}` become chips. A tag with a payload stays text, since the
 * payload is template content the author still edits.
 *
 * @example
 * ```ts showLineNumbers
 * new Editor({
 * 	extensions: [StarterKit, Markdown, TagScriptNode.configure({ tags })],
 * 	content: 'Thanks {fullName}!',
 * 	contentType: 'markdown',
 * });
 * ```
 */
export const TagScriptNode = Node.create<TagScriptNodeOptions>({
	name: 'tagscript',
	// Runs after `Markdown`, which parses initial content in its own `onBeforeCreate`.
	priority: 99,
	group: 'inline',
	inline: true,
	atom: true,
	selectable: true,

	addOptions() {
		return { HTMLAttributes: {}, suggestion: {}, tags: [], trigger: '{' };
	},

	addAttributes() {
		return {
			name: {
				default: '',
				parseHTML: (element) => element.getAttribute('data-name') ?? '',
				renderHTML: (attributes) => ({ 'data-name': attributes.name }),
			},
			parameter: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-parameter'),
				renderHTML: (attributes) => (attributes.parameter === null ? {} : { 'data-parameter': attributes.parameter }),
			},
		};
	},

	parseHTML() {
		return [{ tag: 'span[data-tagscript]', priority: 60 }];
	},

	renderHTML({ node, HTMLAttributes }) {
		const attributes = node.attrs as TagScriptAttributes;
		const definition = findTag(this.options.tags, attributes.name);
		const text = definition
			? attributes.parameter === null
				? definition.label
				: `${definition.label} (${attributes.parameter})`
			: toSource(attributes);

		return [
			'span',
			mergeAttributes(
				{
					'data-tagscript': '',
					class: definition ? 'tagscript-tag' : 'tagscript-tag tagscript-tag-unknown',
					...(definition ? {} : { 'data-unknown': '' }),
				},
				this.options.HTMLAttributes,
				HTMLAttributes,
			),
			text,
		];
	},

	renderText({ node }) {
		return toSource(node.attrs as TagScriptAttributes);
	},

	markdownTokenName: 'tagscript',

	markdownTokenizer: {
		name: 'tagscript',
		level: 'inline',
		start: (src) => src.indexOf('{'),
		tokenize: (src) => {
			const chip = readTag(src);
			return chip ? { type: 'tagscript', raw: chip.source, name: chip.name, parameter: chip.parameter } : undefined;
		},
	},

	parseMarkdown(token, helpers) {
		return helpers.createTextNode(placeholder(token.raw!));
	},

	renderMarkdown(node) {
		return toSource(node.attrs as TagScriptAttributes);
	},

	onBeforeCreate() {
		if (!this.editor.markdown) return;

		serializeChipsAsText(this.editor.markdown, this.name);
		const { content } = this.editor.options;
		if (content && typeof content === 'object' && !Array.isArray(content)) {
			this.editor.options.content = restoreChipsInJSON(content, this.name);
		}
	},

	addCommands() {
		return {
			insertTag:
				({ name, parameter = null }) =>
				({ commands }) =>
					commands.insertContent({ type: this.name, attrs: { name, parameter } }),
		};
	},

	addInputRules() {
		return [
			new InputRule({
				find: (text) => {
					const index = text.lastIndexOf('{');
					const chip = index === -1 ? null : readTag(text.slice(index));
					return chip && index + chip.source.length === text.length ? { index, text: chip.source, data: chip } : null;
				},
				handler: ({ state, range, match }) => {
					const { name, parameter } = match.data as TagScriptAttributes;
					const marks = state.doc.resolve(range.from).marks();
					state.tr.replaceWith(range.from, range.to, this.type.create({ name, parameter }, null, marks));
				},
			}),
		];
	},

	addPasteRules() {
		return [
			new PasteRule({
				find: findChips,
				handler: ({ state, range, match }) => {
					const { name, parameter } = match.data as TagScriptAttributes;
					const marks = state.doc.resolve(range.from).marks();
					state.tr.replaceWith(range.from, range.to, this.type.create({ name, parameter }, null, marks));
				},
			}),
		];
	},

	addProseMirrorPlugins() {
		const restore = new Plugin({
			appendTransaction: (transactions, _, state) =>
				transactions.some((transaction) => transaction.docChanged) ? restoreChips(state, this.type) : null,
		});

		if (this.options.trigger === null) return [restore];

		return [
			restore,
			Suggestion<TagDefinition, TagDefinition>({
				editor: this.editor,
				pluginKey: TagScriptPluginKey,
				char: this.options.trigger,
				allowedPrefixes: null,
				items: ({ query }) => {
					const needle = query.toLowerCase();
					return this.options.tags.filter(
						(tag) => tag.insertable && (tag.name.includes(needle) || tag.label.toLowerCase().includes(needle)),
					);
				},
				command: ({ editor, range, props }) => {
					editor
						.chain()
						.focus()
						.insertContentAt(range, { type: this.name, attrs: { name: props.name, parameter: null } })
						.run();
				},
				...this.options.suggestion,
			}),
		];
	},
});
