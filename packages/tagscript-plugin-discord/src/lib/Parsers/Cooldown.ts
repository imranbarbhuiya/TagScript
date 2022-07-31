import { BaseParser, type Context, type IParser } from 'tagscript';

/**
 *  The cooldown tag implements cooldowns when running a tag.
 *  The parameter is the number of seconds to wait before running the tag again.
 *  The payload is the optional cooldown message to send if the tag is on cooldown.
 *  Payload can have `{retryAfter}`, `{name}` which will be replaced with the time remaining
 *  and the name of the tag respectively.
 *
 * @usage
 * ```yaml
 * { cooldown(seconds): response }
 * ```
 *
 * @alias cd
 *
 * @example
 * ```yaml
 * { cooldown(5): This tag is on cooldown. }
 * { cooldown(5): The tag {name} is on cooldown. Please try again in {retryAfter}. }
 * ```
 *
 */
export class CooldownParser extends BaseParser implements IParser {
	public constructor() {
		super(['cooldown', 'cd'], true);
	}

	public parse(ctx: Context) {
		const { parameter, payload } = ctx.tag;
		const cooldown = parseInt(parameter!, 10);

		ctx.response.actions.cooldown = {
			cooldown,
			message: payload
		};
		return '';
	}
}
