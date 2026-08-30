import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { ChannelTransformer } from '../../src';
import { channel, channel2 } from '../Structures/Structures';

import type { GuildChannel } from '../../src';

// The fixtures carry text-channel fields that `APIGuildChannel<GuildChannelType>` does not declare,
// so overrides go through this rather than repeating a cast at every call site.
const variantOf = (overrides: Record<string, unknown>) => new ChannelTransformer({ ...channel, ...overrides });

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer = new ChannelTransformer(channel)) =>
	(await ts.run(template, { seedVariables: { channel: transformer } })).body ?? '';

describe('ChannelTransformer', () => {
	test('GIVEN a bare tag THEN render a channel mention', async () => {
		expect(await render('{channel}')).toBe('<#933395546138357800>');
	});

	describe('safe values', () => {
		test.each([
			['id', '933395546138357800'],
			['mention', '<#933395546138357800>'],
			['name', 'test'],
			['topic', 'A test channel'],
			['type', '0'],
			['position', '1'],
			['nsfw', 'false'],
			['slowmode', '0'],
		])('GIVEN {channel(%s)} THEN render %s', async (key, expected) => {
			expect(await render(`{channel(${key})}`)).toBe(expected);
		});
	});

	describe('optional fields', () => {
		test('GIVEN no topic THEN render it as empty', async () => {
			expect(await render('{channel(topic)}', new ChannelTransformer(channel2))).toBe('');
		});

		test('GIVEN no parent THEN render parentId as empty', async () => {
			expect(await render('{channel(parentId)}')).toBe('');
		});

		test('GIVEN a parent THEN render its id', async () => {
			const nested = variantOf({ parent_id: '933368398996447292' });

			expect(await render('{channel(parentId)}', nested)).toBe('933368398996447292');
		});

		test('GIVEN slowmode THEN render the number of seconds', async () => {
			const slow = variantOf({ rate_limit_per_user: 30 });

			expect(await render('{channel(slowmode)}', slow)).toBe('30');
		});

		test('GIVEN an nsfw channel THEN render nsfw as true', async () => {
			const nsfw = variantOf({ nsfw: true });

			expect(await render('{channel(nsfw)}', nsfw)).toBe('true');
		});

		test('GIVEN a channel with no position THEN default it to zero', async () => {
			const { position: _, ...rest } = channel as GuildChannel & { position?: number };
			const without = new ChannelTransformer(rest);

			expect(await render('{channel(position)}', without)).toBe('0');
		});
	});

	describe('creation time', () => {
		test('GIVEN a snowflake THEN derive the creation date from it', async () => {
			expect(await render('{channel(createdAt)}')).toBe('2022-01-19T16:20:39.850Z');
		});

		test('GIVEN a different channel THEN derive a different creation date', async () => {
			expect(await render('{channel(createdAt)}', new ChannelTransformer(channel2))).toBe('2021-07-29T17:18:22.544Z');
		});

		test('GIVEN createdAt and createdTimestamp THEN they describe the same instant', async () => {
			const at = await render('{channel(createdAt)}');
			const timestamp = await render('{channel(createdTimestamp)}');

			expect(new Date(Number(timestamp)).toISOString()).toBe(at);
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{channel(secret)}')).toBe('{channel(secret)}');
		});

		test.each(['constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{channel(${key})}`)).toBe(`{channel(${key})}`);
			},
		);

		test('GIVEN a transformer THEN never expose the guild id', () => {
			expect(new ChannelTransformer(channel).toJSON()).not.toHaveProperty('guild_id');
		});
	});
});
