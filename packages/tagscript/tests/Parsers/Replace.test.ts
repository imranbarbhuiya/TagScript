import { Interpreter, ReplaceParser, Response } from '../../src';

const ts = new Interpreter(new ReplaceParser());
describe('ReplaceParser', () => {
	test('GIVEN a string in replace parser THEN replace one with another and returns the string', async () => {
		expect(await ts.run('{replace(Mahrin,Mahir):Hi Mahrin}')).toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace(Mahrin,Mahir):Hi Mahrin}')
		);
	});
});
