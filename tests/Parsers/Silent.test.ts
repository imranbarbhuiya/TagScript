import { SilentParser, Interpreter } from '../../src';

describe('SilentParser', () => {
	const ts = new Interpreter(new SilentParser());

	test('GIVEN a Silent tag THEN return empty string and Silent: true in actions', async () => {
		expect((await ts.run('{silent}')).actions).toStrictEqual({
			silent: true
		});
	});
});
