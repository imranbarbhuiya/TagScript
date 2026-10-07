import { Editor } from '@tiptap/core';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { TagScriptNode, TagScriptPluginKey } from '../src';

import type { TagScriptNodeOptions } from '../src';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { TagDefinition } from 'tagscript';

const tags: TagDefinition[] = [
	{ name: 'fullname', label: 'Full name', insertable: true },
	{ name: 'email', label: 'Email', insertable: true },
	{ name: 'if', label: 'If' },
];

let editor: Editor | undefined;

const createEditor = (content: string, options: Partial<TagScriptNodeOptions> = {}) => {
	const element = document.createElement('div');
	document.body.append(element);
	editor = new Editor({
		element,
		extensions: [StarterKit, Markdown, TagScriptNode.configure({ tags, ...options })],
		content,
		contentType: 'markdown',
	});
	return editor;
};

const focusEnd = (instance: Editor) => {
	instance.commands.setTextSelection(instance.state.doc.content.size - 1);
	instance.view.focus();
};

const chips = (instance: Editor) => [...instance.view.dom.querySelectorAll<HTMLElement>('[data-tagscript]')];

afterEach(() => {
	editor?.destroy();
	editor = undefined;
	document.body.replaceChildren();
});

describe('loading markdown', () => {
	test('GIVEN a known tag THEN render a chip showing its label', () => {
		const instance = createEditor('Thanks {fullName}!');

		const [chip] = chips(instance);
		expect(chip.textContent).toBe('Full name');
		expect(chip.dataset.name).toBe('fullName');
		expect(chip.classList.contains('tagscript-tag-unknown')).toBe(false);
	});

	test('GIVEN a tag with a parameter THEN show the parameter beside the label', () => {
		const [chip] = chips(createEditor('{fullName(first)}'));

		expect(chip.textContent).toBe('Full name (first)');
		expect(chip.dataset.parameter).toBe('first');
	});

	test('GIVEN a tag the manifest does not define THEN render it marked unknown, as written', () => {
		const [chip] = chips(createEditor('Typo: {naem}'));

		expect(chip.textContent).toBe('{naem}');
		expect(chip.classList.contains('tagscript-tag-unknown')).toBe(true);
		expect(chip.hasAttribute('data-unknown')).toBe(true);
	});

	test('GIVEN a tag with a payload THEN leave it as text, with the tags inside it as chips', () => {
		const instance = createEditor('{if({fullName}==Ada):Hi|Bye}');

		expect(chips(instance).map((chip) => chip.dataset.name)).toEqual(['fullName']);
		expect(instance.getText()).toBe('{if({fullName}==Ada):Hi|Bye}');
	});

	test.each(['{ name }', '{name:}', '{}', '{a{b'])(
		'GIVEN %s, which would not come back out as written THEN leave it as text',
		(source) => {
			expect(chips(createEditor(source))).toHaveLength(0);
		},
	);

	test('GIVEN a tag inside inline code THEN leave it as code', () => {
		const instance = createEditor('Write `{fullName}` to use it');

		expect(chips(instance)).toHaveLength(0);
		expect(instance.getMarkdown()).toBe('Write `{fullName}` to use it');
	});

	test('GIVEN a tag inside a code block THEN leave it as code', () => {
		const instance = createEditor('```\n{fullName}\n```');

		expect(chips(instance)).toHaveLength(0);
		expect(instance.getMarkdown()).toBe('```\n{fullName}\n```');
	});

	test('GIVEN a tag inside bold text THEN render a chip inside the bold', () => {
		const instance = createEditor('Thanks **{fullName}**');

		expect(chips(instance)[0]?.closest('strong')).not.toBeNull();
	});
});

describe('saving markdown', () => {
	test.each([
		'Thanks **{fullName}**, see you soon.',
		'{fullName(first)} and {email}',
		'Typo: {naem}',
		'{if({fullName}==Ada):Hi|Bye}',
		'- {fullName}\n- {email}',
		'**Thanks {fullName}**',
		'*{fullName}* wrote [{email}](https://example.com)',
		'Hi {first_name}',
		'{fullName}{fullName}',
	])('GIVEN %j THEN write it back unchanged', (source) => {
		expect(createEditor(source).getMarkdown()).toBe(source);
	});

	test('GIVEN markdown set after the editor exists THEN render chips the same way', () => {
		const instance = createEditor('');
		instance.commands.setContent('Thanks **{fullName}**', { contentType: 'markdown' });

		expect(chips(instance)[0]?.closest('strong')).not.toBeNull();
		expect(instance.getMarkdown()).toBe('Thanks **{fullName}**');
	});

	test('GIVEN a chip THEN plain text output keeps the tag rather than the label', () => {
		expect(createEditor('Hi {fullName}').getText()).toBe('Hi {fullName}');
	});

	test('GIVEN HTML the editor produced THEN read the same chips back', () => {
		const html = createEditor('{fullName(first)} {naem}').getHTML();
		editor?.destroy();

		const instance = createEditor('');
		instance.commands.setContent(html);
		expect(instance.getMarkdown()).toBe('{fullName(first)} {naem}');
	});
});

