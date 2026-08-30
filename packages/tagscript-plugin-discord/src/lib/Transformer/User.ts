import { BaseTransformer } from './Base';

import { defaultUserAvatarURL, userAvatarURL } from '../Utils/cdn';
import { snowflakeDate, snowflakeTimestamp } from '../Utils/snowflake';

import type { APIUser } from 'discord-api-types/v10';

/**
 * Transformer for a Discord {@link APIUser} payload.
 *
 * Properties:
 * ```yaml
 * id: Gives user id.
 * mention: Mentions the user.
 * globalName: Gives user's global name.
 * username: Gives username of the user.
 * discriminator: Gives discriminator of the user
 * tag: Gives username#discriminator for legacy accounts, username otherwise.
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
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { UserTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('Hi {user}', { user: new UserTransformer(user) });
 * // Hi <@758880890159235083>
 * ```
 */
export class UserTransformer extends BaseTransformer<APIUser> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return `<@${this.base.id}>`;
	}

	protected override updateSafeValues() {
		this.safeValues.globalName = this.base.global_name;
		this.safeValues.username = this.base.username;
		this.safeValues.discriminator = this.base.discriminator;
		this.safeValues.tag =
			this.base.discriminator === '0' ? this.base.username : `${this.base.username}#${this.base.discriminator}`;
		this.safeValues.avatar = this.base.avatar ? userAvatarURL(this.base.id, this.base.avatar) : '';
		this.safeValues.displayAvatar = this.safeValues.avatar || defaultUserAvatarURL(this.base.id);
		this.safeValues.createdAt = snowflakeDate(this.base.id);
		this.safeValues.createdTimestamp = snowflakeTimestamp(this.base.id);
		this.safeValues.bot = this.base.bot ?? false;
	}
}
