import { Channel, CommandInteractionOption, CommandInteractionOptionResolver, GuildMember, Role } from 'discord.js';
import { IntegerTransformer, ITransformer, StringTransformer } from 'tagscript';
import { ChannelTransformer, MemberTransformer, RoleTransformer, UserTransformer } from '../Transformer';

export const mapOptions = (options: readonly CommandInteractionOption[], transformers: Record<string, ITransformer>) => {
	options.forEach((data) => {
		switch (data.type) {
			case 'SUB_COMMAND_GROUP':
				transformers.subCommandGroup = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers);
				break;
			case 'SUB_COMMAND':
				transformers.subCommand = new StringTransformer(data.value as string);
				mapOptions(data.options!, transformers);
				break;
			case 'STRING':
				transformers[data.name] = new StringTransformer(data.value as string);
				break;
			case 'BOOLEAN':
				transformers[data.name] = new StringTransformer(data.value as string);
				break;
			case 'INTEGER':
				transformers[data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case 'NUMBER':
				transformers[data.name] = new IntegerTransformer(data.value as `${number}`);
				break;
			case 'MENTIONABLE':
				transformers[data.name] =
					data.member instanceof GuildMember
						? new MemberTransformer(data.member)
						: data.role instanceof Role
						? new RoleTransformer(data.role)
						: new UserTransformer(data.user!);
				break;
			case 'USER':
				transformers[data.name] = data.member instanceof GuildMember ? new MemberTransformer(data.member) : new UserTransformer(data.user!);
				break;
			case 'ROLE':
				data.role instanceof Role && (transformers[data.name] = new RoleTransformer(data.role));
				break;
			case 'CHANNEL':
				data.channel instanceof Channel && (transformers[data.name] = new ChannelTransformer(data.channel));
				break;
			case 'ATTACHMENT':
				transformers[data.name] = new StringTransformer(data.attachment!.url);
		}
	});
};

/**
 *
 * Resolves {@link CommandInteractionOptionResolver} options into {Record<string, ITransformer>}s.
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
export const resolveCommandOptions = (options: CommandInteractionOptionResolver) => {
	const optionData = options.data;

	const transformers: Record<string, ITransformer> = {};

	mapOptions(optionData, transformers);

	return transformers;
};
