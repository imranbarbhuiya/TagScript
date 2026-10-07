import { fromMarkdown } from 'mdast-util-from-markdown';
import { Interpreter, StrictVarsParser, StringFormatParser, StringTransformer } from 'tagscript';
import { describe, expect, test } from 'vitest';

import { Flavour, codeRanges, codeRangesFromMdast } from '../src';

import type { SkipRange } from 'tagscript';

const slices = (template: string, ranges: SkipRange[]) => ranges.map((range) => template.slice(range.start, range.end));

describe('codeRanges', () => {
	test.each([
		['inline code', 'Use `{upper:x}` here', ['`{upper:x}`']],
		['double backticks around a backtick', 'Use ``a ` {b}`` here', ['``a ` {b}``']],
		['a fenced block', 'Before\n```\n{upper:x}\n```\nafter', ['```\n{upper:x}\n```']],
		['a fence with an info string', '```ts\nconst a = {b};\n```', ['```ts\nconst a = {b};\n```']],
		['a tilde fence', '~~~\n{x}\n~~~', ['~~~\n{x}\n~~~']],
		['a longer closing fence', '```\n{x}\n`````', ['```\n{x}\n`````']],
		['a fence inside a list item', '- item\n  ```\n  {x}\n  ```', ['```\n  {x}\n  ```']],
		['a fence inside a quote', '> ```\n> {x}\n> ```', ['```\n> {x}\n> ```']],
		['an unclosed fence, which runs to the end', 'a\n```\n{x}\n{y}', ['```\n{x}\n{y}']],
		['a shorter fence inside a block, which does not close it', '````\n```\n{x}\n````', ['````\n```\n{x}\n````']],
		['inline code after a fenced block', '```\na\n```\nthen `{x}`', ['```\na\n```', '`{x}`']],
	])('GIVEN %s THEN cover exactly the code', (_, template, expected) => {
		expect(slices(template, codeRanges(template))).toStrictEqual(expected);
	});

	test.each([
		['an unmatched backtick', 'it`s {name}'],
		['an escaped backtick', 'a \\`{name}\\` b'],
		['backticks split by a blank line', 'a `{x}\n\n{y}` b'],
		['runs of different lengths', 'a ``{x}` b'],
		['backticks in a backtick fence info string, which make it inline code instead', '```a`b\n{x}'],
		['no code at all', 'Thanks {name}'],
	])('GIVEN %s THEN find no code', (_, template) => {
		expect(codeRanges(template)).toStrictEqual([]);
	});

	test.each([
		'Use `{upper:x}` here',
		'Before\n```\n{upper:x}\n```\nafter `{y}`',
		'~~~\n{x}\n~~~\n\nand ``{y}``',
		'- item\n  ```\n  {x}\n  ```',
		'> ```\n> {x}\n> ```',
		'it`s {name} and `{x}`',
		'a `{x}\n\n{y}` b',
		'a \\`{name}\\` b',
		'a\n```\n{x}\n{y}',
		'````\n```\n{x}\n````',
		'```\na\n```\nthen `{x}`',
	])('GIVEN %j THEN agree with a real CommonMark parser', (template) => {
		expect(codeRanges(template, Flavour.CommonMark)).toStrictEqual(codeRangesFromMdast(fromMarkdown(template)));
	});

	describe('Discord', () => {
		test.each([
			['a block closed on the same line', 'a ```{x}``` b', ['```{x}```']],
			['a block closed at the end of a line', '```js\nconst a = {b};```', ['```js\nconst a = {b};```']],
			['inline code across lines', 'a `{x}\n{y}` b', ['`{x}\n{y}`']],
			['tildes, which are not a fence', '~~~\n{x}\n~~~', []],
		])('GIVEN %s THEN follow Discord', (_, template, expected) => {
			expect(slices(template, codeRanges(template, Flavour.Discord))).toStrictEqual(expected);
		});
	});
});

describe('codeRangesFromMdast', () => {
	test('GIVEN a tree THEN return every code node, nested ones included', () => {
		const template = '# Hi `{a}`\n\n> - ```\n>   {b}\n>   ```\n\n    {c}\n';
		expect(slices(template, codeRangesFromMdast(fromMarkdown(template)))).toStrictEqual([
			'`{a}`',
			'```\n>   {b}\n>   ```',
			'    {c}',
		]);
	});

	test('GIVEN a node without positions THEN skip it rather than guess', () => {
		expect(codeRangesFromMdast({ type: 'root', children: [{ type: 'inlineCode' }] })).toStrictEqual([]);
	});
});

describe('rendering with code ranges', () => {
	test('GIVEN a template documenting TagScript THEN run the real tags and leave the examples alone', async () => {
		const ts = new Interpreter(new StringFormatParser(), new StrictVarsParser());
		const template = 'Hi {upper:{name}}! Write `{upper:text}` to shout:\n```\n{upper:hello}\n```';

		const response = await ts.run(template, {
			seedVariables: { name: new StringTransformer('Ada') },
			skipRanges: codeRanges(template),
		});

		expect(response.body).toBe('Hi ADA! Write `{upper:text}` to shout:\n```\n{upper:hello}\n```');
	});
});
