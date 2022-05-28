import { Interpreter, StrictVarsParser } from 'tagscript';
import { InteractionTransformer } from '../../src';
import { interaction } from './Structures';

const ts = new Interpreter(new StrictVarsParser());
describe('InteractionTransformer', () => {
	test('GIVEN a a guild tag THEN return value from guild variable', async () => {
		expect((await ts.run('{interaction.locale}', { interaction: new InteractionTransformer(interaction) })).body).toBe('en-US');
	});
});
