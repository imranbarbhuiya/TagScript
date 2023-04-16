import { BaseParser, type Context, type IParser } from 'tagscript';

/**
 * Delete the triggered message.
 *
 * @see Devs need to check for this property in [Response.actions](https://tagscript.js.org/typedoc-api/tagscript/classes/Response#actions) and if true, delete the message.
 */
export class DeleteParser extends BaseParser implements IParser {
	public constructor() {
		super(['delete', 'del']);
	}

	public parse(ctx: Context) {
		ctx.response.actions.deleteMessage = true;

		return '';
	}
}
