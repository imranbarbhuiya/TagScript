import { Interpreter, StrictVarsParser } from 'tagscript';
import { ChannelTransformer } from '../../src';
import { channel, channel2 } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('ChannelTransformer', () => {
	test('GIVEN a channel tag THEN return value from channel variable', async () => {
		expect((await ts.run('{channel}', { channel: new ChannelTransformer(channel), channel2: new ChannelTransformer(channel2) })).body).toBe(
			'<#933395546138357800>'
		);
	});
});
