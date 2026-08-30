import * as Context from 'effect/Context';

import { ParenType } from '../lib/Interpreter/Lexer';

/**
 * The maximum number of characters a render may produce, or `null` for no limit.
 *
 * Going over it fails with a {@link WorkloadExceededError}. This is the defence against a template
 * that expands cheaply into a very large string, so set it whenever the template author is
 * untrusted.
 *
 * @example
 * ```ts showLineNumbers
 * ts.run(template).pipe(Effect.provideService(CharLimit, 2_000));
 * ```
 */
export const CharLimit: Context.Reference<number | null> = Context.Reference<number | null>(
	'tagscript/effect/CharLimit',
	{ defaultValue: () => null },
);

/**
 * The maximum number of characters read from inside one `\{...\}`. The rest of that tag body is
 * dropped rather than raising, which can turn a long tag into a different, shorter tag, so lower it
 * only when you have a reason.
 */
export const TagLimit: Context.Reference<number> = Context.Reference<number>('tagscript/effect/TagLimit', {
	defaultValue: () => 2_000,
});

/**
 * Which parameter syntaxes a template may use: parenthesis, dot, or both.
 */
export const ParameterSyntax: Context.Reference<ParenType> = Context.Reference<ParenType>(
	'tagscript/effect/ParameterSyntax',
	{ defaultValue: () => ParenType.Both },
);
