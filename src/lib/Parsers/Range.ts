import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class RangeParser extends BaseParser implements IParser {
	public constructor() {
		super(['rangef', 'range'], false, true);
	}

	public process(ctx: Context) {
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
