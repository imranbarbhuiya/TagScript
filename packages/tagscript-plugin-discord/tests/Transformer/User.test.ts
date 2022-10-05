import { Interpreter, StrictVarsParser } from 'tagscript';

import { UserTransformer } from '../../src';
import { user } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('UserTransformer', () => {
	test('GIVEN a user tag THEN return value from user variable', async () => {
		expect((await ts.run('{user}', { user: new UserTransformer(user) })).body).toBe('<@758880890159235083>');
		expect((await ts.run('{user(username)}', { user: new UserTransformer(user) })).body).toBe('P<z, x>');
		expect((await ts.run('{user(a)}', { user: new UserTransformer(user) })).body).toBe('{user(a)}');
		expect((await ts.run('{user(b)}', { user: new UserTransformer(user, { b: (user) => user.defaultAvatarURL }) })).body).toBe(
			'https://cdn.discordapp.com/embed/avatars/2.png'
		);
	});
});
