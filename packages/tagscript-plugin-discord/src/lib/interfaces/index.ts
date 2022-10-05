import type { EmbedData, APIEmbed, Channel, Guild } from 'discord.js';
import 'tagscript';

declare module 'tagscript' {
	export interface IActions {
		cooldown?: {
			cooldown: number;
			message: string | null;
		};
		deleteMessage?: boolean;
		embed?: APIEmbed | EmbedData;
		files?: string[];
		silentResponse?: boolean;
	}
}

export type GuildChannel = Extract<Channel, { guild: Guild }>;
