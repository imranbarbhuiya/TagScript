import { Interpreter, ReplaceParser, ParenType, Response } from '../src';
const ts = new Interpreter(new ReplaceParser());
describe('ParenType', () => {
	test('Given a string in replace parser THEN replace one with another and returns the string', async () => {
		expect(await ts.run('{replace.Mahrin,Mahir:Hi Mahrin}', {}, null, 2000, ParenType.Dot)).toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace.Mahrin,Mahir:Hi Mahrin}'),
		);
	});

	test('Given a string in replace parser THEN replace one with another and returns the string', async () => {
		expect(await ts.run('{replace.Mahrin,Mahir:Hi Mahrin}', {}, null, 2000, ParenType.Parenthesis)).not.toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace.Mahrin,Mahir:Hi Mahrin}'),
		);
	});
});
