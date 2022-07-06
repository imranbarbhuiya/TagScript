import {
	ApplicationCommandOptionType,
	BaseChannel,
	CommandInteractionOption,
	CommandInteractionOptionResolver,
	GuildMember,
	Role,
	User
} from 'discord.js';
import { IntegerTransformer, ITransformer, StringTransformer } from 'tagscript';
import { ChannelTransformer, MemberTransformer, RoleTransformer, UserTransformer } from '../Transformer';

export const mapOptions = (options: readonly CommandInteractionOption[], transformers: Record<string, ITransformer>, prefix = '') => {
	options.forEach((data) => {
		switch (data.type) {
			case ApplicationCommandOptionType.SubcommandGroup:
				transformers.subCommandGroup = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers, `${data.name}-`);
				break;
			case ApplicationCommandOptionType.Subcommand:
				transformers.subCommand = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers, `${prefix}${data.name}-`);
				break;
			case ApplicationCommandOptionType.String:
				transformers[prefix + data.name] = new StringTransformer(data.value as string);
				break;
			case ApplicationCommandOptionType.Boolean:
				transformers[prefix + data.name] = new StringTransformer(data.value as string);
				break;
			case ApplicationCommandOptionType.Integer:
				transformers[prefix + data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case ApplicationCommandOptionType.Number:
				transformers[prefix + data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case ApplicationCommandOptionType.Mentionable:
				transformers[prefix + data.name] =
					data.member instanceof GuildMember
						? new MemberTransformer(data.member)
						: data.role instanceof Role
						? new RoleTransformer(data.role)
						: data.user instanceof User
						? new UserTransformer(data.user)
						: // added only for test. Will be removed after rewriting these tests
						  new StringTransformer(data.value as string);
				break;
			case ApplicationCommandOptionType.User:
				transformers[prefix + data.name] =
					data.member instanceof GuildMember
						? new MemberTransformer(data.member)
						: data.user
						? new UserTransformer(data.user)
						: // added only for test. Will be removed after rewriting these tests
						  new StringTransformer(data.value as string);
				break;
			case ApplicationCommandOptionType.Role:
				data.role instanceof Role && (transformers[prefix + data.name] = new RoleTransformer(data.role));
				break;
			case ApplicationCommandOptionType.Channel:
				data.channel instanceof BaseChannel && (transformers[prefix + data.name] = new ChannelTransformer(data.channel));
				break;
			case ApplicationCommandOptionType.Attachment:
				transformers[prefix + data.name] = new StringTransformer(data.attachment!.url);
		}
	});
};

/**
 *
 * Resolves {@link  https://discord.js.org/#/docs/discord.js/stable/class/CommandInteractionOptionResolver CommandInteractionOptionResolver} options into {@link Record<string, ITransformer>}.
 *
 * @usage
 * ```typescript
 * client.on('interactionCreate', async interaction => {
 *  if (!interaction.isCommand()) return;
 *
 *  if (interaction.commandName === 'ping') {
 *   const result = await ts.run(str, resolveCommandOptions(interaction.options));
 *   await interaction.reply(result.body);
 *  }
});
 * ```
 */
export const resolveCommandOptions = (options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>) => {
	const optionData = options.data;

	const transformers: Record<string, ITransformer> = {};

	mapOptions(optionData, transformers);

	return transformers;
};
