import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * Parser for the `slice` tag.
 * This tag will take a string and return a substring of it.
 *
 * @alias slice, substr, substring
 *
 * @usage
 * ```yaml
 * 		{slice(3): 'Hello World'}
 * 		{slice(3, 7): 'Hello World'}
 * 		{slice(3-7): 'Hello-World'}
 * ```
 */
export class SliceParser extends BaseParser implements IParser {
	public constructor() {
		super(['slice', 'substr', 'substring'], true, true);
	}

	public parse(ctx: Context) {
		if (!ctx.tag.parameter!.includes('-') || !ctx.tag.parameter!.includes(',')) return ctx.tag.payload!.slice(parseInt(ctx.tag.parameter!, 10));

		const spl = ctx.tag.parameter!.includes('-') ? ctx.tag.parameter!.split('-') : ctx.tag.parameter!.split(',');
		if (spl.length !== 2) throw this.throwError(ctx, 'Invalid parameter');
		const start = parseInt(spl[0], 10);
		const end = parseInt(spl[1], 10);
		return ctx.tag.payload!.slice(start, end);
	}

	private throwError(ctx: Context, message: string) {
		return new SyntaxError(`${message} at ${ctx.tag.toString()} when parsing slice tag`);
	}
}
