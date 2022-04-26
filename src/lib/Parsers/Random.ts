import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class RandomParser extends BaseParser implements IParser {
	public constructor() {
		super(['random', 'rand'], false, true);
	}

	public parse(ctx: Context) {
		let spl = [];
		if (ctx.tag.payload!.includes('~')) spl = ctx.tag.payload!.split('~');
		else spl = ctx.tag.payload!.split(',');

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
