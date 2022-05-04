import { Context, Interpreter, Lexer, Response } from '../../src';

describe('Context', () => {
	const lexer = new Lexer('{tag}');
	const interpreter = new Interpreter();
	const response = new Response();
	const context = new Context(lexer, response, interpreter, '{tag}');

	test('GIVEN a context THEN Context#toJSON() should return all the props', () => {
		expect(context.toJSON()).toEqual({
			tag: lexer,
			originalMessage: '{tag}',
			interpreter,
			response
		});
	});
});
