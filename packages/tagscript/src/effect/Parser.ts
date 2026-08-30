import * as Effect from 'effect/Effect';

import type { ParseContext } from './Context';

/**
 * A parser on the Effect surface.
 *
 * The two type parameters are what the classic surface cannot express. `E` is what this parser can
 * fail with, and `R` is what it needs to be given before it can run, so a parser that reads from
 * Redis or an HTTP API declares that in its type and the compiler makes the application supply it.
 *
 * @typeParam E - What the parser can fail with. A `TemplateError` is rendered in place of the tag;
 * anything else reaches the caller's error channel.
 * @typeParam R - The services the parser needs.
 */
export interface Parser<E = never, R = never> {
	/**
	 * Turns the tag into the text that replaces it.
	 *
	 * Returning `null` means this parser did not handle the tag after all, and the interpreter moves
	 * on to the next parser that accepted it.
	 *
	 * @param ctx - The tag being processed.
	 */
	readonly parse: (ctx: ParseContext) => Effect.Effect<string | null | undefined, E, R>;
	/**
	 * Whether this parser wants to handle the tag.
	 *
	 * @param ctx - The tag being processed.
	 */
	readonly willAccept: (ctx: ParseContext) => Effect.Effect<boolean, E, R>;
}

/**
 * The options {@link definePlugin} accepts.
 *
 * @typeParam E - What the parser can fail with.
 * @typeParam R - The services the parser needs.
 */
export interface PluginOptions<E, R> {
	/**
	 * The declarations this parser answers to, lowercase. `['cooldown', 'cd']` accepts both
	 * `\{cooldown\}` and `\{cd\}`.
	 */
	readonly names: readonly string[];
	/**
	 * Turns the tag into the text that replaces it.
	 */
	readonly parse: (ctx: ParseContext) => Effect.Effect<string | null | undefined, E, R>;
	/**
	 * Whether the tag must carry a parameter, the `(...)` or `.` part.
	 *
	 * @defaultValue false
	 */
	readonly requiredParameter?: boolean;
	/**
	 * Whether the tag must carry a payload, the part after the `:`.
	 *
	 * @defaultValue false
	 */
	readonly requiredPayload?: boolean;
}

/**
 *
 * Builds a {@link Parser} from a list of names and a body, which is what most parsers need.
 *
 * The name match is case insensitive, matching the classic `BaseParser`.
 *
 * @param options - The names to accept and the body to run.
 * @returns
 * @typeParam E - What the parser can fail with.
 * @typeParam R - The services the parser needs.
 * @example
 * ```ts showLineNumbers
 * export const upperParser = definePlugin({
 * 	names: ['upper'],
 * 	requiredPayload: true,
 * 	parse: Effect.fnUntraced(function* (ctx) {
 * 		return ctx.tag.payload!.toUpperCase();
 * 	}),
 * });
 * ```
 */
export const definePlugin = <E = never, R = never>(options: PluginOptions<E, R>): Parser<E, R> => {
	const names = new Set(options.names);

	return {
		willAccept: (ctx) =>
			Effect.succeed(
				names.has(ctx.tag.declaration?.toLowerCase() ?? '') &&
					Boolean(!options.requiredParameter || ctx.tag.parameter) &&
					Boolean(!options.requiredPayload || ctx.tag.payload),
			),
		parse: options.parse,
	};
};
