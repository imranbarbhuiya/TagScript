import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * The strict variable tag represents the transformer for any seeded or defined variables.
 * This variable implementation is considered `strict` since it checks whether the variable is
 * valid during `willAccept` and is only parsed if the declaration refers to a valid
 * variable.
 *
 * @example
 * ```yaml
 *      # Note:- this example assumes you are using define parser
 * 		{=(var):This is my variable.}
 *      {var}
 *      # This is my variable.
 * ```
 */
export class StrictVarsParser implements IParser {
	public willAccept(ctx: Context) {
		return ctx.tag.declaration! in ctx.response.variables;
	}

	public parse(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables) return ctx.response.variables[ctx.tag.declaration!].transform(ctx.tag);
		return null;
	}
}
