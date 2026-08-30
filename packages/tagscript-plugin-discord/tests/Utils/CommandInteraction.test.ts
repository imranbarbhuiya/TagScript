import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { resolveCommandOptions } from '../../src';
import { commandData } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('resolveCommandOptions', () => {
	test('GIVEN interaction options THEN resolve transformers', async () => {
		const transformers = resolveCommandOptions(commandData);

		expect((await ts.run('{subCommand}', transformers)).body).toBe('sub-command');
		expect((await ts.run('{subCommandGroup}', transformers)).body).toBe('sub-command-group');
		expect((await ts.run('{sub-command-member}', transformers)).body).toBe('<@758880890159235083>');
		expect((await ts.run('{sub-command-group-sub-command-channel}', transformers)).body).toBe('<#933395546138357800>');
		expect((await ts.run('{string}', transformers)).body).toBe('Hello');
		expect((await ts.run('{channel}', transformers)).body).toBe('<#933395546138357800>');
		expect((await ts.run('{role}', transformers)).body).toBe('<@&933378013154906142>');
		expect((await ts.run('{mentionable}', transformers)).body).toBe('<@&933378013154906142>');
		expect((await ts.run('{mentionable-2}', transformers)).body).toBe('<@758880890159235081>');
		expect((await ts.run('{boolean}', transformers)).body).toBe('true');
		expect((await ts.run('{number}', transformers)).body).toBe('1');
		expect((await ts.run('{integer}', transformers)).body).toBe('1');
		expect((await ts.run('{attachment}', transformers)).body).toBe(
			'https://cdn.discordapp.com/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp',
		);
		expect((await ts.run('{user}', transformers)).body).toBe('<@758880890159235081>');
	});

	test('GIVEN a user option with a resolved member THEN use the member transformer', async () => {
		const transformers = resolveCommandOptions(commandData);

		expect((await ts.run('{sub-command-member(displayName)}', transformers)).body).toBe('Parbez');
	});

	test('GIVEN an option Discord did not resolve THEN skip it', async () => {
		const transformers = resolveCommandOptions({
			...commandData,
			resolved: {},
		});

		expect(transformers.role).toBeUndefined();
		expect(transformers.channel).toBeUndefined();
		expect(transformers.user).toBeUndefined();
		expect(transformers.attachment).toBeUndefined();
		expect(transformers.mentionable).toBeUndefined();
	});
});
