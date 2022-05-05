import { RangeParser, Interpreter } from '../../src';

describe('RangeParser', () => {
	const ts = new Interpreter(new RangeParser());

	test('GIVEN a number random in range tag THEN return a random number from the given numbers', async () => {
		expect((await ts.run('{range:1, 12}')).body).toMatch(/^1|2|3|4|5|6|7|8|9|10|11|12$/);
		expect((await ts.run('{rangef:1.5-3}')).body).toMatch(/^(?:1|2|3)(?:.\d)?$/);
	});
});
