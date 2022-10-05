import { BaseParser } from './Base';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * Parser for the `slice` tag.
 * This tag will take a string and return a substring of it.
 *
 * Aliases: slice, substr, substring
 *
 * @example
 * ```yaml
 * {slice(3): Hello World}
 * {slice(3, 7): Hello World}
 * {slice(3-7): Hello World}
 * ```
 */
export class SliceParser extends BaseParser implements IParser {
	public constructor() {
		super(['slice', 'substr', 'substring'], true, true);
	}

	public parse(ctx: Context) {
		if (!ctx.tag.parameter!.includes('-') && !ctx.tag.parameter!.includes(','))
			return ctx.tag.payload!.slice(Number.parseInt(ctx.tag.parameter!, 10));

		const spl = ctx.tag.parameter!.includes('-') ? ctx.tag.parameter!.split('-') : ctx.tag.parameter!.split(',');
		const start = Number.parseInt(spl[0], 10);
		const end = Number.parseInt(spl[1], 10);
		return ctx.tag.payload!.slice(start, end);
	}
}
