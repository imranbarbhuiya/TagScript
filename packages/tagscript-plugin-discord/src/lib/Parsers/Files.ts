import { BaseParser, split, type Context, type IParser } from 'tagscript';

/**
 * This parser allows sending files along with message using file url.
 */
export class FilesParser extends BaseParser implements IParser {
	public constructor() {
		super(['files'], false, true);
	}

	public parse(ctx: Context) {
		ctx.response.actions.files = split(ctx.tag.payload!, true);
		return '';
	}
}
