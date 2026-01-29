import { ApplicationCommandOptionType } from 'discord.js';
import { Interpreter, StrictVarsParser } from 'tagscript';

import { resolveCommandOptions } from '../../src';
import { attachment, channel, member, role, user } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('resolveCommandOptions', () => {
	test('GIVEN interaction options THEN resolve transformers', async () => {
		const transformers = resolveCommandOptions({
			data: [
				{
					name: 'sub-command',
					type: ApplicationCommandOptionType.Subcommand,
					value: 'sub-command',
					options: [
						{
							name: 'member',
							type: ApplicationCommandOptionType.User,
							value: member.id,
							member
						}
					]
				},
				{
					name: 'sub-command-group',
					type: ApplicationCommandOptionType.SubcommandGroup,
					value: 'sub-command-group',
					options: [
						{
							name: 'sub-command',
							type: ApplicationCommandOptionType.Subcommand,
							value: 'sub-command',
							options: [
								{
									name: 'channel',
									type: ApplicationCommandOptionType.Channel,
									value: channel.id,
									channel
								}
							]
						}
					]
				},
				{
					name: 'string',
					type: ApplicationCommandOptionType.String,
					value: 'Hello'
				},
				{
					name: 'channel',
					type: ApplicationCommandOptionType.Channel,
					value: channel.id,
					channel
				},
				{
					name: 'role',
					type: ApplicationCommandOptionType.Role,
					value: role.id,
					role
				},
				{
					name: 'mentionable',
					type: ApplicationCommandOptionType.Mentionable,
					value: role.id,
					role
				},
				{
					name: 'mentionable-2',
					type: ApplicationCommandOptionType.Mentionable,
					value: user.id,
					user
				},
				{
					name: 'boolean',
					type: ApplicationCommandOptionType.Boolean,
					value: true
				},
				{
					name: 'number',
					type: ApplicationCommandOptionType.Number,
					value: 1.1
				},
				{
					name: 'integer',
					type: ApplicationCommandOptionType.Integer,
					value: 1
				},
				{
					name: 'attachment',
					type: ApplicationCommandOptionType.Attachment,
					value: attachment.id,
					attachment
				},
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					value: user.id,
					user
				}
			]
		});

		expect((await ts.run('{subCommand}', transformers)).body).toBe('sub-command');
		expect((await ts.run('{subCommandGroup}', transformers)).body).toBe('sub-command-group');
		expect((await ts.run('{sub-command-member}', transformers)).body).toBe('<@758880890159235083>');
		expect((await ts.run('{sub-command-group-sub-command-channel}', transformers)).body).toBe('<#933395546138357800>');
		expect((await ts.run('{string}', transformers)).body).toBe('Hello');
		expect((await ts.run('{channel}', transformers)).body).toBe('<#933395546138357800>');
		expect((await ts.run('{role}', transformers)).body).toBe('<@&933378013154906142>');
		expect((await ts.run('{mentionable}', transformers)).body).toBe('<@&933378013154906142>');
		expect((await ts.run('{mentionable-2}', transformers)).body).toBe('<@758880890159235083>');
		expect((await ts.run('{boolean}', transformers)).body).toBe('true');
		expect((await ts.run('{number}', transformers)).body).toBe('1');
		expect((await ts.run('{integer}', transformers)).body).toBe('1');
		expect((await ts.run('{attachment}', transformers)).body).toBe(
			'https://cdn.discordapp.com/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp'
		);
		expect((await ts.run('{user}', transformers)).body).toBe('<@758880890159235083>');
	});
});
