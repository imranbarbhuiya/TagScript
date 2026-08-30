import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	GuildMemberFlags,
	InteractionType,
	Locale,
	RoleFlags,
	type APIApplicationCommandInteraction,
	type APIAttachment,
	type APIChatInputApplicationCommandInteractionData,
	type APIGuild,
	type APIGuildChannel,
	type APIGuildMember,
	type APIRole,
	type APIUser,
	type GuildChannelType,
} from 'discord-api-types/v10';

export const user: APIUser = {
	id: '758880890159235083',
	username: 'parbez',
	global_name: 'Parbez',
	discriminator: '0',
	avatar: '17ac5f89d5f8b08b5bbd6cc43c930399',
	bot: false,
	system: false,
	mfa_enabled: false,
};

export const user2: APIUser = {
	id: '758880890159235081',
	username: 'parbez2',
	global_name: 'Parbez Two',
	discriminator: '0',
	avatar: null,
	bot: false,
	system: false,
	mfa_enabled: false,
};

export const role: APIRole = {
	unicode_emoji: null,
	id: '933378013154906142',
	name: '.',
	color: 0,
	hoist: false,
	position: 16,
	permissions: '8',
	managed: false,
	mentionable: false,
	flags: RoleFlags.InPrompt,
	colors: {
		primary_color: 0,
		secondary_color: 0,
		tertiary_color: 0,
	},
};

export const everyoneRole: APIRole = {
	icon: null,
	unicode_emoji: null,
	id: '933368398996447292',
	name: '@everyone',
	color: 0,
	hoist: false,
	position: 0,
	permissions: '0',
	managed: false,
	mentionable: false,
	flags: RoleFlags.InPrompt,
	colors: {
		primary_color: 0,
		secondary_color: 0,
		tertiary_color: 0,
	},
};

export const guild = {
	id: '933368398996447292',
	name: 'My Guild',
	icon: '396ee43e3064f8ec805fede6f3bcdc6d',
	splash: null,
	discovery_splash: null,
	owner_id: '938716130720235601',
	afk_channel_id: null,
	afk_timeout: 300,
	verification_level: 0,
	default_message_notifications: 0,
	explicit_content_filter: 0,
	roles: [role, everyoneRole],
	emojis: [],
	stickers: [],
	features: [],
	mfa_level: 0,
	system_channel_flags: 0,
	vanity_url_code: null,
	description: null,
	banner: null,
	premium_tier: 0,
	preferred_locale: 'en-US',
	nsfw_level: 0,
	premium_progress_bar_enabled: false,
	approximate_member_count: 1_204,
} as unknown as APIGuild;

export const member: APIGuildMember = {
	roles: ['933378013154906142', '933368398996447292'],
	joined_at: '2022-01-19T16:52:53.953Z',
	deaf: false,
	mute: false,
	user,
	flags: GuildMemberFlags.CompletedOnboarding,
};

export const channel: APIGuildChannel<GuildChannelType> = {
	id: '933395546138357800',
	name: 'test',
	type: 0,
	topic: 'A test channel',
	position: 1,
	guild_id: '933368398996447292',
} as unknown as APIGuildChannel<GuildChannelType>;

export const channel2: APIGuildChannel<GuildChannelType> = {
	id: '870354581115256852',
	name: 'test-1',
	type: 0,
	position: 2,
	nsfw: false,
	rate_limit_per_user: 0,
	guild_id: '933368398996447292',
} as unknown as APIGuildChannel<GuildChannelType>;

export const attachment: APIAttachment = {
	id: '933368398996447291',
	filename: 'test.png',
	proxy_url: 'https://media.discordapp.net/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp',
	size: 4_096,
	url: 'https://cdn.discordapp.com/avatars/903690362114158632/bc4edfabfde4397b2e93b598410fde6c.webp',
};

export const commandData: APIChatInputApplicationCommandInteractionData = {
	id: '938716130720235601',
	name: 'ping',
	type: ApplicationCommandType.ChatInput,
	resolved: {
		users: { [user2.id]: user2, [user.id]: user },
		members: { [user.id]: { ...member, permissions: '8' } },
		channels: {
			[channel.id]: { id: channel.id, name: 'test', type: 0, permissions: '8' },
		},
		roles: { [role.id]: role },
		attachments: { [attachment.id]: attachment },
	},
	options: [
		{
			name: 'sub-command',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'member',
					type: ApplicationCommandOptionType.User,
					value: user.id,
				},
			],
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
							type: ApplicationCommandOptionType.Channel,
							value: channel.id,
						},
					],
				},
			],
		},
		{
			name: 'string',
			type: ApplicationCommandOptionType.String,
			value: 'Hello',
		},
		{
			name: 'channel',
			type: ApplicationCommandOptionType.Channel,
			value: channel.id,
		},
		{
			name: 'role',
			type: ApplicationCommandOptionType.Role,
			value: role.id,
		},
		{
			name: 'mentionable',
			type: ApplicationCommandOptionType.Mentionable,
			value: role.id,
		},
		{
			name: 'mentionable-2',
			type: ApplicationCommandOptionType.Mentionable,
			value: user2.id,
		},
		{
			name: 'boolean',
			type: ApplicationCommandOptionType.Boolean,
			value: true,
		},
		{
			name: 'number',
			type: ApplicationCommandOptionType.Number,
			value: 1.1,
		},
		{
			name: 'integer',
			type: ApplicationCommandOptionType.Integer,
			value: 1,
		},
		{
			name: 'attachment',
			type: ApplicationCommandOptionType.Attachment,
			value: attachment.id,
		},
		{
			name: 'user',
			type: ApplicationCommandOptionType.User,
			value: user2.id,
		},
	],
};

export const interaction: APIApplicationCommandInteraction = {
	id: '933368398996447292',
	application_id: '938716130720235601',
	type: InteractionType.ApplicationCommand,
	data: commandData,
	guild_id: '933368398996447292',
	channel_id: channel.id,
	member: { ...member, permissions: '8' },
	user,
	token: '',
	version: 1,
	locale: Locale.EnglishUS,
	guild_locale: Locale.EnglishUS,
	entitlements: [],
	app_permissions: '8',
	channel,
	authorizing_integration_owners: {},
	attachment_size_limit: 8_388_608,
} as unknown as APIApplicationCommandInteraction;
