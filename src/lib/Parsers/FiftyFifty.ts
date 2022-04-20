import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class FiftyFiftyParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['5050', '50', '?'];

	public process(ctx: Context) {
		if (!ctx.token.payload) throw this.throwError(ctx, 'payload is empty');
		const spl = ['', ctx.token.payload];

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}

	private throwError(ctx: Context, message: string) {
		return new TypeError(`${message} at ${ctx.token.toString()} when parsing fiftyfifty token`);
	}
}
