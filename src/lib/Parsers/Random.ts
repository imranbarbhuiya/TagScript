import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class RandomParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['random', 'rand'];

	public process(ctx: Context) {
		let spl = [];
		if (ctx.token.payload?.includes('~')) spl = ctx.token.payload.split('~');
		else spl = ctx.token.payload!.split(',');

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
