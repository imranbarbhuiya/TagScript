import { IParser } from '../interfaces';
import { Context } from '../Interpreter';

export class StrictVarsParser implements IParser {
	public willAccept(ctx: Context) {
		return ctx.tag.declaration! in ctx.response.variables;
	}

	public process(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables)
			return ctx.response.variables[ctx.tag.declaration!].getValue(ctx.tag);
		return null;
	}
}
