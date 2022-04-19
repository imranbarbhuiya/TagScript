import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class FiftyFiftyParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['5050', '50', '?'];

	public process(ctx: Context) {
		const spl = ['', ctx.token.payload];

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
