import { StringAdapter } from '../Adapters/String';
import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class DefineParser extends BaseParser implements Parser {
	protected acceptedNames = ['=', 'assign', 'let', 'var'];
	protected requiredParameter = true;

	public process(ctx: Context) {
		ctx.response.variables[ctx.token.parameter!] = new StringAdapter(ctx.token.payload!);
		return '';
	}
}
