import { StringFormatParser, Interpreter, Response, OrdinalFormatParser } from '../../src';

describe('FormatParser', () => {
	test('GIVEN a string in format parser THEN return formatted string', async () => {
		const ts = new Interpreter(new StringFormatParser());
		expect(await ts.run('{lower:Hello Parbez!}')).toStrictEqual(
			new Response().setValues('hello parbez!', '{lower:Hello Parbez!}'),
		);

		expect(await ts.run('{upper:Hello Parbez!}')).toStrictEqual(
			new Response().setValues('HELLO PARBEZ!', '{upper:Hello Parbez!}'),
		);

		expect(await ts.run('{capitalize:hello parbez!}')).toStrictEqual(
			new Response().setValues('Hello parbez!', '{capitalize:hello parbez!}'),
		);
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
	});
});
