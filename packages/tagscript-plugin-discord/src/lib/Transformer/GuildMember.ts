import type { GuildMember } from 'discord.js';
import { BaseTransformer } from './Base';

/**
 * Transformer for [GuildMember](https://discord.js.org/#/docs/discord.js/stable/class/GuildMember).
 *
 * @properties
 * ```yaml
 * id: Gives member id.
 * mention: Mentions the member.
 * username: Gives username of the member.
 * discriminator: Gives discriminator of the member
 * tag: Gives username#discriminator
 * avatar: Gives member's custom avatar if they have one. Else it'll be an empty string.
 * displayAvatar: Gives member's avatar URL if they have one else gives member's default avatar.
 * nickname: Gives member's nickname.
 * displayName: Gives member's display name. (nickname if they have one else username)
 * joinedAt: Gives member's join date.
 * joinedTimestamp: Gives member's join date in ms
 * createdAt: Gives member's account create date.
 * createdTimestamp: Gives member's account created date in ms
 * bot: Gives true if the member is a bot else false.
 * color: Gives member's highest role color.
 * position: Gives member's highest role position.
 * roles: Gives member's roles.
 * roleIds: Gives member's roles ids.
 * roleNames: Gives member's roles names.
 * topRole: Gives member's highest role name.
 * timeoutUntil: Gives member's timeout until date.
 * timeoutUntilTimestamp: Gives member's timeout until date in ms.
 * ```
 */
export class MemberTransformer extends BaseTransformer<GuildMember> {
	protected override updateSafeValues() {
		this.safeValues.username = this.base.user.username;
		this.safeValues.discriminator = this.base.user.discriminator;
		this.safeValues.tag = this.base.user.tag;
		this.safeValues.avatar = this.base.avatarURL();
		this.safeValues.displayAvatar = this.base.displayAvatarURL();
		this.safeValues.nickname = this.base.nickname;
		this.safeValues.displayName = this.base.displayName;
		this.safeValues.joinedAt = this.base.joinedAt?.toISOString() ?? '';
		this.safeValues.joinedTimestamp = this.base.joinedTimestamp;
		this.safeValues.createdAt = this.base.user.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.user.createdTimestamp;
		this.safeValues.bot = this.base.user.bot;
		this.safeValues.color = this.base.roles.color?.hexColor ?? '';
		this.safeValues.position = this.base.roles.highest.position;
		this.safeValues.roles = this.base.roles.cache.map((role) => role).join(' ');
		this.safeValues.roleIds = this.base.roles.cache.map((role) => role.id).join(', ');
		this.safeValues.roleNames = this.base.roles.cache.map((role) => role.name).join(', ');
		this.safeValues.topRole = this.base.roles.highest.name;
		this.safeValues.timeoutUntil = this.base.communicationDisabledUntil?.toISOString() ?? '';
		this.safeValues.timeoutUntilTimestamp = this.base.communicationDisabledUntilTimestamp;
	}
}
