import type { Snowflake, MessageEmbedOptions } from 'discord.js';
import type { Context, Lexer } from '../Interpreter';
import type { Awaitable } from '../Utils/Util';

export interface ITransformer {
	transform(tag: Lexer): string | null;
}
export interface IParser {
	willAccept(ctx: Context): Awaitable<boolean>;
	parse(ctx: Context): Awaitable<string | null>;
}

export interface IKeyValues {}

export interface IActions {
	cooldown?: {
		cooldown: number;
		message: string | null;
	};
	require?: { ids: Snowflake[]; message: string | null };
	deny?: { ids: Snowflake[]; message: string | null };
	embed?: MessageEmbedOptions;
}
