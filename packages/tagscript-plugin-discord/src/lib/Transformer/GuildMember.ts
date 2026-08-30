import { BaseTransformer } from './Base';

import { defaultUserAvatarURL, userAvatarURL } from '../Utils/cdn';
import { snowflakeDate, snowflakeTimestamp } from '../Utils/snowflake';

import type { GuildMember } from '../interfaces';

/**
 * Transformer for a Discord {@link GuildMember} payload.
 *
 * Properties:
 * ```yaml
 * id: Gives member id.
 * mention: Mentions the member.
 * username: Gives username of the member.
 * discriminator: Gives discriminator of the member
 * tag: Gives username#discriminator for legacy accounts, username otherwise.
 * avatar: Gives member's custom avatar if they have one. Else it'll be an empty string.
 * displayAvatar: Gives member's avatar URL if they have one else gives member's default avatar.
 * nickname: Gives member's nickname.
 * displayName: Gives member's display name. (nickname, then global name, then username)
 * joinedAt: Gives member's join date.
 * joinedTimestamp: Gives member's join date in ms
 * createdAt: Gives member's account create date.
 * createdTimestamp: Gives member's account created date in ms
 * bot: Gives true if the member is a bot else false.
 * roles: Mentions each of the member's roles.
 * roleIds: Gives member's roles ids.
 * timeoutUntil: Gives member's timeout until date.
 * timeoutUntilTimestamp: Gives member's timeout until date in ms.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 *
 * A member payload carries role ids, not role objects, and no guild id. Role names, the top role, the member
 * colour and the per-guild avatar therefore need the guild alongside the member, so pass them yourself:
 *
 * ```ts showLineNumbers
 * const roles = guild.roles.filter((role) => member.roles.includes(role.id));
 *
 * new MemberTransformer(member, {
 * 	roleNames: roles.map((role) => role.name).join(', '),
 * 	topRole: roles.reduce((highest, role) => (role.position > highest.position ? role : highest)).name,
 * });
 * ```
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { MemberTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('Hi {member}', { member: new MemberTransformer(member) });
 * // Hi <@758880890159235083>
 * ```
 */
export class MemberTransformer extends BaseTransformer<GuildMember> {
	protected resolveId() {
		return this.base.user.id;
	}

	protected resolveMention() {
		return `<@${this.base.user.id}>`;
	}

	protected override updateSafeValues() {
		const { user } = this.base;

		this.safeValues.username = user.username;
		this.safeValues.discriminator = user.discriminator;
		this.safeValues.tag = user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`;
		this.safeValues.avatar = user.avatar ? userAvatarURL(user.id, user.avatar) : '';
		this.safeValues.displayAvatar = this.safeValues.avatar || defaultUserAvatarURL(user.id);
		this.safeValues.nickname = this.base.nick ?? '';
		this.safeValues.displayName = this.base.nick ?? user.global_name ?? user.username;
		this.safeValues.joinedAt = this.base.joined_at ?? '';
		this.safeValues.joinedTimestamp = this.base.joined_at ? Date.parse(this.base.joined_at) : null;
		this.safeValues.createdAt = snowflakeDate(user.id);
		this.safeValues.createdTimestamp = snowflakeTimestamp(user.id);
		this.safeValues.bot = user.bot ?? false;
		this.safeValues.roles = this.base.roles.map((id) => `<@&${id}>`).join(' ');
		this.safeValues.roleIds = this.base.roles.join(', ');
		this.safeValues.timeoutUntil = this.base.communication_disabled_until ?? '';
		this.safeValues.timeoutUntilTimestamp = this.base.communication_disabled_until
			? Date.parse(this.base.communication_disabled_until)
			: null;
	}
}
