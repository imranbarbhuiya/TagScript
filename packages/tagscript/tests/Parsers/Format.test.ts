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

		const text4 = '{escape:Hello| Parbez!}';
		expect(await ts.run(text4)).toStrictEqual(new Response().setValues('Hello\\| Parbez!', text4));

		const text5 = '{anything:Hello| Parbez!}';
		expect(await ts.run(text5)).toStrictEqual(new Response().setValues('{anything:Hello| Parbez!}', text5));
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
});
