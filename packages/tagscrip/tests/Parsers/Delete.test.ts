import { DeleteParser, Interpreter } from '../../src';

describe('DeleteParser', () => {
	const ts = new Interpreter(new DeleteParser());

	test('GIVEN a Delete tag THEN return empty string and Delete: true in actions', async () => {
		expect((await ts.run('{delete}')).actions).toStrictEqual({
			deleteMessage: true
		});
	});
});
