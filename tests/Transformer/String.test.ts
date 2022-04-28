import { Interpreter, Response, StrictVarsParser, StringTransformer } from '../../src';

describe('StringTransformer', () => {
	test('Given a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			await ts.run('{user}', {
				user: new StringTransformer('mahir'),
			}),
		).toStrictEqual(
			new Response({
				user: new StringTransformer('mahir'),
			}).setValues('mahir', '{user}'),
		);
	});

	test('Given a string in as a variable with parameter number THEN returns the value of the variable by splitting with payload and returns the parameter - 1 part', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{user(2)}';
		const variables = {
			user: new StringTransformer('Hello World'),
		};
		expect(await ts.run(text, variables)).toStrictEqual(new Response(variables).setValues('World', text));

		const text2 = '{user(2):W}';
		expect(await ts.run(text2, variables)).toStrictEqual(new Response(variables).setValues('orld', text2));
	});

	test('Given a string in as a variable with parameter number+ or +number THEN returns the value of the variable by splitting with payload and returns the + part by skipping the number part', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{user(+2)}';
		const variables = {
			user: new StringTransformer('Hello World. Hello World.'),
		};
		expect(await ts.run(text, variables)).toStrictEqual(new Response(variables).setValues('Hello World.', text));

		const text2 = '{user(2+)}';
		expect(await ts.run(text2, variables)).toStrictEqual(
			new Response(variables).setValues('World. Hello World.', text2),
		);
	});
});
