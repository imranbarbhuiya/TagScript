import { BaseParser } from './Base';

import { split } from '../Utils/Util';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * Pick a random item from a list of strings, split by either `~` or `,`.
 *
 * Aliases: rand
 *
 * @example
 * ```yaml
 * {random:foo, bar}
 * ```
 */
export class RandomParser extends BaseParser implements IParser {
	public constructor() {
		super(['random', 'rand'], false, true);
	}

	public parse(ctx: Context) {
		const spl = split(ctx.tag.payload!, true);

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
