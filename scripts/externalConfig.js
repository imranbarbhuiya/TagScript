/* eslint-disable tsdoc/syntax */
const packageNames = ['discord.js', 'discord-api-types'];

/**
 *
 * @type {import('typedoc-plugin-external-link').getURL}
 */
function getURL(packageName, type) {
	if (!type && packageName === 'discord.js') return 'https://discordjs.dev/';
	if (!type) return `https://www.npmjs.com/package/${packageName}`;
	switch (type) {
		case 'BaseChannel':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/BaseChannel';
		case 'ChatInputCommandInteraction':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/ChatInputCommandInteraction';
		case 'Client':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/Client';
		case 'CommandInteraction':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/CommandInteraction';
		case 'CommandInteractionOptionResolver':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/CommandInteractionOptionResolver';
		case 'Guild':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/Guild';
		case 'GuildMember':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/GuildMember';
		case 'Role':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/Role';
		case 'TextChannel':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/TextChannel';
		case 'User':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/class/User';

		case 'CommandInteractionOption':
			return 'https://old.discordjs.dev/#/docs/discord.js/main/typedef/CommandInteractionOption';

		case 'CacheType':
			return 'https://github.com/discordjs/discord.js/blob/4d8361c711df423f154a7460939c60f6d9429105/packages/discord.js/typings/index.d.ts#L1474';
		case 'Channel':
			return 'https://github.com/discordjs/discord.js/blob/4d8361c711df423f154a7460939c60f6d9429105/packages/discord.js/typings/index.d.ts#L5433';
		case 'EmbedData':
			return 'https://github.com/discordjs/discord.js/blob/4d8361c711df423f154a7460939c60f6d9429105/packages/discord.js/typings/index.d.ts#L663';

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
