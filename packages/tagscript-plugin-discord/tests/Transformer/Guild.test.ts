import { Interpreter, StrictVarsParser } from 'tagscript';

import { GuildTransformer } from '../../src';
import { guild } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());
describe('GuildTransformer', () => {
	test('GIVEN a guild tag THEN return value from guild variable', async () => {
		expect((await ts.run('{guild}', { guild: new GuildTransformer(guild) })).body).toBe('My Guild');
	});

	it('should match the snapshot', async () => {
		const transformer = new GuildTransformer(guild);

		expect(transformer.toJSON()).toMatchSnapshot();
	});
});
