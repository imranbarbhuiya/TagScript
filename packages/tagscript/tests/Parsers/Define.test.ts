import { describe, expect, test } from 'bun:test';

import { Interpreter, DefineParser, LooseVarsParser, Response, StringTransformer, StrictVarsParser } from '../../src';
import { rendered } from '../rendered';

describe('DefineParser', () => {
	describe('LooseVarsParser', () => {
		const ts = new Interpreter(new DefineParser(), new LooseVarsParser());
		test('GIVEN a string in define parser THEN returns the value instead of the variable', async () => {
			const text = '{=(user):mahir} {user} {ok}';

			expect(rendered(await ts.run(text))).toStrictEqual(
				rendered(
					new Response({
						user: new StringTransformer('mahir'),
					}).setValues('mahir {ok}', text),
				),
			);
		});
	});

	describe('StrictVarsParser', () => {
		const ts = new Interpreter(new DefineParser(), new StrictVarsParser());
		test('GIVEN a string in define parser THEN returns the value instead of the variable', async () => {
			const text1 = '{=(user):mahir} {user} {ok}';
			expect(rendered(await ts.run(text1))).toStrictEqual(
				rendered(
					new Response({
						user: new StringTransformer('mahir'),
					}).setValues('mahir {ok}', text1),
				),
			);
		});
	});
});
