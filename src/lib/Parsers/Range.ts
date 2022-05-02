import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * The range tag picks a random number from a range of numbers separated by `-`.
 * The number range is inclusive, so it can pick the starting/ending number as well.
 * Using the rangef block will pick a number to the tenth decimal place.
 *
 * @alias rangef
 *
 * @usage
 * ```yaml
 * 		{range(1-3)}
 * ```
 *
 * @example
 * ```yaml
 * 		Your lucky number is {range:10-30}!
 * 		# Your lucky number is 14!
 * 		# Your lucky number is 25!
 * 		{=(height):{rangef:5-7}}
 * 		I am guessing your height is {height}ft.
 * 		# I am guessing your height is 5.3ft.
 * ```
 */
export class RangeParser extends BaseParser implements IParser {
	public constructor() {
		super(['rangef', 'range'], false, true);
	}

	public parse(ctx: Context) {
		const spl = ctx.tag.payload!.split('-');
		if (ctx.tag.declaration!.toLowerCase() === 'rangef') {
			const lower = parseFloat(spl[0]);
			const upper = parseFloat(spl[1]);
			const base = Math.floor(Math.random() * (upper * 10 - lower * 10) + lower * 10) / 10;
			return `${base}`;
		}
		const lower = parseInt(spl[0], 10);
		const upper = parseInt(spl[1], 10);
		const base = Math.floor(Math.random() * (upper - lower) + lower);
		return `${base}`;
	}
}
