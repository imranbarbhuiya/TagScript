import { Interpreter, ReplaceParser, ParenType, Response } from '../../src';

const ts = new Interpreter(new ReplaceParser());
describe('ParenType', () => {
	test('GIVEN a string with dot param in param type dot THEN parse as dot param', async () => {
		expect(await ts.run('{replace.Mahrin,Mahir:Hi Mahrin}', {}, null, 2_000, ParenType.Dot)).toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace.Mahrin,Mahir:Hi Mahrin}')
		);
	});

	test("GIVEN a string with dot param in param type parenthesis THEN don't parse as dot param", async () => {
		expect(await ts.run('{replace.Mahrin,Mahir:Hi Mahrin}', {}, null, 2_000, ParenType.Parenthesis)).not.toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace.Mahrin,Mahir:Hi Mahrin}')
		);
	});

	test("GIVEN a string in both param type THEN don't mix the parsing", async () => {
		expect(await ts.run('{replace.Mahrin,Mahir):Hi Mahrin}')).not.toStrictEqual(
			new Response().setValues('Hi Mahir', '{replace.Mahrin,Mahir):Hi Mahrin}')
		);
	});
});
