import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * The loose variable tag represents the transformer for any seeded or defined variables.
 * This variable implementation is considered `loose` since it checks whether the variable is
 * valid during `parsing`, rather than `willAccept`.
 *
 * @example
 * ```yaml
 * # Note:- this example assumes you are using define parser
 * {=(var):This is my variable.}
 * {var}
 * # This is my variable.
 * ```
 */
export class LooseVarsParser implements IParser {
	public willAccept() {
		return true;
	}

	public parse(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables) return ctx.response.variables[ctx.tag.declaration!].transform(ctx.tag);
		return null;
	}
}
