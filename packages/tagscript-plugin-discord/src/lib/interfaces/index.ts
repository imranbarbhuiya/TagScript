import { EmbedData, APIEmbed, Channel, Guild } from 'discord.js';
import 'tagscript';

declare module 'tagscript' {
	interface IActions {
		cooldown?: {
			cooldown: number;
			message: string | null;
		};
		embed?: EmbedData | APIEmbed;
		deleteMessage?: boolean;
		silentResponse?: boolean;
		files?: string[];
	}
}

export type GuildChannel = Extract<Channel, { guild: Guild }>;
