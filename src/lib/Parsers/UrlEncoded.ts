import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';

export class UrlEncodeParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['urlencode'];
	protected override requiredPayload = true;

	public process(ctx: Context) {
		return encodeURI(ctx.token.payload!);
	}
}
