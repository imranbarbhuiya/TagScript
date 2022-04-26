import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

export class StrictVarsParser implements IParser {
	public willAccept(ctx: Context) {
		return ctx.tag.declaration! in ctx.response.variables;
	}

	public parse(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables)
			return ctx.response.variables[ctx.tag.declaration!].transform(ctx.tag);
		return null;
	}
}
