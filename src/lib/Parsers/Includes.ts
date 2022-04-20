import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class IncludesParser extends BaseParser implements Parser {
	protected override acceptedNames = ['includes', 'in', 'indexOf'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public process(ctx: Context) {
		const dec = ctx.token.declaration!.toLowerCase();
		if (['includes', 'in'].includes(dec)) {
			return `${ctx.token.payload!.includes(ctx.token.parameter!)}`;
		}
		return `${ctx.token.payload!.indexOf(ctx.token.parameter!)}`;
	}
}
