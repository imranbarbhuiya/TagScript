import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class UrlEncodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urlencode', 'encodeuri'], false, true);
	}

	public process(ctx: Context) {
		return encodeURI(ctx.tag.payload!);
	}
}
