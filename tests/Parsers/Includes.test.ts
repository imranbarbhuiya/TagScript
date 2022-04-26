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
});
