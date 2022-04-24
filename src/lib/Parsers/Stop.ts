import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from './helpers';

export class StopParser extends BaseParser implements Parser {
	protected override acceptedNames = ['stop', 'halt', 'error'];
	protected override requiredParameter = true;

	public process(ctx: Context) {
		if (parseIf(ctx.token.parameter!)) throw new Error(ctx.token.payload ?? '');
		return '';
	}
}
