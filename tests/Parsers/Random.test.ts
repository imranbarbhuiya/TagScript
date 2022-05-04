import { Interpreter, RandomParser } from '../../src';
const ts = new Interpreter(new RandomParser());
describe('RandomParser', () => {
	test('GIVEN some choices separated with comma in random parser THEN returns a random string from the payload', async () => {
		expect((await ts.run('{random:rkn,priyansh,kashish} won the game')).body).toMatch(/(?:rkn|priyansh|kashish) won the game/);
	});

	test('GIVEN some choices separated with ~ in random parser THEN returns a random string from the payload', async () => {
		expect((await ts.run('{random:rkn~priyansh~kashish} won the game')).body).toMatch(/(?:rkn|priyansh|kashish) won the game/);
	});

	test('GIVEN some choices separated with ~ as well as comma in random parser THEN respect ~ and ignore ,', async () => {
		expect((await ts.run('{random:rkn,priyansh~kashish} won the game')).body).toMatch(/(?:rkn,priyansh|kashish) won the game/);
	});
});
