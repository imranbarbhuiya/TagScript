import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';
/**
 * The in block serves four different purposes depending on the alias that is used.
 * The `in` and `includes` alias checks if the parameter is anywhere in the payload.
 * `contain` strictly checks if the parameter is the payload, split by whitespace.
 * `index` finds the location of the parameter in the payload, split by whitespace.
 * `lindex` finds the location of the parameter in the payload.
 *
 * @alias includes, in, index, lindex, contain,
 *
 * @usage
 * ```yaml
 *      {in(there):Hi there!}
 *      # true
 * 	    {contain(there):Hi there!}
 * 		# false
 * 		{contain(there!):Hi there!}
 * 		# true
 *      {index(there):Hi there!}
 * 	    # 1
 * 		{lindex(t):Hi there!}
 * 		# 4
 * ```
 *
 */
export class IncludesParser extends BaseParser implements IParser {
	public constructor() {
		super(['includes', 'in', 'contain', 'index', 'lindex'], true, true);
	}

	public parse(ctx: Context) {
		const dec = ctx.tag.declaration!.toLowerCase();
		if (['includes', 'in'].includes(dec)) {
			return `${ctx.tag.payload!.includes(ctx.tag.parameter!)}`;
		}
		if (dec === 'contain') {
			const index = ctx.tag.payload!.split(/\s+/).includes(ctx.tag.parameter!);
			return `${index}`;
		}
		if (dec === 'index') {
			const index = ctx.tag.payload!.split(/\s+/).indexOf(ctx.tag.parameter!);
			return `${index}`;
		}
		return `${ctx.tag.payload!.indexOf(ctx.tag.parameter!)}`;
	}
}
