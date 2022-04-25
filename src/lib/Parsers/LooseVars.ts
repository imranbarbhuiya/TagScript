import { IParser } from '../interfaces';
import { Context } from '../Interpreter';

export class LooseVarsParser implements IParser {
	public willAccept() {
		return true;
	}

	public process(ctx: Context) {
		if (ctx.tag.declaration! in ctx.response.variables)
			return ctx.response.variables[ctx.tag.declaration!].getValue(ctx.tag);
		return null;
	}
}
