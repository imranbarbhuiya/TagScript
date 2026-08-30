import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { RoleTransformer } from '../../src';
import { everyoneRole, role } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer = new RoleTransformer(role)) =>
	(await ts.run(template, { seedVariables: { role: transformer } })).body ?? '';

describe('RoleTransformer', () => {
	test('GIVEN a bare tag THEN render a role mention', async () => {
		expect(await render('{role}')).toBe('<@&933378013154906142>');
	});

	describe('safe values', () => {
		test.each([
			['id', '933378013154906142'],
			['mention', '<@&933378013154906142>'],
			['name', '.'],
			['color', '0'],
			['hoist', 'false'],
			['mentionable', 'false'],
			['position', '16'],
		])('GIVEN {role(%s)} THEN render %s', async (key, expected) => {
			expect(await render(`{role(${key})}`)).toBe(expected);
		});

		test('GIVEN a hoisted, mentionable role THEN render both as true', async () => {
			const flagged = new RoleTransformer({ ...role, hoist: true, mentionable: true });

			expect(await render('{role(hoist)} {role(mentionable)}', flagged)).toBe('true true');
		});

		test('GIVEN a coloured role THEN render the colour as a decimal string', async () => {
			const coloured = new RoleTransformer({ ...role, color: 0x37_b2_cb });

			expect(await render('{role(color)}', coloured)).toBe('3650251');
		});
	});

	describe('permissions', () => {
		test('GIVEN the administrator bit THEN name it', async () => {
			// '8' is 1 << 3, which is Administrator.
			expect(await render('{role(permissions)}')).toBe('Administrator');
		});

		test('GIVEN several bits THEN name each of them', async () => {
			// 1 | 2 is CreateInstantInvite | KickMembers.
			const some = new RoleTransformer({ ...role, permissions: '3' });

			expect(await render('{role(permissions)}', some)).toBe('CreateInstantInvite, KickMembers');
		});

		test('GIVEN no permissions THEN render nothing', async () => {
			const none = new RoleTransformer({ ...role, permissions: '0' });

			expect(await render('{role(permissions)}', none)).toBe('');
		});
	});

	describe('creation time', () => {
		test('GIVEN a snowflake THEN derive the creation date from it', async () => {
			expect(await render('{role(createdAt)}')).toBe('2022-01-19T15:10:59.661Z');
		});

		test('GIVEN createdAt and createdTimestamp THEN they describe the same instant', async () => {
			const at = await render('{role(createdAt)}');
			const timestamp = await render('{role(createdTimestamp)}');

			expect(new Date(Number(timestamp)).toISOString()).toBe(at);
		});
	});

	describe('sandbox', () => {
		test('GIVEN an unknown property THEN leave the tag untouched', async () => {
			expect(await render('{role(secret)}')).toBe('{role(secret)}');
		});

		test.each(['constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
			'GIVEN the inherited property %s THEN leave the tag untouched',
			async (key) => {
				expect(await render(`{role(${key})}`)).toBe(`{role(${key})}`);
			},
		);
	});

	describe('toJSON', () => {
		test('GIVEN a transformer THEN expose exactly its safe values', () => {
			expect(Object.keys(new RoleTransformer(everyoneRole).toJSON()).sort((a, b) => a.localeCompare(b))).toStrictEqual([
				'color',
				'createdAt',
				'createdTimestamp',
				'hoist',
				'id',
				'mention',
				'mentionable',
				'name',
				'permissions',
				'position',
			]);
		});
	});
});
