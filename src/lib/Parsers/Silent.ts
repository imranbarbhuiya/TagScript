import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class SilentParser extends BaseParser implements IParser {
	public constructor() {
		super(['silent']);
	}

	public parse(ctx: Context) {
		ctx.response.actions.silent = true;

		return '';
	}
}
