import 'tagscript';
import type {
	APIEmbed,
	APIGuildChannel,
	APIGuildMember,
	APIInteractionDataResolvedChannel,
	APIInteractionDataResolvedGuildMember,
	APIUser,
	GuildChannelType,
} from 'discord-api-types/v10';

declare module 'tagscript' {
	export interface IKeyValues {
		/**
		 * What to key a cooldown by, read by the Effect `cooldownParser`.
		 *
		 * A bot rendering many tags sets this per render so they do not share one cooldown. Without
		 * it the parser falls back to the template itself, which works but treats two tags with the
		 * same text as one.
		 */
		tagName?: string;
	}

	export interface IActions {
		cooldown?: {
			cooldown: number;
			message: string | null;
		};
		deleteMessage?: boolean;
		embed?: APIEmbed;
		files?: string[];
		silentResponse?: boolean;
	}
}

/**
 * A channel that lives in a guild, either the full payload or the trimmed one Discord attaches to an
 * interaction's resolved data.
 */
export type GuildChannel = APIGuildChannel<GuildChannelType> | APIInteractionDataResolvedChannel;

/**
 * A guild member payload with its user attached. Discord leaves `user` out of the members it resolves into an
 * interaction, so add it back from `resolved.users` before handing a member to {@link MemberTransformer}.
 */
export type GuildMember = (APIGuildMember | APIInteractionDataResolvedGuildMember) & { user: APIUser };
