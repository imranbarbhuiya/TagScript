import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * Delete the triggered message.
 *
 * @note Devs need to check for this property in {@link Response#actions} and if true, delete the message.
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
