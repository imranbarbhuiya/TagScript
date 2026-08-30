import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { MemberTransformer } from '../../src';
import { member, user } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

const base = { ...member, user };

const render = async (template: string, transformer = new MemberTransformer(base)) =>
	(await ts.run(template, { seedVariables: { member: transformer } })).body ?? '';

describe('MemberTransformer', () => {
	test('GIVEN a bare tag THEN render a user mention', async () => {
		expect(await render('{member}')).toBe('<@758880890159235083>');
	});

	describe('safe values', () => {
		test.each([
			['id', '758880890159235083'],
			['mention', '<@758880890159235083>'],
			['username', 'parbez'],
			['discriminator', '0'],
			['tag', 'parbez'],
			['bot', 'false'],
		])('GIVEN {member(%s)} THEN render %s', async (key, expected) => {
			expect(await render(`{member(${key})}`)).toBe(expected);
		});

		test('GIVEN the id THEN take it from the nested user, not the member', async () => {
			expect(await render('{member(id)}')).toBe(user.id);
		});
	});

	describe('displayName', () => {
		test('GIVEN no nickname THEN fall back to the global name', async () => {
			expect(await render('{member(displayName)}')).toBe('Parbez');
		});

		test('GIVEN a nickname THEN prefer it', async () => {
			const nicknamed = new MemberTransformer({ ...base, nick: 'Vox' });

			expect(await render('{member(displayName)}', nicknamed)).toBe('Vox');
		});

		test('GIVEN neither nickname nor global name THEN fall back to the username', async () => {
			const bare = new MemberTransformer({ ...base, user: { ...user, global_name: null } });

			expect(await render('{member(displayName)}', bare)).toBe('parbez');
		});
	});

	describe('nickname', () => {
		test('GIVEN no nickname THEN render it as empty', async () => {
			expect(await render('{member(nickname)}')).toBe('');
		});

		test('GIVEN a nickname THEN render it', async () => {
			const nicknamed = new MemberTransformer({ ...base, nick: 'Vox' });

			expect(await render('{member(nickname)}', nicknamed)).toBe('Vox');
		});
	});

	describe('roles', () => {
		test('GIVEN member roles THEN render them as mentions separated by spaces', async () => {
			expect(await render('{member(roles)}')).toBe('<@&933378013154906142> <@&933368398996447292>');
		});

		test('GIVEN member roles THEN render their ids comma separated', async () => {
			expect(await render('{member(roleIds)}')).toBe('933378013154906142, 933368398996447292');
		});

		test('GIVEN no roles THEN render both as empty', async () => {
			const roleless = new MemberTransformer({ ...base, roles: [] });

			expect(await render('{member(roles)}{member(roleIds)}', roleless)).toBe('');
		});
	});

	describe('joined at', () => {
		test('GIVEN a join date THEN render it as given', async () => {
			expect(await render('{member(joinedAt)}')).toBe('2022-01-19T16:52:53.953Z');
		});

		test('GIVEN a join date THEN derive its timestamp', async () => {
			expect(await render('{member(joinedTimestamp)}')).toBe('1642611173953');
		});

		test('GIVEN joinedAt and joinedTimestamp THEN they describe the same instant', async () => {
			const at = await render('{member(joinedAt)}');
			const timestamp = await render('{member(joinedTimestamp)}');

			expect(new Date(Number(timestamp)).toISOString()).toBe(at);
		});
	});

	describe('timeout', () => {
		test('GIVEN no timeout THEN render it as empty and its timestamp as empty', async () => {
			expect(await render('{member(timeoutUntil)}')).toBe('');
			expect(await render('{member(timeoutUntilTimestamp)}')).toBe('');
		});

		test('GIVEN a timeout THEN render it and derive its timestamp', async () => {
			const timedOut = new MemberTransformer({
				...base,
				communication_disabled_until: '2026-01-01T00:00:00.000Z',
			});

			expect(await render('{member(timeoutUntil)}', timedOut)).toBe('2026-01-01T00:00:00.000Z');
			expect(await render('{member(timeoutUntilTimestamp)}', timedOut)).toBe('1767225600000');
		});
	});

	describe('avatars', () => {
		test('GIVEN a user avatar THEN build a webp url', async () => {
			expect(await render('{member(avatar)}')).toBe(
				'https://cdn.discordapp.com/avatars/758880890159235083/17ac5f89d5f8b08b5bbd6cc43c930399.webp',
			);
		});

		test('GIVEN no avatar THEN fall back to the default for displayAvatar', async () => {
			const plain = new MemberTransformer({ ...base, user: { ...user, avatar: null } });

			expect(await render('{member(avatar)}', plain)).toBe('');
			expect(await render('{member(displayAvatar)}', plain)).toBe('https://cdn.discordapp.com/embed/avatars/3.png');
		});
	});

	describe('creation time', () => {
		test('GIVEN the user snowflake THEN derive the creation date from it', async () => {
			expect(await render('{member(createdAt)}')).toBe('2020-09-25T02:41:43.539Z');
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{member(secret)}')).toBe('{member(secret)}');
		});

		test.each(['constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{member(${key})}`)).toBe(`{member(${key})}`);
			},
		);

		test('GIVEN a transformer THEN never expose the raw member payload', () => {
			const json = new MemberTransformer(base).toJSON();

			expect(json).not.toHaveProperty('deaf');
			expect(json).not.toHaveProperty('mute');
			expect(json).not.toHaveProperty('user');
		});
	});
});
