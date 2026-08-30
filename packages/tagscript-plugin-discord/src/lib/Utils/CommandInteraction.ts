import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { IntegerTransformer, StringTransformer, type ITransformer } from 'tagscript';

import { ChannelTransformer, MemberTransformer, RoleTransformer, UserTransformer } from '../Transformer';

import type {
	APIApplicationCommandInteractionDataOption,
	APIChatInputApplicationCommandInteractionData,
	APIInteractionDataResolved,
} from 'discord-api-types/v10';

const userTransformer = (id: string, resolved: APIInteractionDataResolved) => {
	const user = resolved.users?.[id];
	if (!user) return null;

	const member = resolved.members?.[id];
	return member ? new MemberTransformer({ ...member, user }) : new UserTransformer(user);
};

/**
 * Maps a slash command's options onto transformers, following subcommands into the same flat object.
 *
 * @param options - The options to map
 * @param resolved - The interaction's resolved data, which holds the objects the options point at
 * @param transformers - The object to write the transformers onto
 * @param prefix - Prepended to every option name, used to namespace subcommand options
 */
export const mapOptions = (
	options: readonly APIApplicationCommandInteractionDataOption[],
	resolved: APIInteractionDataResolved,
	transformers: Record<string, ITransformer>,
	prefix = '',
) => {
	for (const option of options) {
		const name = prefix + option.name;

		switch (option.type) {
			case ApplicationCommandOptionType.SubcommandGroup:
				transformers.subCommandGroup = new StringTransformer(option.name);
				mapOptions(option.options, resolved, transformers, `${option.name}-`);
				break;
			case ApplicationCommandOptionType.Subcommand:
				transformers.subCommand = new StringTransformer(option.name);
				mapOptions(option.options ?? [], resolved, transformers, `${prefix}${option.name}-`);
				break;
			case ApplicationCommandOptionType.String:
			case ApplicationCommandOptionType.Boolean:
				transformers[name] = new StringTransformer(String(option.value));
				break;
			case ApplicationCommandOptionType.Integer:
			case ApplicationCommandOptionType.Number:
				transformers[name] = new IntegerTransformer(`${option.value}` as `${number}`);
				break;
			case ApplicationCommandOptionType.User: {
				const transformer = userTransformer(option.value, resolved);
				if (transformer) transformers[name] = transformer;
				break;
			}

			case ApplicationCommandOptionType.Mentionable: {
				const role = resolved.roles?.[option.value];
				const transformer = role ? new RoleTransformer(role) : userTransformer(option.value, resolved);
				if (transformer) transformers[name] = transformer;
				break;
			}

			case ApplicationCommandOptionType.Role: {
				const role = resolved.roles?.[option.value];
				if (role) transformers[name] = new RoleTransformer(role);
				break;
			}

			case ApplicationCommandOptionType.Channel: {
				const channel = resolved.channels?.[option.value];
				if (channel) transformers[name] = new ChannelTransformer(channel);
				break;
			}

			case ApplicationCommandOptionType.Attachment: {
				const attachment = resolved.attachments?.[option.value];
				if (attachment) transformers[name] = new StringTransformer(attachment.url);
			}
		}
	}
};

/**
 * Turns a chat input command's data into transformers, ready to pass to `run` as seed variables. Whatever the
 * user typed into the command becomes readable by name from the template.
 *
 * @example
 * ```ts showLineNumbers
 * client.on('interactionCreate', async (interaction) => {
 *  if (!interaction.isChatInputCommand()) return;
 *
 *  const result = await ts.run(template, resolveCommandOptions(data));
 *  await interaction.reply(result.body);
 * });
 * ```
 * @param data - The command data off the interaction payload
 * @returns One transformer per option, keyed by option name
 */
export const resolveCommandOptions = (data: APIChatInputApplicationCommandInteractionData) => {
	const transformers: Record<string, ITransformer> = {};

	mapOptions(data.options ?? [], data.resolved ?? {}, transformers);

	return transformers;
};
