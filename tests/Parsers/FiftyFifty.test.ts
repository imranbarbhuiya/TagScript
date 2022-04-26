import { Interpreter, FiftyFiftyParser } from '../../src';
const ts = new Interpreter(new FiftyFiftyParser());
describe('FiftyFiftyParser', () => {
	test('Given a string in 5050 parser THEN returns the string or an empty string', async () => {
		expect((await ts.run('{5050:user}')).body).toMatch(/(^user$|^$)/);
	});
});
