import { StringTransformer } from '../Transformer';
import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 *  Variables are useful for choosing a value and referencing it later in a tag.
 *  Variables can be referenced using brackets as any other tag.
 *  @usage
 *  ```yaml
 *     {=(name):value}
 *  ```
 *  @alias  assign, let, var
 *  @example
 *  ```yaml
 *     {=(prefix):!}
 *     The prefix here is `{prefix}`.
 * 	```
 */
export class DefineParser extends BaseParser implements IParser {
	public constructor() {
		super(['=', 'assign', 'let', 'var'], true);
	}

	public parse(ctx: Context) {
		ctx.response.variables[ctx.tag.parameter!] = new StringTransformer(ctx.tag.payload!);
		return '';
	}
}
