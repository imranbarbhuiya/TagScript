import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class UrlEncodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urlencode', 'encodeuri'], false, true);
	}

	public parse(ctx: Context) {
		return encodeURI(ctx.tag.payload!);
	}
}
