import { Interpreter, FiftyFiftyParser } from '../../src';

const ts = new Interpreter(new FiftyFiftyParser());
describe('FiftyFiftyParser', () => {
	test('GIVEN a string in 5050 parser THEN returns the string or an empty string', async () => {
		// eslint-disable-next-line prefer-named-capture-group
		expect((await ts.run('{5050:user}')).body).toMatch(/(^user$|^$)/);
	});
});
