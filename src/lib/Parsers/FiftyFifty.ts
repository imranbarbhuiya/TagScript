import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * The fifty-fifty tag has a 50% change of returning the payload, and 50% chance of returning null.
 *
 * @usage
 * ```yaml
 *   {5050:message}
 * ```
 *
 * @alias 50, ?
 *
 * @example
 * ```yaml
 *  {5050:This tag is 50% likely to succeed.}
 * ```
 */
export class FiftyFiftyParser extends BaseParser implements IParser {
	public constructor() {
		super(['5050', '50', '?'], false, true);
	}

	public parse(ctx: Context) {
		const spl = ['', ctx.tag.payload];

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
