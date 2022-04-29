import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from '../Utils/Util';

/**
 * The break tag will force the tag output to only be the payload of this tag, if the passed
 * expression evaluates true.
 * @usage
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
