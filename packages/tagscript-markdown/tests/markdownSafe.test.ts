import { describe, expect, test } from 'bun:test';

import {
	DefineParser,
	IfStatementParser,
	Interpreter,
	StringFormatParser,
	StringTransformer,
	StrictVarsParser,
} from 'tagscript';

import { Flavour, markdownSafe } from '../src';

const ts = new Interpreter(
	new StrictVarsParser(),
	new StringFormatParser(),
	new IfStatementParser(),
	new DefineParser(),
);

const render = async (template: string, values: Record<string, string> = {}) =>
	ts.run(template, {
		seedVariables: Object.fromEntries(
			Object.entries(values).map(([name, value]) => [name, new StringTransformer(value)]),
		),
		spans: true,
	});

describe('markdownSafe', () => {
	test('GIVEN a response rendered without spans THEN refuse, rather than return it unescaped', async () => {
		const response = await ts.run('{upper:hi}');
		expect(() => markdownSafe(response)).toThrow('spans: true');
	});

	test('GIVEN a body of null THEN return null', () => {
		expect(markdownSafe({ body: null, spans: [] })).toBeNull();
	});

	test('GIVEN a template with no tags THEN return it untouched, syntax and all', async () => {
		const response = await render('**Bold** and _italic_, written by the author.');
		expect(markdownSafe(response)).toBe('**Bold** and _italic_, written by the author.');
	});

	test('GIVEN a value with syntax THEN escape the value and keep the author formatting', async () => {
		const response = await render('Welcome **{name}**!', { name: '_ _** @everyone' });
		expect(markdownSafe(response)).toBe('Welcome **\\_ \\_\\*\\* @everyone**!');
	});

	test('GIVEN a value that would plant a link THEN neutralise it', async () => {
		const response = await render('Thanks {name}.', { name: '[click](https://evil.tld)' });
		expect(markdownSafe(response)).toBe('Thanks \\[click\\](https://evil.tld).');
	});

	test('GIVEN a value on its own line THEN the positional rules apply to it', async () => {
		const response = await render('{name}', { name: '# Heading' });
		expect(markdownSafe(response)).toBe('\\# Heading');
	});

	test('GIVEN a value part way along a line THEN a hash in it is not a heading', async () => {
		const response = await render('Issue {name}', { name: '#42' });
		expect(markdownSafe(response)).toBe('Issue #42');
	});

	test('GIVEN a built-in tag THEN leave its output alone, since the author wrote the payload', async () => {
		const response = await render('{if(1==1):**yes**|no}');
		expect(markdownSafe(response)).toBe('**yes**');
	});

	test('GIVEN a value inside a built-in tag THEN still escape it', async () => {
		const response = await render('{upper:{name}}', { name: '*ada*' });
		expect(markdownSafe(response)).toBe('\\*ADA\\*');
	});

	test('GIVEN a value only in a condition THEN do not escape the branch it chose', async () => {
		const response = await render('{if({name}==Ada):**match**|no}', { name: 'Ada' });
		expect(markdownSafe(response)).toBe('**match**');
	});

	test('GIVEN two values THEN escape each in place', async () => {
		const response = await render('{a} and {b}', { a: '*one*', b: '_two_' });
		expect(markdownSafe(response)).toBe('\\*one\\* and \\_two\\_');
	});

	test('GIVEN a flavour THEN use its rules', async () => {
		const response = await render('{name}', { name: 'a|b' });
		expect(markdownSafe(response, Flavour.GFM)).toBe('a\\|b');
		expect(markdownSafe(response, Flavour.CommonMark)).toBe('a|b');
	});

	test('GIVEN a trust list naming a variable THEN leave its output formatting alone', async () => {
		const response = await render('{name}', { name: '*ada*' });
		expect(markdownSafe(response, Flavour.GFM, { trust: ['name'] })).toBe('*ada*');
	});

	test('GIVEN untrust naming a built-in THEN escape it after all', async () => {
		const response = await render('{if(1==1):**yes**|no}');
		expect(markdownSafe(response, Flavour.GFM, { untrust: ['if'] })).toBe('\\*\\*yes\\*\\*');
	});

	test('GIVEN a trust list of definitions THEN read the names off them', async () => {
		const response = await render('{name}', { name: '*ada*' });
		expect(markdownSafe(response, Flavour.GFM, { trust: [{ name: 'name', label: 'Name' }] })).toBe('*ada*');
	});
});
