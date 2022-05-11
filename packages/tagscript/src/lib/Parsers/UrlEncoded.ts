import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * This tag will encode a given string into a properly formatted url
 * with non-url compliant characters replaced. Using `+` as the parameter
 * will replace spaces with `+` rather than `%20`.
 *
 * @alias encodeuri
 *
 * @usage
 * ```yaml
 * {urlencode:Hello World}
 * ```
 */
export class UrlEncodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urlencode', 'encodeuri'], false, true);
	}

	public parse(ctx: Context) {
		return ctx.tag.parameter === '+' ? encodeURI(ctx.tag.payload!.replace(/ +/g, ctx.tag.parameter)) : encodeURI(ctx.tag.payload!);
	}
}

/**
 * This tag will decode a given url into a string
 * with non-url compliant characters replaced.
 * Using `+` as the parameter will replace `+` with space.
 *
 * @usage
 * ```yaml
 * {urldecode:Hello%20World}
 * ```
 *
 */
export class UrlDecodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urldecode'], false, true);
	}

	public parse(ctx: Context) {
		return ctx.tag.parameter === '+' ? decodeURI(ctx.tag.payload!.replaceAll(ctx.tag.parameter, ' ')) : decodeURI(ctx.tag.payload!);
	}
}
