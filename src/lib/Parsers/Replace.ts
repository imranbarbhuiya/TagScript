import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class ReplaceParser extends BaseParser implements Parser {
	protected override acceptedNames = ['replace'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public process(ctx: Context) {
		const [before, ...rest] = ctx.token.parameter!.split(',');
		const after = rest.join(',') || '';

		return ctx.token.payload!.replaceAll(before, after);
	}
}
