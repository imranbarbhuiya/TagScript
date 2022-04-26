import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class CooldownParser extends BaseParser implements IParser {
	public constructor() {
		super(['cooldown', 'cd'], true);
	}

	public parse(ctx: Context) {
		const { parameter, payload } = ctx.tag;
		const cooldown = parseInt(parameter!, 10);

		ctx.response.keyValues.cooldown = {
			cooldown,
			message: payload,
		};
		return '';
	}
}
