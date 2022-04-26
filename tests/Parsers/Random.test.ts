import { Interpreter, RandomParser } from '../../src';
const ts = new Interpreter(new RandomParser());
describe('RandomParser', () => {
	test('Given a string in random parser THEN returns a random string from the payload', async () => {
		expect((await ts.run('{random:rkn,priayansh,kashish} won the game')).body).toMatch(
			/(rkn|priyansh|kashish) won the game/,
		);
	});
});
