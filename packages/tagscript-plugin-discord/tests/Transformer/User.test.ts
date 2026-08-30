import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { UserTransformer } from '../../src';
import { user, user2 } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer = new UserTransformer(user)) =>
	(await ts.run(template, { seedVariables: { user: transformer } })).body ?? '';

describe('UserTransformer', () => {
	test('GIVEN a bare tag THEN render a user mention', async () => {
		expect(await render('{user}')).toBe('<@758880890159235083>');
	});

	describe('safe values', () => {
		test.each([
			['id', '758880890159235083'],
			['mention', '<@758880890159235083>'],
			['username', 'parbez'],
			['globalName', 'Parbez'],
			['discriminator', '0'],
			['bot', 'false'],
		])('GIVEN {user(%s)} THEN render %s', async (key, expected) => {
			expect(await render(`{user(${key})}`)).toBe(expected);
		});

		test('GIVEN a user with no name field THEN render name as empty', async () => {
			// APIUser has no `name`, so BaseTransformer's shared default applies.
			expect(await render('{user(name)}')).toBe('');
		});
	});

	describe('tag', () => {
		test('GIVEN the new username system THEN drop the discriminator', async () => {
			expect(await render('{user(tag)}')).toBe('parbez');
		});

		test('GIVEN a legacy discriminator THEN join it with a hash', async () => {
			const legacy = new UserTransformer({ ...user, discriminator: '2063' });

			expect(await render('{user(tag)}', legacy)).toBe('parbez#2063');
		});
	});

	describe('avatars', () => {
		test('GIVEN a static avatar hash THEN build a webp url', async () => {
			expect(await render('{user(avatar)}')).toBe(
				'https://cdn.discordapp.com/avatars/758880890159235083/17ac5f89d5f8b08b5bbd6cc43c930399.webp',
			);
		});

		test('GIVEN an animated avatar hash THEN build a gif url', async () => {
			const animated = new UserTransformer({ ...user, avatar: 'a_17ac5f89d5f8b08b5bbd6cc43c930399' });

			expect(await render('{user(avatar)}', animated)).toBe(
				'https://cdn.discordapp.com/avatars/758880890159235083/a_17ac5f89d5f8b08b5bbd6cc43c930399.gif',
			);
		});

		test('GIVEN no avatar THEN render avatar as empty', async () => {
			expect(await render('{user(avatar)}', new UserTransformer(user2))).toBe('');
		});

		test('GIVEN no avatar THEN fall back to the default avatar for displayAvatar', async () => {
			// The default index is (id >> 22) % 6, which is 3 for this snowflake.
			expect(await render('{user(displayAvatar)}', new UserTransformer(user2))).toBe(
				'https://cdn.discordapp.com/embed/avatars/3.png',
			);
		});

		test('GIVEN an avatar THEN displayAvatar matches avatar', async () => {
			expect(await render('{user(displayAvatar)}')).toBe(await render('{user(avatar)}'));
		});
	});

	describe('creation time', () => {
		test('GIVEN a snowflake THEN derive the creation date from it', async () => {
			expect(await render('{user(createdAt)}')).toBe('2020-09-25T02:41:43.539Z');
		});

		test('GIVEN a snowflake THEN derive the creation timestamp from it', async () => {
			expect(await render('{user(createdTimestamp)}')).toBe('1601001703539');
		});

		test('GIVEN createdAt and createdTimestamp THEN they describe the same instant', async () => {
			const at = await render('{user(createdAt)}');
			const timestamp = await render('{user(createdTimestamp)}');

			expect(new Date(Number(timestamp)).toISOString()).toBe(at);
		});
	});

	describe('extra safe values', () => {
		test('GIVEN a function value THEN call it with the payload', async () => {
			const withExtra = new UserTransformer(user, { b: (base) => base.global_name });

			expect(await render('{user(b)}', withExtra)).toBe('Parbez');
		});

		test('GIVEN an extra value THEN it can override a built-in one', async () => {
			const withExtra = new UserTransformer(user, { username: 'redacted' });

			expect(await render('{user(username)}', withExtra)).toBe('redacted');
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{user(a)}')).toBe('{user(a)}');
		});

		test.each(['constructor', 'valueOf', 'toString', 'hasOwnProperty', 'isPrototypeOf', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{user(${key})}`)).toBe(`{user(${key})}`);
			},
		);

		test.each(['base', 'safeValues', 'transform', 'toJSON'])(
			'GIVEN the internal member %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{user(${key})}`)).toBe(`{user(${key})}`);
			},
		);

		test('GIVEN a rendered user THEN never expose the raw payload', async () => {
			const body = await render('{user} {user(id)} {user(username)}');

			expect(body).not.toContain('mfa_enabled');
			expect(body).not.toContain('[object Object]');
		});
	});

	describe('toJSON', () => {
		test('GIVEN a transformer THEN expose exactly its safe values', () => {
			expect(Object.keys(new UserTransformer(user).toJSON()).sort((a, b) => a.localeCompare(b))).toStrictEqual([
				'avatar',
				'bot',
				'createdAt',
				'createdTimestamp',
				'discriminator',
				'displayAvatar',
				'globalName',
				'id',
				'mention',
				'name',
				'tag',
				'username',
			]);
		});

		test('GIVEN a transformer THEN never expose the raw payload', () => {
			expect(new UserTransformer(user).toJSON()).not.toHaveProperty('mfa_enabled');
		});
	});
});
