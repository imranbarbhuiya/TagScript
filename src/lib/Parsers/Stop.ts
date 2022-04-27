import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';
import { parseIf } from '../Utils/Util';

export class StopParser extends BaseParser implements IParser {
	public constructor() {
		super(['stop', 'halt', 'error'], true);
	}

	public parse(ctx: Context) {
		if (parseIf(ctx.tag.parameter!)) throw new Error(ctx.tag.payload ?? '');
		return '';
	}
}