describe('editing', () => {
	test('GIVEN the caret after a chip WHEN backspace is pressed THEN remove the whole tag', async () => {
		const instance = createEditor('Thanks {fullName}');
		focusEnd(instance);

		await userEvent.keyboard('{Backspace}');

		expect(instance.getText()).toBe('Thanks ');
		expect(chips(instance)).toHaveLength(0);
	});

	test('GIVEN a tag typed by hand WHEN the closing brace is typed THEN turn it into a chip', async () => {
		const instance = createEditor('Hi ', { trigger: null });
		focusEnd(instance);

		await userEvent.keyboard('{{fullName}');
		expect(instance.getText()).toBe('Hi {fullName}');

		expect(chips(instance).map((chip) => chip.textContent)).toEqual(['Full name']);
		expect(instance.getMarkdown()).toBe('Hi {fullName}');
	});

	test('GIVEN a tag typed inside bold text THEN keep the chip bold', async () => {
		const instance = createEditor('**Hi**', { trigger: null });
		focusEnd(instance);

		await userEvent.keyboard(' {{email}');

		expect(instance.getMarkdown()).toBe('**Hi {email}**');
	});

	test('GIVEN text pasted with tags THEN turn each one into a chip', () => {
		const instance = createEditor('');
		focusEnd(instance);

		instance.view.pasteText('{fullName} wrote {if(a==b):x} from {email}');

		expect(chips(instance).map((chip) => chip.dataset.name)).toEqual(['fullName', 'email']);
		expect(instance.getMarkdown()).toBe('{fullName} wrote {if(a==b):x} from {email}');
	});

	test('GIVEN insertTag THEN insert a chip at the selection', () => {
		const instance = createEditor('Hi ');
		instance.chain().focus('end').insertTag({ name: 'email' }).run();

		expect(instance.getMarkdown()).toBe('Hi {email}');
	});
});

describe('picker', () => {
	const capture = () => {
		const seen: SuggestionProps<TagDefinition, TagDefinition>[] = [];
		const record = (props: SuggestionProps<TagDefinition, TagDefinition>) => {
			seen.push(props);
		};
		return { seen, render: () => ({ onStart: record, onUpdate: record }) };
	};

	test('GIVEN the trigger is typed THEN offer only insertable tags matching the query', async () => {
		const { seen, render } = capture();
		const instance = createEditor('Hi ', { suggestion: { render } });
		focusEnd(instance);

		await userEvent.keyboard('{{');
		expect(seen.at(-1)?.items.map((tag) => tag.name)).toEqual(['fullname', 'email']);

		await userEvent.keyboard('nam');
		expect(seen.at(-1)?.items.map((tag) => tag.name)).toEqual(['fullname']);
	});

	test('GIVEN a query matching a label rather than a name THEN still offer the tag', async () => {
		const { seen, render } = capture();
		const instance = createEditor('', {
			suggestion: { render },
			tags: [{ name: 'fn', label: 'Full name', insertable: true }],
		});
		focusEnd(instance);

		await userEvent.keyboard('{{Full');

		expect(seen.at(-1)?.items.map((tag) => tag.name)).toEqual(['fn']);
	});

	test('GIVEN a tag is picked THEN replace the typed query with a chip', async () => {
		const { seen, render } = capture();
		const instance = createEditor('Hi ', { suggestion: { render } });
		focusEnd(instance);

		await userEvent.keyboard('{{em');
		const props = seen.at(-1)!;
		props.command(props.items[0]);

		expect(instance.getMarkdown()).toBe('Hi {email}');
	});

	test('GIVEN trigger is null THEN register no picker', () => {
		const instance = createEditor('', { trigger: null });

		expect(TagScriptPluginKey.get(instance.state)).toBeUndefined();
	});
});

describe('without markdown', () => {
	test('GIVEN no Markdown extension THEN chips round-trip through HTML and write the tag as text', () => {
		const element = document.createElement('div');
		document.body.append(element);
		editor = new Editor({
			element,
			extensions: [StarterKit, TagScriptNode.configure({ tags })],
			content: '<p>Hi <span data-tagscript data-name="fullName"></span></p>',
		});

		expect(chips(editor)[0]?.textContent).toBe('Full name');
		expect(editor.getText()).toBe('Hi {fullName}');
		expect(editor.getHTML()).toContain('data-name="fullName"');
	});
});
