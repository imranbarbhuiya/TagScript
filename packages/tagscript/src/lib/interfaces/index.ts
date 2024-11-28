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
	transform: (tag: Lexer) => string | null;
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
	parse: (ctx: Context) => Awaitable<string | null>;
	/**
	 * Whether the parser can handle the given tag.
	 *
	 * @param ctx - The context of the tag.
	 */
	willAccept: (ctx: Context) => Awaitable<boolean>;
}

/**
 * This is used to store key-value pairs and can be passed to `Interpreter` for parsers to use.
 * It is empty by default and so has type `{}`.
 * If you want to use it, you need to use [Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to add your own properties.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IKeyValues {}

/**
 * This is used to store actions data by to parsers for later use by developers.
 * If you want to add more actions to it, you need to use [Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).
 */
export interface IActions {
	deny?: { ids: string[]; message: string | null };
	require?: { ids: string[]; message: string | null };
}
