import type { User } from 'discord.js';
import { BaseTransformer } from './Base';

/**
 * Transformer for {@link https://discord.js.org/#/docs/discord.js/stable/class/User User}
 *
 * @properties
 * ```yaml
 * id: Gives user id.
 * mention: Mentions the user.
 * username: Gives username of the user.
 * discriminator: Gives discriminator of the user
 * tag: Gives username#discriminator
 * avatar: Gives user's custom avatar if they have one. Else it'll be an empty string.
 * displayAvatar: Gives user's avatar URL if they have one else gives user's default avatar.
 * createdAt: Gives user's account create date.
 * createdTimestamp: Gives user's account created date in ms
 * bot: Gives true if the user is a bot else false.
 * ```
 */
export class UserTransformer extends BaseTransformer<User> {
	protected override updateSafeValues() {
		this.safeValues.username = this.base.username;
		this.safeValues.discriminator = this.base.discriminator;
		this.safeValues.tag = this.base.tag;
		this.safeValues.avatar = this.base.avatarURL();
		this.safeValues.displayAvatar = this.base.displayAvatarURL();
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.bot = this.base.bot;
	}
}
