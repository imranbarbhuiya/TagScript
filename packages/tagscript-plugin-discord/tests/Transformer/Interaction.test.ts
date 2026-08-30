import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { InteractionTransformer } from '../../src';
import { interaction } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer = new InteractionTransformer(interaction)) =>
	(await ts.run(template, { seedVariables: { interaction: transformer } })).body ?? '';

describe('InteractionTransformer', () => {
	test('GIVEN a bare tag THEN render a slash command mention', async () => {
		expect(await render('{interaction}')).toBe('</ping:938716130720235601>');
	});

	describe('safe values', () => {
		test.each([
			['id', '933368398996447292'],
			['name', 'ping'],
			['applicationId', '938716130720235601'],
			['channelId', '933395546138357800'],
			['guildId', '933368398996447292'],
			['commandId', '938716130720235601'],
			['commandName', 'ping'],
			['locale', 'en-US'],
			['guildLocale', 'en-US'],
		])('GIVEN {interaction.%s} THEN render %s', async (key, expected) => {
			expect(await render(`{interaction.${key}}`)).toBe(expected);
		});

		test('GIVEN both syntaxes THEN they resolve the same value', async () => {
			expect(await render('{interaction.commandName}')).toBe(await render('{interaction(commandName)}'));
		});

		test('GIVEN name and commandName THEN both come from the command data', async () => {
			expect(await render('{interaction.name}')).toBe(await render('{interaction.commandName}'));
		});
	});

	describe('optional fields', () => {
		test('GIVEN an interaction outside a guild THEN render guildId as empty', async () => {
			const { guild_id: _, ...rest } = interaction;
			const direct = new InteractionTransformer(rest);

			expect(await render('{interaction.guildId}', direct)).toBe('');
		});

		test('GIVEN no guild locale THEN render it as empty', async () => {
			const { guild_locale: _, ...rest } = interaction;
			const direct = new InteractionTransformer(rest);

			expect(await render('{interaction.guildLocale}', direct)).toBe('');
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{interaction.secret}')).toBe('{interaction.secret}');
		});

		test.each(['constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{interaction(${key})}`)).toBe(`{interaction(${key})}`);
			},
		);

		test('GIVEN a transformer THEN never expose the interaction token', async () => {
			const json = new InteractionTransformer(interaction).toJSON();

			expect(json).not.toHaveProperty('token');
			expect(await render('{interaction.token}')).toBe('{interaction.token}');
		});

		test('GIVEN a transformer THEN never expose permissions or entitlements', () => {
			const json = new InteractionTransformer(interaction).toJSON();

			expect(json).not.toHaveProperty('app_permissions');
			expect(json).not.toHaveProperty('entitlements');
			expect(json).not.toHaveProperty('member');
		});
	});
});
