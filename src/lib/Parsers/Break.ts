import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from '../Utils/Util';

/**
 * The break block will force the tag output to only be the payload of this block, if the passed
 * expression evaluates true.
 * @usage
 * ```yaml
 *    {break(<expression>):[message]}
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
