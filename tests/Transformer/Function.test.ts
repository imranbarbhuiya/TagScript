import { FunctionTransformer, Interpreter, Response, StrictVarsParser } from '../../src';

describe.skip('FunctionTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());

		await expect(
			ts.run('{value}', {
				value: new FunctionTransformer((tag) => `${tag.declaration}: Hello World`)
			})
		).resolves.toStrictEqual(
			new Response({
				value: new FunctionTransformer((tag) => `${tag.declaration}: Hello World`)
			}).setValues('value: Hello World', '{value}')
		);
	});
});
