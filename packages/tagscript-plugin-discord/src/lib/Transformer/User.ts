import { BaseTransformer } from './Base';

import type { User } from 'discord.js';

/**
 * Transformer for  Discord {@link User}.
 *
 * Properties:
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
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 * @example
 * ```ts
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { UserTransformer } from 'tagscript-plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('Hi {user}', { user: new UserTransformer(message.author) });
 * // Hi <@758880890159235083>
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
