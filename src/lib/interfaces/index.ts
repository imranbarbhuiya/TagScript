import type { Snowflake, MessageEmbedOptions } from 'discord.js';
import type { Context, Lexer } from '../Interpreter';
import type { Awaitable } from '../Utils/Util';

/**
 * Transformers are used to transform a value based on the tag at runtime.
 */
export interface ITransformer {
	/**
	 * Transforms the given tag.
	 * @param tag The tag that triggered the transformer.
	 */
	transform(tag: Lexer): string | null;
}

/**
 * Parsers are used to parse a tag and return a value based on the tag.
 */
export interface IParser {
	/**
	 * Whether the parser can handle the given tag.
	 * @param ctx The context of the tag.
	 */
	willAccept(ctx: Context): Awaitable<boolean>;
	/**
	 * Parses the given tag.
	 * @param ctx The context of the tag.
	 */
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
	delete?: boolean;
	silent?: boolean;
}
