import { BaseParser } from './Base';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * The fifty-fifty tag has a 50% change of returning the payload, and 50% chance of returning empty string.
 *
 * @example
 * ```yaml
 *   {5050:message}
 * ```
 * Aliases: 50, ?
 * @example
 * ```yaml
 *  I pick {if({5050:.}!=):heads|tails}
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
