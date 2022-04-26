import { IncludesParser, Interpreter, Response } from '../../src';

const ts = new Interpreter(new IncludesParser());
describe('IncludesParser', () => {
	test('GIVEN a string THEN check if a substring exist in that string', async () => {
		expect(await ts.run('{in(hi):Hello Parbez!}')).toStrictEqual(
			new Response().setValues('false', '{in(hi):Hello Parbez!}'),
		);

		expect(await ts.run('{includes(Parbez):Hello Parbez!}')).toStrictEqual(
			new Response().setValues('true', '{includes(Parbez):Hello Parbez!}'),
		);
	});

	test('GIVEN a string THEN give index of the substring', async () => {
		expect(await ts.run('{index(hi):Hello Parbez!}')).toStrictEqual(
			new Response().setValues('-1', '{index(hi):Hello Parbez!}'),
		);

		expect(await ts.run('{index(Parbez):Hello Parbez!}')).toStrictEqual(
			new Response().setValues('6', '{index(Parbez):Hello Parbez!}'),
		);
	});
});
