import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class DeleteParser extends BaseParser implements IParser {
	public constructor() {
		super(['delete', 'del']);
	}

	public parse(ctx: Context) {
		ctx.response.actions.delete = true;

		return '';
	}
}
