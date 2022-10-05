import { Interpreter } from 'tagscript';

import { CooldownParser } from '../../src';

describe('CooldownParser', () => {
	const ts = new Interpreter(new CooldownParser());

	test('GIVEN a cooldown tag THEN return empty string and cooldown info', async () => {
		expect((await ts.run('{cd(5):You are in cd}')).actions).toStrictEqual({
			cooldown: {
				cooldown: 5,
				message: 'You are in cd'
			}
		});
	});
});
