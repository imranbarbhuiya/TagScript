const packageNames = ['discord.js'];

/**
 *
 * @type {import('typedoc-plugin-external-link').getURL}
 */
function getURL(_, type) {
	switch (type) {
		case 'BaseChannel':
		case 'Channel':
			return 'https://discord.js.org/#/docs/discord.js/main/class/BaseChannel';
		case 'ChatInputCommandInteraction':
			return 'https://discord.js.org/#/docs/discord.js/main/class/ChatInputCommandInteraction';
		case 'Client':
			return 'https://discord.js.org/#/docs/discord.js/main/class/Client';
		case 'CommandInteraction':
			return 'https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction';
		case 'CommandInteractionOptionResolver':
			return 'https://discord.js.org/#/docs/discord.js/main/class/CommandInteractionOptionResolver';
		case 'Guild':
			return 'https://discord.js.org/#/docs/discord.js/main/class/Guild';
		case 'GuildMember':
			return 'https://discord.js.org/#/docs/discord.js/main/class/GuildMember';
		case 'Role':
			return 'https://discord.js.org/#/docs/discord.js/main/class/Role';
		case 'TextChannel':
			return 'https://discord.js.org/#/docs/discord.js/main/class/TextChannel';
		case 'User':
			return 'https://discord.js.org/#/docs/discord.js/main/class/User';

		case 'CommandInteractionOption':
			return 'https://discord.js.org/#/docs/discord.js/main/typedef/CommandInteractionOption';

		case 'ApplicationCommandOptionType':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType';
		case 'ApplicationCommandType':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandType';
		case 'InteractionType':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/enum/InteractionType';

		case 'APIAttachment':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/interface/APIAttachment';
		case 'APIEmbed':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/interface/APIEmbed';
		case 'APIGuild':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/interface/APIGuild';
		case 'APIGuildMember':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/interface/APIGuildMember';
		case 'APIRole':
			return 'https://discord-api-types.dev/api/discord-api-types-v10/interface/APIRole';

		case 'APIApplicationCommandInteraction':
			return 'https://discord-api-types.dev/api/discord-api-types-v10#APIApplicationCommandInteraction';
		case 'APIChannel':
			return 'https://discord-api-types.dev/api/discord-api-types-v10#APIChannel';
	}

	return undefined;
}

module.exports = { packageNames, getURL };
