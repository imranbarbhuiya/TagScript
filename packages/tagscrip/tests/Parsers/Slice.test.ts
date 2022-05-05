import { Interpreter, SliceParser } from '../../src';

describe('SliceParser', () => {
	const ts = new Interpreter(new SliceParser());

	test('GIVEN a string and a start and end index THEN returns a substring of the string', async () => {
		expect((await ts.run('{slice(3): Hello World}')).body).toStrictEqual('llo World');
		expect((await ts.run('{slice(3,5): Hello World}')).body).toStrictEqual('ll');
		expect((await ts.run('{slice(2-6): Hello World}')).body).toStrictEqual('ello');
	});
});
