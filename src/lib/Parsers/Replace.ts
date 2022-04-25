import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class ReplaceParser extends BaseParser implements IParser {
	public constructor() {
		super(['replace'], true, true);
	}

	public parse(ctx: Context) {
		const [before, ...rest] = ctx.tag.parameter!.split(',');
		const after = rest.join(',') || '';

		return ctx.tag.payload!.replaceAll(before, after);
	}
}
