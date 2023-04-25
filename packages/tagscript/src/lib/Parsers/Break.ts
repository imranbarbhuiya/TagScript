import { BaseParser } from './Base';

import { parseIf } from '../Utils/Util';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * The break parser will force the tag output to only be the payload of this tag, if the passed
 * expression evaluates true.
 * If no message is provided to the payload, the tag output will be empty.
 * This differs from the `StopParser` as the stop tag stops all TagScript parsing and returns
 * its message while the break tag continues to parse tags. If any other tags exist after
 * the break tag, they will still execute.
 *
 * @example
 * ```yaml
 *    {break(expression):message}
 * ```
 * @example
 * ```yaml
 *    {break({args}==):You did not provide any input.}
 * ```
 */
export class BreakParser extends BaseParser implements IParser {
	public constructor() {
		super(['break']);
	}

	public parse(ctx: Context) {
		if (parseIf(ctx.tag.parameter!)) {
			ctx.response.body = ctx.tag.payload ?? '';
		}

		return '';
	}
}
