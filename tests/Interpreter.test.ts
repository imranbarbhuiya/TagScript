import { Interpreter, Response, IfStatementParser, StringTransformer, DefineParser } from '../src';
const ts = new Interpreter(new IfStatementParser());
describe('Interpreter', () => {
	test.each(['Parbez', '{test}', '{hi(hello)}', '{a.b}'])('Given a string THEN returns the string', async (input) => {
		expect(await ts.run(input)).toStrictEqual(new Response().setValues(input, input));
	});

	test('Given a string with length greater than character limit THEN throws an error', async () => {
		const input = '{if({args}==63):You guessed it! The number I was thinking of was 63!|Too {if({args}<63):low|high}, try again.}';
		await expect(ts.run(input, { args: new StringTransformer('60') }, 1)).rejects.toThrowError(
			new Error('The TS interpreter had its workload exceeded. The total characters attempted were 4/1')
		);
	});

	test('GIVEN parser at construction or using method THEN store them at parsers property', () => {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(ts['parsers']).toHaveLength(1);

		ts.addParsers(new DefineParser());
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(ts['parsers']).toHaveLength(2);

		ts.setParsers(new DefineParser());
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(ts['parsers']).toHaveLength(1);
	});
});
