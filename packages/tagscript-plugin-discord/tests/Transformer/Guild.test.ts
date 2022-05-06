import { Interpreter, StrictVarsParser } from 'tagscript';
import { GuildTransformer } from '../../src';
import { guild } from './Structures';

const ts = new Interpreter(new StrictVarsParser());
describe('GuildTransformer', () => {
	test('GIVEN a a guild tag THEN return value from guild variable', async () => {
		expect((await ts.run('{guild}', { guild: new GuildTransformer(guild) })).body).toBe('Team R.O.T.I');
	});
});
