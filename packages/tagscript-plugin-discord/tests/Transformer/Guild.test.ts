import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { GuildTransformer } from '../../src';
import { guild } from '../Structures/Structures';

import type { APIGuild } from 'discord-api-types/v10';

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer = new GuildTransformer(guild)) =>
	(await ts.run(template, { seedVariables: { guild: transformer } })).body ?? '';

describe('GuildTransformer', () => {
	test('GIVEN a bare tag THEN render the guild name rather than a mention', async () => {
		expect(await render('{guild}')).toBe('My Guild');
	});

	describe('safe values', () => {
		test.each([
			['id', '933368398996447292'],
			['name', 'My Guild'],
			['mention', 'My Guild'],
			['ownerId', '938716130720235601'],
			['memberCount', '1204'],
			['afkTimeout', '300'],
			['verificationLevel', '0'],
			['emojiCount', '0'],
			['stickerCount', '0'],
		])('GIVEN {guild(%s)} THEN render %s', async (key, expected) => {
			expect(await render(`{guild(${key})}`)).toBe(expected);
		});
	});

	describe('roles', () => {
		test('GIVEN guild roles THEN render them as mentions separated by spaces', async () => {
			expect(await render('{guild(roles)}')).toBe('<@&933378013154906142> <@&933368398996447292>');
		});

		test('GIVEN guild roles THEN render their ids comma separated', async () => {
			expect(await render('{guild(roleIds)}')).toBe('933378013154906142, 933368398996447292');
		});

		test('GIVEN guild roles THEN render their names comma separated', async () => {
			expect(await render('{guild(roleNames)}')).toBe('., @everyone');
		});

		test('GIVEN guild roles THEN count them', async () => {
			expect(await render('{guild(roleCount)}')).toBe('2');
		});
	});

	describe('images', () => {
		test('GIVEN an icon hash THEN build a webp url', async () => {
			expect(await render('{guild(icon)}')).toBe(
				'https://cdn.discordapp.com/icons/933368398996447292/396ee43e3064f8ec805fede6f3bcdc6d.webp',
			);
		});

		test('GIVEN an animated icon hash THEN build a gif url', async () => {
			const animated = new GuildTransformer({ ...guild, icon: 'a_396ee43e3064f8ec805fede6f3bcdc6d' });

			expect(await render('{guild(icon)}', animated)).toBe(
				'https://cdn.discordapp.com/icons/933368398996447292/a_396ee43e3064f8ec805fede6f3bcdc6d.gif',
			);
		});

		test.each(['splash', 'banner'])('GIVEN no %s THEN render it as empty', async (key) => {
			expect(await render(`{guild(${key})}`)).toBe('');
		});

		test('GIVEN a splash hash THEN build a webp url, since splashes are never animated', async () => {
			const withSplash = new GuildTransformer({ ...guild, splash: 'a_396ee43e3064f8ec805fede6f3bcdc6d' });

			expect(await render('{guild(splash)}', withSplash)).toBe(
				'https://cdn.discordapp.com/splashes/933368398996447292/a_396ee43e3064f8ec805fede6f3bcdc6d.webp',
			);
		});

		test('GIVEN a banner hash THEN build a url', async () => {
			const withBanner = new GuildTransformer({ ...guild, banner: '396ee43e3064f8ec805fede6f3bcdc6d' });

			expect(await render('{guild(banner)}', withBanner)).toBe(
				'https://cdn.discordapp.com/banners/933368398996447292/396ee43e3064f8ec805fede6f3bcdc6d.webp',
			);
		});
	});

	describe('features', () => {
		test('GIVEN no features THEN render a placeholder rather than an empty string', async () => {
			expect(await render('{guild(features)}')).toBe('`None`');
		});

		test('GIVEN features THEN render them space separated', async () => {
			const withFeatures = new GuildTransformer({
				...guild,
				features: ['COMMUNITY', 'BANNER'],
			} as unknown as APIGuild);

			expect(await render('{guild(features)}', withFeatures)).toBe('COMMUNITY BANNER');
		});
	});

	describe('afk channel', () => {
		test('GIVEN no afk channel THEN render it as empty', async () => {
			expect(await render('{guild(afkChannel)}')).toBe('');
		});

		test('GIVEN an afk channel THEN render it as a channel mention', async () => {
			const withAfk = new GuildTransformer({ ...guild, afk_channel_id: '933395546138357800' });

			expect(await render('{guild(afkChannel)}', withAfk)).toBe('<#933395546138357800>');
		});
	});

	describe('optional fields', () => {
		test('GIVEN no approximate member count THEN render it as empty', async () => {
			const { approximate_member_count: _, ...rest } = guild;
			const without = new GuildTransformer(rest);

			expect(await render('{guild(memberCount)}', without)).toBe('');
		});

		test('GIVEN no stickers THEN count them as zero', async () => {
			const { stickers: _, ...rest } = guild;
			const without = new GuildTransformer(rest);

			expect(await render('{guild(stickerCount)}', without)).toBe('0');
		});

		test('GIVEN a null description THEN leave the tag untouched', async () => {
			// A null safe value renders as empty via the nullish coalesce in BaseTransformer.
			expect(await render('{guild(description)}')).toBe('');
		});

		test('GIVEN a description THEN render it', async () => {
			const described = new GuildTransformer({ ...guild, description: 'A nice place' });

			expect(await render('{guild(description)}', described)).toBe('A nice place');
		});
	});

	describe('creation time', () => {
		test('GIVEN a snowflake THEN derive the creation date from it', async () => {
			expect(await render('{guild(createdAt)}')).toBe('2022-01-19T14:32:47.467Z');
		});

		test('GIVEN createdAt and createdTimestamp THEN they describe the same instant', async () => {
			const at = await render('{guild(createdAt)}');
			const timestamp = await render('{guild(createdTimestamp)}');

			expect(new Date(Number(timestamp)).toISOString()).toBe(at);
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{guild(secret)}')).toBe('{guild(secret)}');
		});

		test.each(['constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{guild(${key})}`)).toBe(`{guild(${key})}`);
			},
		);

		test('GIVEN a rendered guild THEN never expose raw payload fields', async () => {
			const json = new GuildTransformer(guild).toJSON();

			expect(json).not.toHaveProperty('vanity_url_code');
			expect(json).not.toHaveProperty('mfa_level');
			expect(json).not.toHaveProperty('system_channel_flags');
		});
	});
});
