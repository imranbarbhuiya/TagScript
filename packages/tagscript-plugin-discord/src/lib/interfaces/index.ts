import { EmbedData, APIEmbed, Channel, Guild } from 'discord.js';
import 'tagscript';

declare module 'tagscript' {
	export interface IActions {
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

/**
 * @external Discord.js
 * @see {@link https://discord.js.org/#/}
 */

/**
 * @external Guild
 * @see {@link https://discord.js.org/#/docs/discord.js/stable/class/Guild}
 */

/**
 * @external GuildMember
 * @see {@link https://discord.js.org/#/docs/discord.js/stable/class/GuildMember}
 */

/**
 * @external Role
 * @see {@link https://discord.js.org/#/docs/discord.js/stable/class/Role}
 */

/**
 * @external User
 * @see {@link https://discord.js.org/#/docs/discord.js/stable/class/User}
 */

/**
 * @external ITransformer
 * @see {@link https://tagscript.js.org/interfaces/tagscript.ITransformer.html}
 */

/**
 * @external IParser
 * @see {@link https://tagscript.js.org/interfaces/tagscript.IParser.html}
 */

/**
 * @external Lexer
 * @see {@link https://tagscript.js.org/classes/tagscript.Lexer.html}
 */

/**
 * @external Context
 * @see {@link https://tagscript.js.org/classes/tagscript.Context.html}
 */
