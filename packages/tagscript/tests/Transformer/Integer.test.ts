import { describe, expect, test } from 'bun:test';

import { IntegerTransformer, Interpreter, Response, StrictVarsParser } from '../../src';
import { rendered } from '../rendered';

describe('IntegerTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			rendered(
				await ts.run('{number}', {
					number: new IntegerTransformer('5'),
				}),
			),
		).toStrictEqual(
			rendered(
				new Response({
					number: new IntegerTransformer('5'),
				}).setValues('5', '{number}'),
			),
		);
	});

	test('GIVEN a string in as a variable with parameter ++ THEN returns the value by incrementing it', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{number(++)}';
		const variables = {
			number: new IntegerTransformer('4'),
		};
		expect(rendered(await ts.run(text, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('5', text)),
		);
	});

	test('GIVEN a string in as a variable with parameter -- THEN returns the value by decrementing it', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		const text = '{number(--)}';
		const variables = {
			number: new IntegerTransformer('4'),
		};
		expect(rendered(await ts.run(text, variables))).toStrictEqual(
			rendered(new Response(variables).setValues('3', text)),
		);
	});
});
