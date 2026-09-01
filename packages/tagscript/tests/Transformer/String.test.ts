import { describe, expect, test } from 'bun:test';

import { Interpreter, Response, StrictVarsParser, StringTransformer } from '../../src';
import { rendered } from '../rendered';

describe('StringTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			rendered(
				await ts.run('{user}', {
					user: new StringTransformer('mahir'),
				}),
			),
		).toStrictEqual(
			rendered(
				new Response({
					user: new StringTransformer('mahir'),
				}).setValues('mahir', '{user}'),
			),
		);
	});

	test('GIVEN a string in as a variable with parameter number THEN returns the value of the variable by splitting with payload and returns the parameter - 1 part', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{user(2)}';
		const variables = {
			user: new StringTransformer('Hello World'),
		};
		expect(rendered(await ts.run(text, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('World', text)),
		);

		const text2 = '{user(2):W}';
		expect(rendered(await ts.run(text2, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('orld', text2)),
		);

		const text3 = '{user(10)}';
		expect(rendered(await ts.run(text3, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('Hello World', text3)),
		);
	});

	test('GIVEN a string in as a variable with parameter number+ or +number THEN returns the value of the variable by splitting with payload and returns the + part by skipping the number part', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{user(+2)}';
		const variables = {
			user: new StringTransformer('Hello World. Hello World.'),
		};
		expect(rendered(await ts.run(text, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('Hello World.', text)),
		);

		const text2 = '{user(2+)}';
		expect(rendered(await ts.run(text2, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('World. Hello World.', text2)),
		);

		const text3 = '{user(2+3)}';
		expect(rendered(await ts.run(text3, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('Hello World. Hello World.', text3)),
		);
	});

	test('GIVEN a string in StringTransformer with escape true THEN escape the string', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{user}';
		const variables = {
			user: new StringTransformer('Parbez|Barbhuiya', true),
		};
		expect(rendered(await ts.run(text, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('Parbez\\|Barbhuiya', text)),
		);
	});
});
