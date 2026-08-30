import { describe, expect, it, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { UserTransformer } from '../../src';
import { user, user2 } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('UserTransformer', () => {
	test('GIVEN a user tag THEN return value from user variable', async () => {
		expect((await ts.run('{user}', { user: new UserTransformer(user) })).body).toBe('<@758880890159235083>');
		expect((await ts.run('{user(username)}', { user: new UserTransformer(user) })).body).toBe('parbez');
		expect((await ts.run('{user(a)}', { user: new UserTransformer(user) })).body).toBe('{user(a)}');
		expect(
			(await ts.run('{user(b)}', { user: new UserTransformer(user, { b: (base) => base.global_name }) })).body,
		).toBe('Parbez');
	});

	test('GIVEN a user without an avatar THEN fall back to the default avatar', async () => {
		const transformer = new UserTransformer(user2);

		expect((await ts.run('{user(avatar)}', { user: transformer })).body).toBe('');
		expect((await ts.run('{user(displayAvatar)}', { user: transformer })).body).toBe(
			'https://cdn.discordapp.com/embed/avatars/3.png',
		);
	});

	it('should match the snapshot', async () => {
		const transformer = new UserTransformer(user);

		expect(transformer.toJSON()).toMatchSnapshot();
	});
});
