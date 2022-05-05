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
});
