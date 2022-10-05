import type { Context, Lexer } from '../Interpreter';
import type { Awaitable } from '../Utils/Util';

/**
 * Transformers are used to transform a value based on the tag at runtime.
 */
export interface ITransformer {
	/**
	 * Transforms the given tag.
	 *
	 * @param tag - The tag that triggered the transformer.
	 */
	transform(tag: Lexer): string | null;
}

/**
 * Parsers are used to parse a tag and return a value based on the tag.
 */
export interface IParser {
	/**
	 * Parses the given tag.
	 *
	 * @param ctx - The context of the tag.
	 */
	parse(ctx: Context): Awaitable<string | null>;
	/**
	 * Whether the parser can handle the given tag.
	 *
	 * @param ctx - The context of the tag.
	 */
	willAccept(ctx: Context): Awaitable<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IKeyValues {}

export interface IActions {
	deny?: { ids: string[]; message: string | null };
	require?: { ids: string[]; message: string | null };
}
