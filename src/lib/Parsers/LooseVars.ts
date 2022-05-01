import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

export class LooseVarsParser implements IParser {
	public willAccept() {
		return true;
	}

	public parse(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables) return ctx.response.variables[ctx.tag.declaration!].transform(ctx.tag);
		return null;
	}
}
