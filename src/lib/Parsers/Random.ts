import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class RandomParser extends BaseParser implements IParser {
	public constructor() {
		super(['random', 'rand'], false, true);
	}

	public process(ctx: Context) {
		let spl = [];
		// TODO: recheck
		if (ctx.tag.payload!.includes('~')) spl = ctx.tag.payload!.split('~');
		else spl = ctx.tag.payload!.split(',');

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
