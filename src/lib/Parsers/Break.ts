import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from './helpers';

export class BreakParser extends BaseParser implements Parser {
	protected acceptedNames = ['break', 'exit', 'end', 'stop'];

	public process(ctx: Context) {
		if (parseIf(ctx.token.parameter!)) {
			ctx.response.body = ctx.token.payload ?? '';
		}
		return '';
	}
}
