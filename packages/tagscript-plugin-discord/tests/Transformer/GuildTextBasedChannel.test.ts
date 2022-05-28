import { Interpreter, StrictVarsParser } from 'tagscript';
import { ChannelTransformer } from '../../src';
import { channel } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('ChannelTransformer', () => {
	test('GIVEN a channel tag THEN return value from channel variable', async () => {
		expect((await ts.run('{channel}', { channel: new ChannelTransformer(channel) })).body).toBe('<#933395546138357800>');
	});
});
