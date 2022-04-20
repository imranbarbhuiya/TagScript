import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class RangeParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['rangef', 'range'];

	public process(ctx: Context) {
		if (!ctx.token.payload) throw new TypeError(`payload is empty at ${ctx.token.toString()}`);
		try {
			const spl = ctx.token.payload.split('-');
			if (ctx.token.declaration!.toLowerCase() === 'rangef') {
				const lower = parseFloat(spl[0]);
				const upper = parseFloat(spl[1]);
				const base = Math.floor(Math.random() * (upper * 10 - lower * 10) + lower * 10) / 10;
				return `${base}`;
			}
			const lower = parseInt(spl[0], 10);
			const upper = parseInt(spl[1], 10);
			const base = Math.floor(Math.random() * (upper - lower) + lower);
			return `${base}`;
		} catch {
			return null;
		}
	}
}
