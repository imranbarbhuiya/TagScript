import { ChatInputCommandInteraction, Client, Guild, GuildMember, Role, TextChannel, User } from 'discord.js';
import {
	APIUser,
	APIRole,
	APIGuild,
	APIGuildMember,
	APIChannel,
	APIApplicationCommandInteraction,
	InteractionType,
	ApplicationCommandType,
	ApplicationCommandOptionType,
	APIAttachment
} from 'discord-api-types/v9';

export const client = new Client({ intents: [] });

const userObject: APIUser = {
	id: '758880890159235083',
	username: 'P<z, x>',
	discriminator: '1572',
	avatar: '17ac5f89d5f8b08b5bbd6cc43c930399',
	bot: false,
	system: false,
	mfa_enabled: false
};

const roleObject: APIRole = {
	unicode_emoji: null,
	id: '933378013154906142',
	name: '.',
	color: 0,
	hoist: false,
	position: 16,
	permissions: '8',
	managed: false,
	mentionable: false
};

const everyoneRoleObject: APIRole = {
	icon: null,
	unicode_emoji: null,
	id: '933368398996447292',
	name: '@everyone',
	color: 0,
	hoist: false,
	position: 0,
	permissions: '0',
	managed: false,
	mentionable: false
};

const guildObject = {
	id: '933368398996447292',
	name: 'Team R.O.T.I',
	icon: '396ee43e3064f8ec805fede6f3bcdc6d',
	splash: null,
	discovery_splash: null,
	owner_id: '938716130720235601',
	afk_channel_id: null,
	afk_timeout: 300,
	verification_level: 0,
	default_message_notifications: 0,
	explicit_content_filter: 0,
	roles: [roleObject, everyoneRoleObject],
	emojis: [],
	features: [],
	mfa_level: 0,
	system_channel_flags: 0,
	vanity_url_code: null,
	description: null,
	banner: null,
	premium_tier: 0,
	preferred_locale: 'en-US',
	nsfw_level: 0,
	premium_progress_bar_enabled: false
} as unknown as APIGuild;

const memberObject: APIGuildMember = {
	roles: ['933378013154906142', '933368398996447292'],
	joined_at: '2022-01-19T16:52:53.953Z',
	deaf: false,
	mute: false,
	user: userObject
};

const channelObject: APIChannel = {
	id: '933395546138357800',
	name: 'test',
	type: 0
};

const attachment: APIAttachment = {
	id: '933368398996447291',
	filename: 'test.png',
	proxy_url: 'https://media.discordapp.net/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp',
	size: 4096,
	url: 'https://cdn.discordapp.com/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp'
};

// TODO(@imranbarbhuiya): Make this a valid interaction object.
const interactionObject: APIApplicationCommandInteraction = {
	id: '933368398996447292',
	application_id: '938716130720235601',
	type: InteractionType.ApplicationCommand,
	data: {
		id: '938716130720235601',
		name: 'ping',
		type: ApplicationCommandType.ChatInput,
		resolved: {
			users: { '758880890159235081': userObject, '758880890159235083': userObject },
			members: { '758880890159235083': { ...memberObject, permissions: '8' } },
			channels: { '933368398996447292': { ...channelObject, permissions: '8', name: 'test' } },
			roles: { '933378013154906142': roleObject },
			attachments: {
				'933368398996447291': attachment
			}
		},
		options: [
			{
				name: 'sub-command',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'member',
						type: ApplicationCommandOptionType.User,
						value: '758880890159235083'
					}
				]
			},
			{
				name: 'sub-command-group',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'sub-command',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'channel',
								type: ApplicationCommandOptionType.User,
								value: '933368398996447292'
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
				value: '933368398996447292'
			},
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				value: '933378013154906142'
			},
			{
				name: 'mentionable',
				type: ApplicationCommandOptionType.Mentionable,
				value: '933378013154906142'
			},
			{
				name: 'mentionable-2',
				type: ApplicationCommandOptionType.Mentionable,
				value: '758880890159235083'
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
				value: '933368398996447291'
			},
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				value: '758880890159235081'
			},
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				value: '933378013154906142'
			}
		]
	},
	guild_id: '933368398996447292',
	channel_id: '933368398996447292',
	member: { ...memberObject, permissions: '8', user: userObject },
	user: userObject,
	token: '',
	version: 1,
	locale: 'en-US',
	guild_locale: 'en-US'
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// @ts-expect-error using protected constructor to test
export const user: User = new User(client, userObject);
// @ts-expect-error using protected constructor to test
export const guild: Guild = new Guild(client, guildObject);

// @ts-expect-error using protected constructor to test
export const role: Role = new Role(client, roleObject, guild);

// @ts-expect-error using protected constructor to test
export const member: GuildMember = new GuildMember(client, memberObject, guild);

// @ts-expect-error using protected constructor to test
export const channel: TextChannel = new TextChannel(guild, channelObject, client);

// @ts-expect-error using protected constructor to test
export const interaction: ChatInputCommandInteraction = new ChatInputCommandInteraction(client, interactionObject);

/* eslint-enable @typescript-eslint/no-unsafe-assignment */
