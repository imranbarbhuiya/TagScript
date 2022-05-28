import { Channel, CommandInteractionOption, CommandInteractionOptionResolver, GuildMember, Role } from 'discord.js';
import { IntegerTransformer, ITransformer, StringTransformer } from 'tagscript';
import { ChannelTransformer, MemberTransformer, RoleTransformer, UserTransformer } from '../Transformer';

export const mapOptions = (options: readonly CommandInteractionOption[], transformers: Record<string, ITransformer>, prefix = '') => {
	options.forEach((data) => {
		switch (data.type) {
			case 'SUB_COMMAND_GROUP':
				transformers.subCommandGroup = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers, `${data.value}-`);
				break;
			case 'SUB_COMMAND':
				transformers.subCommand = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers, `${prefix}${data.value}-`);
				break;
			case 'STRING':
				transformers[prefix + data.name] = new StringTransformer(data.value as string);
				break;
			case 'BOOLEAN':
				transformers[prefix + data.name] = new StringTransformer(data.value as string);
				break;
			case 'INTEGER':
				transformers[prefix + data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case 'NUMBER':
				transformers[prefix + data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case 'MENTIONABLE':
				transformers[prefix + data.name] =
					data.member instanceof GuildMember
						? new MemberTransformer(data.member)
						: data.role instanceof Role
						? new RoleTransformer(data.role)
						: new UserTransformer(data.user!);
				break;
			case 'USER':
				transformers[prefix + data.name] =
					data.member instanceof GuildMember ? new MemberTransformer(data.member) : new UserTransformer(data.user!);
				break;
			case 'ROLE':
				data.role instanceof Role && (transformers[prefix + data.name] = new RoleTransformer(data.role));
				break;
			case 'CHANNEL':
				data.channel instanceof Channel && (transformers[prefix + data.name] = new ChannelTransformer(data.channel));
				break;
			case 'ATTACHMENT':
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
