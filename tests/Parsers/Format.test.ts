import { StringFormatParser, Interpreter, Response } from '../../src';

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
