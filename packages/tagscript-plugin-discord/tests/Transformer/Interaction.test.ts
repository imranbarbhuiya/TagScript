import { Interpreter, StrictVarsParser } from 'tagscript';

import { InteractionTransformer } from '../../src';
import { interaction } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());
describe('InteractionTransformer', () => {
	test('GIVEN interaction tag THEN return values from interaction variable', async () => {
		const transformer = new InteractionTransformer(interaction);
		expect((await ts.run('{interaction.applicationId}', { interaction: transformer })).body).toBe('938716130720235601');
		expect((await ts.run('{interaction.channelId}', { interaction: transformer })).body).toBe('933395546138357800');
		expect((await ts.run('{interaction.guildId}', { interaction: transformer })).body).toBe('933368398996447292');
		expect((await ts.run('{interaction.commandId}', { interaction: transformer })).body).toBe('938716130720235601');
		expect((await ts.run('{interaction.commandName}', { interaction: transformer })).body).toBe('ping');
		expect((await ts.run('{interaction.locale}', { interaction: transformer })).body).toBe('en-US');
		expect((await ts.run('{interaction.guildLocale}', { interaction: transformer })).body).toBe('en-US');
	});

	it('should match the snapshot', async () => {
		const userTransformer = new InteractionTransformer(interaction);

		expect(userTransformer.toJSON()).toMatchSnapshot();
	});
});
