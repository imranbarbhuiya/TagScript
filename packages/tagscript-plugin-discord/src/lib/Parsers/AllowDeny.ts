import { BaseParser, type IParser, type Context } from 'tagscript';
/**
 * The require tag will attempt to convert the given parameter into a channel, user
 * or role, using name or Id. If the user running the tag is not in the targeted
 * channel or doesn't have the targeted role or their id isn't same as targeted user's id, the tag will stop processing and
 * it will send the response if one is given. Multiple role, user or channel
 * requirements can be given, and should be split by a `,`.
 *
 * Aliases: allowlist, whitelist
 *
 * @example
 * ```yaml
 * {require(user,role,channel):response}
 * ```
 * @example
 * ```yaml
 * {require(Moderator)}
 * {require(#general, #bot-commands):This tag can only be run in #general and #bot-cmds.}
 * {require(757425366209134764, 668713062186090506, 737961895356792882):You aren't allowed to use this tag.}
 * ```
 *
 * Developers need to add the check themselves.
 * @example
 * ```ts
 * const { Interpreter } = require("tagscript")
 * const { RequiredParser } = require("tagscript-plugin-discord")
 *
 * const ts = new Interpreter(new RequiredParser())
 *
 * const result = await ts.run("{require(id1, id2):You aren't allowed to use this tag.}")
 *
 * if (!result.actions.require.ids.includes(interaction.user.id)) {
 * // add channel, role check here or check using name instead of id
 * return interaction.reply(result.actions.require.message)
 * }
 *
 * ```
 */
export class RequiredParser extends BaseParser implements IParser {
	public constructor() {
		super(['require', 'allowlist', 'whitelist'], true);
	}

	public parse(ctx: Context) {
		if (ctx.response.actions.require) return null;
		const ids = ctx.tag.parameter!.split(',').map((param) => param.trim());
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
 * @example
 * ```yaml
 * {deny(user,role,channel):response}
 * ```
 * Aliases: denylist, blacklist
 * @example
 * ```yaml
 * {deny(Moderator)}
 * {deny(#general, #chat):This tag can't be run in #general and #chat.}
 * {deny(757425366209134764, 668713062186090506, 737961895356792882):You aren't allowed to use this tag.}
 * ```
 *
 * Developers need to add the check themselves.
 * @example
 * ```ts
 * const { Interpreter } = require("tagscript")
 * const { DenyParser } = require("tagscript-plugin-discord")
 *
 * const ts = new Interpreter(new DenyParser())
 *
 * const result = await ts.run("{require(id1, id2):You aren't allowed to use this tag.}")
 *
 * if (result.actions.deny.ids.includes(interaction.user.id)) {
 * // add channel, role check here or check using name instead of id
 * return interaction.reply(result.actions.deny.message)
 * }
 * ```
 */

export class DenyParser extends BaseParser implements IParser {
	public constructor() {
		super(['denylist', 'deny', 'blacklist'], true);
	}

	public parse(ctx: Context) {
		if (ctx.response.actions.deny) return null;
		const ids = ctx.tag.parameter!.split(',').map((param) => param.trim());
		ctx.response.actions.deny = { ids, message: ctx.tag.payload };
		return '';
	}
}
