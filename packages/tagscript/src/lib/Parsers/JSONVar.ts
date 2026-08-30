import { BaseParser } from './Base';

import { TemplateError } from '../Errors';
import { SafeObjectTransformer } from '../Transformer';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 *  JSON is useful when using fetch. You can get all the properties of a JSON object using parameters.
 *
 *  @example
 * ```yaml
 * {json(name):value}
 * ```
 *  @example
 * ```yaml
 * {json(data):{"name": "John Doe", "age": 30}}
 * Your age is `{data.age}`.
 * ```
 */
export class JSONVarParser extends BaseParser implements IParser {
	public constructor() {
		super(['json'], true, true);
	}

	public parse(ctx: Context) {
		try {
			ctx.response.variables[ctx.tag.parameter!] = new SafeObjectTransformer(ctx.tag.payload!);
		} catch {
			throw new TemplateError(`json was given something that is not valid JSON`, ctx.tag.declaration);
		}

		return '';
	}
}
