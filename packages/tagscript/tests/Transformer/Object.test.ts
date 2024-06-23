import { SafeObjectTransformer, Interpreter, Response, StrictVarsParser } from '../../src';

describe('SafeObjectTransformer', () => {
	test('GIVEN a string in as a variable THEN returns the value instead of the variable', async () => {
		const ts = new Interpreter(new StrictVarsParser());

		await expect(
			ts.run('{obj}', {
				obj: new SafeObjectTransformer({ toString: () => '5' })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ toString: () => '5' })
			}).setValues('5', '{obj}')
		);

		await expect(
			ts.run('{obj.name}', {
				obj: new SafeObjectTransformer({ name: '5' })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: '5' })
			}).setValues('5', '{obj.name}')
		);
	});

	test('GIVEN an object with private properties THEN filter them out', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		await expect(
			ts.run('{obj._name}', {
				obj: new SafeObjectTransformer({ _name: '5' })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ _name: '5' })
			}).setValues('{obj._name}', '{obj._name}')
		);
	});

	test('GIVEN an object with methods THEN filter them out', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		await expect(
			ts.run('{obj.get}', {
				obj: new SafeObjectTransformer({ get: () => '5' })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ get: () => '5' })
			}).setValues('{obj.get}', '{obj.get}')
		);
	});

	test('GIVEN an object with an invalid key THEN return parameter', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		await expect(
			ts.run('{obj.name}', {
				obj: new SafeObjectTransformer({ age: '5' })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ age: '5' })
			}).setValues('{obj.name}', '{obj.name}')
		);
	});

	test('GIVEN an object with nested key THEN return the value', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		await expect(
			ts.run('{obj.name.first}', {
				obj: new SafeObjectTransformer({ name: { first: '5' } })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: '5' } })
			}).setValues('5', '{obj.name.first}')
		);

		await expect(
			ts.run('{obj.name.first.second}', {
				obj: new SafeObjectTransformer({ name: { first: { second: '5' } } })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: { second: '5' } } })
			}).setValues('5', '{obj.name.first.second}')
		);

		await expect(
			ts.run('{obj.name.first.second.third}', {
				obj: new SafeObjectTransformer({ name: { first: { second: { third: '5' } } } })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: { second: { third: '5' } } } })
			}).setValues('5', '{obj.name.first.second.third}')
		);
	});

	test('GIVEN an object with an invalid nested key THEN return null', async () => {
		const ts = new Interpreter(new StrictVarsParser());
		await expect(
			ts.run('{obj.name.first.second}', {
				obj: new SafeObjectTransformer({ name: { first: '5' } })
			})
		).resolves.toStrictEqual(
			new Response({
				obj: new SafeObjectTransformer({ name: { first: '5' } })
			}).setValues('{obj.name.first.second}', '{obj.name.first.second}')
		);
	});
});
