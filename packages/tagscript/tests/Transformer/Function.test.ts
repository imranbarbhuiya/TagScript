import { FunctionTransformer, Lexer } from '../../src';

describe('FunctionTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', () => {
		expect(new FunctionTransformer((tag) => `${tag.declaration}: Hello World`).transform(new Lexer('{value}'))).toStrictEqual(
			'value: Hello World'
		);
	});
});
