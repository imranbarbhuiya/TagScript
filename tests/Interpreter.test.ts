import { Interpreter, Response } from '../src';
const ts = new Interpreter();
describe('Interpreter', () => {
	test.each(['Parbez', 'Priyansh', 'Psycotic', '{test}'])('Given a string THEN returns the string', async (input) => {
		expect(await ts.run(input)).toStrictEqual(new Response().setValues(input, input));
	});
});
