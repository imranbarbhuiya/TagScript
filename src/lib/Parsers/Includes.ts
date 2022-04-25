import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class IncludesParser extends BaseParser implements IParser {
	public constructor() {
		super(['includes', 'in', 'indexOf'], true, true);
	}

	public parse(ctx: Context) {
		const dec = ctx.tag.declaration!.toLowerCase();
		if (['includes', 'in'].includes(dec)) {
			return `${ctx.tag.payload!.includes(ctx.tag.parameter!)}`;
		}
		return `${ctx.tag.payload!.indexOf(ctx.tag.parameter!)}`;
	}
}
