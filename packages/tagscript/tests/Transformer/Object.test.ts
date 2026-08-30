import { describe, expect, test } from 'bun:test';

import { SafeObjectTransformer, Interpreter, Response, StrictVarsParser } from '../../src';

describe('SafeObjectTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());

		expect(
			ts.run('{obj}', {
				obj: new SafeObjectTransformer({ toString: () => '5' }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ toString: () => '5' }),
			}).setValues('5', '{obj}'),
		);

		expect(
			ts.run('{obj.name}', {
				obj: new SafeObjectTransformer({ name: '5' }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: '5' }),
			}).setValues('5', '{obj.name}'),
		);
	});

	test('GIVEN an object with private properties THEN filter them out', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			ts.run('{obj._name}', {
				obj: new SafeObjectTransformer({ _name: '5' }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ _name: '5' }),
			}).setValues('{obj._name}', '{obj._name}'),
		);
	});

	test('GIVEN an object with methods THEN filter them out', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			ts.run('{obj.get}', {
				obj: new SafeObjectTransformer({ get: () => '5' }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ get: () => '5' }),
			}).setValues('{obj.get}', '{obj.get}'),
		);
	});

	test('GIVEN an object with an invalid key THEN return parameter', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			ts.run('{obj.name}', {
				obj: new SafeObjectTransformer({ age: '5' }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ age: '5' }),
			}).setValues('{obj.name}', '{obj.name}'),
		);
	});

	test('GIVEN an object with nested key THEN return the value', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			ts.run('{obj.name.first}', {
				obj: new SafeObjectTransformer({ name: { first: '5' } }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: '5' } }),
			}).setValues('5', '{obj.name.first}'),
		);

		expect(
			ts.run('{obj.name.first.second}', {
				obj: new SafeObjectTransformer({ name: { first: { second: '5' } } }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: { second: '5' } } }),
			}).setValues('5', '{obj.name.first.second}'),
		);

		expect(
			ts.run('{obj.name.first.second.third}', {
				obj: new SafeObjectTransformer({ name: { first: { second: { third: '5' } } } }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: { second: { third: '5' } } } }),
			}).setValues('5', '{obj.name.first.second.third}'),
		);
	});

	test('GIVEN an object with an invalid nested key THEN return null', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		expect(
			ts.run('{obj.name.first.second}', {
				obj: new SafeObjectTransformer({ name: { first: '5' } }),
			}),
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: '5' } }),
			}).setValues('{obj.name.first.second}', '{obj.name.first.second}'),
		);
	});

	describe('sandbox', () => {
		const ts = new Interpreter(new StrictVarsParser());

		const render = async (template: string, obj: Record<string, unknown> | string) =>
			(await ts.run(template, { seedVariables: { obj: new SafeObjectTransformer(obj) } })).body;

		test.each(['constructor', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{obj.${key}}`, { name: 'John' })).toBe(`{obj.${key}}`);
			},
		);

		test('GIVEN toString THEN leave the tag untouched, even though it is an own property', async () => {
			// `makeObject` defines `toString` so a bare `{obj}` renders, but naming it should not
			// render the function's source.
			expect(await render('{obj.toString}', { name: 'John' })).toBe('{obj.toString}');
		});

		test('GIVEN an inherited property behind a dot THEN leave the tag untouched', async () => {
			expect(await render('{obj.nested.constructor}', { nested: { deep: 'ok' } })).toBe('{obj.nested.constructor}');
		});

		test('GIVEN a real nested value THEN still resolve it', async () => {
			expect(await render('{obj.nested.deep}', { nested: { deep: 'ok' } })).toBe('ok');
		});

		test('GIVEN a rendered object THEN never emit native function source', async () => {
			const body = await render('{obj.constructor} {obj.valueOf} {obj.toString}', { name: 'John' });

			expect(body).not.toContain('native code');
		});

		test('GIVEN a underscore prefixed key THEN leave the tag untouched', async () => {
			expect(await render('{obj.__proto__}', { name: 'John' })).toBe('{obj.__proto__}');
		});
	});
});
