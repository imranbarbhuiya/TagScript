import { BaseParser } from './Base';

import { TemplateError } from '../Errors';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 *
 * Decodes a url written by a template author.
 *
 * `decodeURI` throws a `URIError` on a malformed escape such as `%zz`, which is the template
 * author's mistake rather than a bug, so it is reported as a {@link TemplateError}.
 *
 * @param value - The url the template author wrote.
 * @param tag - The declaration to attribute the error to.
 * @returns
 */
const decode = (value: string, tag: string | null) => {
	try {
		return decodeURI(value);
	} catch {
		throw new TemplateError('urldecode was given a url it cannot decode', tag);
	}
};

/**
 * This tag will encode a given string into a properly formatted url
 * with non-url compliant characters replaced. Using `+` as the parameter
 * will replace spaces with `+` rather than `%20`.
 *
 * Aliases: - encodeuri
 *
 * @example
 * ```tagscript
 * {urlencode:Hello World}
 * ```
 */
export class UrlEncodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urlencode', 'encodeuri'], false, true);
	}

	public parse(ctx: Context) {
		return ctx.tag.parameter === '+'
			? encodeURI(ctx.tag.payload!.replaceAll(/ +/g, ctx.tag.parameter))
			: encodeURI(ctx.tag.payload!);
	}
}

/**
 * This tag will decode a given url into a string
 * with non-url compliant characters replaced.
 * Using `+` as the parameter will replace `+` with space.
 *
 * @example
 * ```tagscript
 * {urldecode:Hello%20World}
 * ```
 */
export class UrlDecodeParser extends BaseParser implements IParser {
	public constructor() {
		super(['urldecode'], false, true);
	}

	public parse(ctx: Context) {
		return ctx.tag.parameter === '+'
			? decode(ctx.tag.payload!.replaceAll(ctx.tag.parameter, ' '), ctx.tag.declaration)
			: decode(ctx.tag.payload!, ctx.tag.declaration);
	}
}
