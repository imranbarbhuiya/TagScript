import { Interpreter, Response, IfStatementParser, StringTransformer, DefineParser, StrictVarsParser } from '../../src';
const ts = new Interpreter(new IfStatementParser(), new DefineParser(), new StrictVarsParser());
describe('Interpreter', () => {
	test.each(['Parbez', '{test}', '{hi(hello)}', '{a.b}'])('GIVEN a string THEN returns the string', async (input) => {
		expect(await ts.run(input)).toStrictEqual(new Response().setValues(input, input));
	});

	test('GIVEN a string with length greater than character limit THEN throws an error', async () => {
		const input = '{if({args}==63):You guessed it! The number I was thinking of was 63!|Too {if({args}<63):low|high}, try again.}';
		await expect(ts.run(input, { args: new StringTransformer('60') }, 1)).rejects.toThrowError(
			new Error('The TS interpreter had its workload exceeded. The total characters attempted were 2/1')
		);
	});

	test('GIVEN a string with length less than given character limit THEN returns the result', async () => {
		const input = 'Parbez';
		expect(await ts.run(input, {}, 7)).toStrictEqual(new Response().setValues(input, input));
	});

	test('GIVEN parser at construction or using method THEN store them at parsers property', () => {
		const tagscript = new Interpreter(new IfStatementParser());

		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(tagscript['parsers']).toHaveLength(1);

		tagscript.addParsers(new DefineParser());
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(tagscript['parsers']).toHaveLength(2);

		tagscript.setParsers(new DefineParser());
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(tagscript['parsers']).toHaveLength(1);
	});
});
