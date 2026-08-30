import { describe, expect, test } from 'bun:test';

import { StringFormatParser, Interpreter, Response, OrdinalFormatParser } from '../../src';

describe('FormatParser', () => {
	test('GIVEN a string in format parser THEN return formatted string', async () => {
		const ts = new Interpreter(new StringFormatParser());
		const text1 = '{lower:Hello Parbez!}';
		expect(await ts.run(text1)).toStrictEqual(new Response().setValues('hello parbez!', text1));

		const text2 = '{upper:Hello Parbez!}';
		expect(await ts.run(text2)).toStrictEqual(new Response().setValues('HELLO PARBEZ!', text2));

		const text3 = '{capitalize:hello parbez!}';
		expect(await ts.run(text3)).toStrictEqual(new Response().setValues('Hello parbez!', text3));

		const text4 = '{capitalize:HELLO}';
		expect(await ts.run(text4)).toStrictEqual(new Response().setValues('Hello', text4));

		const text5 = '{escape:Hello| Parbez!}';
		expect(await ts.run(text5)).toStrictEqual(new Response().setValues('Hello\\| Parbez!', text5));

		const text6 = '{anything:Hello| Parbez!}';
		expect(await ts.run(text6)).toStrictEqual(new Response().setValues('{anything:Hello| Parbez!}', text6));
	});
});

describe('OrdinalFormatParser', () => {
	test('GIVEN a string in ordinal format parser THEN return formatted string', async () => {
		const ts = new Interpreter(new OrdinalFormatParser());
		expect(await ts.run('{ordinal:1}')).toStrictEqual(new Response().setValues('1st', '{ordinal:1}'));
		expect(await ts.run('{ordinal:2}')).toStrictEqual(new Response().setValues('2nd', '{ordinal:2}'));
		expect(await ts.run('{ordinal:3}')).toStrictEqual(new Response().setValues('3rd', '{ordinal:3}'));
		expect(await ts.run('{ordinal:4}')).toStrictEqual(new Response().setValues('4th', '{ordinal:4}'));
		expect(await ts.run('{ordinal:101}')).toStrictEqual(new Response().setValues('101st', '{ordinal:101}'));
		expect(await ts.run('{ordinal:1002}')).toStrictEqual(new Response().setValues('1002nd', '{ordinal:1002}'));
		expect(await ts.run('{ordinal:hello}')).toStrictEqual(new Response().setValues('hello', '{ordinal:hello}'));
	});

	test('GIVEN 11, 12 or 13 in any hundred THEN use the th suffix', async () => {
		const ts = new Interpreter(new OrdinalFormatParser());
		expect((await ts.run('{ordinal:11}')).body).toBe('11th');
		expect((await ts.run('{ordinal:12}')).body).toBe('12th');
		expect((await ts.run('{ordinal:13}')).body).toBe('13th');
		expect((await ts.run('{ordinal:111}')).body).toBe('111th');
		expect((await ts.run('{ordinal:112}')).body).toBe('112th');
		expect((await ts.run('{ordinal:21}')).body).toBe('21st');
		expect((await ts.run('{ordinal:22}')).body).toBe('22nd');
		expect((await ts.run('{ordinal:23}')).body).toBe('23rd');
	});
});

describe('StringFormatParser casing', () => {
	const ts = new Interpreter(new StringFormatParser());

	test('GIVEN a declaration in any casing THEN format it the same way', async () => {
		expect((await ts.run('{UPPER:hi}')).body).toBe('HI');
		expect((await ts.run('{Lower:HI}')).body).toBe('hi');
		expect((await ts.run('{CapiTalize:hello there}')).body).toBe('Hello there');
		expect((await ts.run('{ESCAPE:a|b}')).body).toBe('a\\|b');
	});
});
