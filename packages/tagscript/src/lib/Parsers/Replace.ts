import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * The replace tag will replace specific characters in a string.
 * The parameter should split by a `,`, containing the characters to find
 * before the command and the replacements after.
 * 
 * @example
 * ```yaml
* {replace(o,i):welcome to the server}
* # welcime ti the server
* {replace(1,6):{args}}
* # if {args} is 1637812
* # 6637862
* {replace(, ):Test}
* # T e s t
	```
 */
export class ReplaceParser extends BaseParser implements IParser {
	public constructor() {
		super(['replace'], true, true);
	}

	public parse(ctx: Context) {
		const [before, ...rest] = ctx.tag.parameter!.split(',');
		const after = rest.join(',');

		return ctx.tag.payload!.replaceAll(before, after);
	}
}
