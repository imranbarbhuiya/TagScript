import { Context, Parser } from '../Interpreter';

export class LooseVarsParser implements Parser {
	public willAccept() {
		return true;
	}

	public process(ctx: Context) {
		if (ctx.token.declaration! in ctx.response.variables)
			return ctx.response.variables[ctx.token.declaration!].getValue(ctx.token);
		return null;
	}
}
