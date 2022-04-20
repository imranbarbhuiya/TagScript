import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class SliceParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['slice', 'substr', 'substring'];

	public process(ctx: Context) {
		if (!ctx.token.parameter) throw this.throwError(ctx, 'No parameter provided');
		if (!ctx.token.payload) throw this.throwError(ctx, 'No payload provided');
		if (!ctx.token.parameter.includes('-')) return ctx.token.payload.slice(parseInt(ctx.token.parameter, 10));

		const spl = ctx.token.parameter.split('-');
		if (spl.length !== 2) throw this.throwError(ctx, 'Invalid parameter');
		const start = parseInt(spl[0], 10);
		const end = parseInt(spl[1], 10);
		return ctx.token.payload.slice(start, end);
	}

	private throwError(ctx: Context, message: string) {
		return new SyntaxError(`${message} at ${ctx.token.toString()} when parsing slice token`);
	}
}
