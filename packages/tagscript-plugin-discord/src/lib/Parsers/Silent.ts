import { BaseParser, type Context, type IParser } from 'tagscript';

/**
 * Silence the used command outputs.
 *
 * @see Devs need to check for this property in [Response.actions](https://tagscript.js.org/typedoc-api/tagscript/classes/Response#actions) and if true, don't output of the command used.
 */
export class SilentParser extends BaseParser implements IParser {
	public constructor() {
		super(['silent']);
	}

	public parse(ctx: Context) {
		ctx.response.actions.silentResponse = true;

		return '';
	}
}
