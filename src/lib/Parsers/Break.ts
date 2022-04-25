import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from './helpers';

export class BreakParser extends BaseParser implements IParser {
	public constructor() {
		super(['break', 'exit', 'end', 'stop']);
	}

	public process(ctx: Context) {
		if (parseIf(ctx.tag.parameter!)) {
			ctx.response.body = ctx.tag.payload ?? '';
		}
		return '';
	}
}
