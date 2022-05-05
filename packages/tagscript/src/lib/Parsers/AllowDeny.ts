import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';

/**
 * The require tag will attempt to convert the given parameter into a channel, user
 * or role, using name or Id. If the user running the tag is not in the targeted
 * channel or doesn't have the targeted role or their id isn't same as targeted user's id, the tag will stop processing and
 * it will send the response if one is given. Multiple role, user or channel
 * requirements can be given, and should be split by a `,`.
 *
 * @usage
 * ```yaml
 * {require(user,role,channel):response}
 * ```
 *
 * @alias allowlist, whitelist
 *
 * @example
 * ```yaml
 * {require(Moderator)}
 * {require(#general, #bot-commands):This tag can only be run in #general and #bot-cmds.}
 * {require(757425366209134764, 668713062186090506, 737961895356792882):You aren't allowed to use this tag.}
 * ```
 */
export class RequiredParser extends BaseParser implements IParser {
	public constructor() {
		super(['require', 'allowlist', 'whitelist'], true);
	}

	public parse(ctx: Context) {
		if (ctx.response.actions.require) return null;
		const ids = ctx.tag.parameter!.split(',').map((s) => s.trim());
		ctx.response.actions.require = { ids, message: ctx.tag.payload };
		return '';
	}
}

/**
 * The blacklist tag will attempt to convert the given parameter into a channel,
 * role, or user using name or Id. If the user running the tag is in the targeted
 * channel or has the targeted role or their id isn't same as targeted user's id, the tag will stop processing and
 * it will send the response if one is given. Multiple user, role or channel
 * requirements can be given, and should be split by a `,`.
 *
 * @usage
 * ```yaml
 * {deny(user,role,channel):response}
 * ```
 *
 * @alias denylist, blacklist
 *
 * @example
 * ```yaml
 *    {deny(Moderator)}
 *    {deny(#general, #chat):This tag can't be run in #general and #chat.}
 *    {deny(757425366209134764, 668713062186090506, 737961895356792882):You aren't allowed to use this tag.}
 */

export class DenyParser extends BaseParser implements IParser {
	public constructor() {
		super(['denylist', 'deny', 'blacklist'], true);
	}

	public parse(ctx: Context) {
		if (ctx.response.actions.deny) return null;
		const ids = ctx.tag.parameter!.split(',').map((s) => s.trim());
		ctx.response.actions.deny = { ids, message: ctx.tag.payload };
		return '';
	}
}
