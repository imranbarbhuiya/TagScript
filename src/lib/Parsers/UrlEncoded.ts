import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class UrlEncodeParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['urlencode'];

	public process(ctx: Context) {
		return encodeURI(ctx.token.payload ?? '');
	}
}
