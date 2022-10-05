import { Interpreter, StrictVarsParser } from 'tagscript';

import { InteractionTransformer } from '../../src';
import { interaction } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

// TODO(@imranbarbhuiya): Add tests for all the properties.
describe('InteractionTransformer', () => {
	test('GIVEN  tag THEN return value from guild variable', async () => {
		expect((await ts.run('{interaction.locale}', { interaction: new InteractionTransformer(interaction) })).body).toBe('en-US');
	});
});
