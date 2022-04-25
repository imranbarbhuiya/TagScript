import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class FiftyFiftyParser extends BaseParser implements IParser {
	public constructor() {
		super(['5050', '50', '?'], false, true);
	}

	public process(ctx: Context) {
		const spl = ['', ctx.tag.payload];

		const index = Math.floor(Math.random() * spl.length);
		return spl[index];
	}
}
