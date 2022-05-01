import { Interpreter, DefineParser, LooseVarsParser, Response, StringTransformer, StrictVarsParser } from '../../src';
describe('DefineParser', () => {
	describe('LooseVarsParser', () => {
		const ts = new Interpreter(new DefineParser(), new LooseVarsParser());
		test('Given a string in define parser THEN returns the value instead of the variable', async () => {
			expect(await ts.run('{=(user):mahir} {user}')).toStrictEqual(
				new Response({
					user: new StringTransformer('mahir')
				}).setValues('mahir', '{=(user):mahir} {user}')
			);
		});
	});

	describe('StrictVarsParser', () => {
		const ts = new Interpreter(new DefineParser(), new StrictVarsParser());
		test('Given a string in define parser THEN returns the value instead of the variable', async () => {
			const text1 = '{=(user):mahir} {user}';
			expect(await ts.run(text1)).toStrictEqual(
				new Response({
					user: new StringTransformer('mahir')
				}).setValues('mahir', text1)
			);
		});
	});
});
