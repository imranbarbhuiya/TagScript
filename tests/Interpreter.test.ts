import { Interpreter, Response } from '../src';
const ts = new Interpreter();
describe('Interpreter', () => {
	test.each(['Parbez', '{test}', '{hi(hello)}', '{a.b}'])('Given a string THEN returns the string', async (input) => {
		expect(await ts.run(input)).toStrictEqual(new Response().setValues(input, input));
	});
});
