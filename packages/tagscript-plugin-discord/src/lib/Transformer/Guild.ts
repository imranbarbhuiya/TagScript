import { BaseTransformer } from './Base';

import { guildBannerURL, guildIconURL, guildSplashURL } from '../Utils/cdn';
import { snowflakeDate, snowflakeTimestamp } from '../Utils/snowflake';

import type { APIGuild } from 'discord-api-types/v10';

/**
 * Transformer for a Discord {@link APIGuild} payload.
 *
 * Properties:
 * ```yaml
 * id: Gives guild id.
 * name: Gives guild name.
 * description: Gives guild description.
 * icon: Gives guild icon.
 * splash: Gives guild splash.
 * banner: Gives guild banner.
 * features: Gives guild features.
 * ownerId: Gives guild owner id.
 * createdAt: Gives guild create date.
 * createdTimestamp: Gives guild create date in ms.
 * memberCount: Gives guild member count, when the payload was fetched with counts.
 * roles: Mentions each guild role.
 * roleIds: Gives guild roles ids.
 * roleNames: Gives guild roles names.
 * roleCount: Gives guild roles count.
 * emojiCount: Gives guild emojis count.
 * stickerCount: Gives guild stickers count.
 * afkTimeout: Gives guild afk timeout.
 * afkChannel: Mentions the guild afk channel.
 * verificationLevel: Gives guild verification level.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 *
 * `memberCount` reads `approximate_member_count`, which Discord only sends when you ask for it with
 * `with_counts`. Channels are a separate endpoint and are not part of a guild payload, so pass counts you
 * want a template to see: `new GuildTransformer(guild, { channelCount: channels.length })`.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { GuildTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('server name: {guild.name}', { guild: new GuildTransformer(guild) });
 * // server name: My Server
 * ```
 */
export class GuildTransformer extends BaseTransformer<APIGuild> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return this.base.name;
	}

	protected override updateSafeValues() {
		this.safeValues.description = this.base.description;
		this.safeValues.icon = this.base.icon ? guildIconURL(this.base.id, this.base.icon) : '';
		this.safeValues.splash = this.base.splash ? guildSplashURL(this.base.id, this.base.splash) : '';
		this.safeValues.banner = this.base.banner ? guildBannerURL(this.base.id, this.base.banner) : '';
		this.safeValues.features = this.base.features.join(' ') || '`None`';
		this.safeValues.ownerId = this.base.owner_id;
		this.safeValues.createdAt = snowflakeDate(this.base.id);
		this.safeValues.createdTimestamp = snowflakeTimestamp(this.base.id);
		this.safeValues.memberCount = this.base.approximate_member_count ?? '';
		this.safeValues.roles = this.base.roles.map((role) => `<@&${role.id}>`).join(' ');
		this.safeValues.roleIds = this.base.roles.map((role) => role.id).join(', ');
		this.safeValues.roleNames = this.base.roles.map((role) => role.name).join(', ');
		this.safeValues.roleCount = this.base.roles.length;
		this.safeValues.emojiCount = this.base.emojis.length;
		this.safeValues.stickerCount = this.base.stickers?.length ?? 0;
		this.safeValues.afkTimeout = this.base.afk_timeout;
		this.safeValues.afkChannel = this.base.afk_channel_id ? `<#${this.base.afk_channel_id}>` : '';
		this.safeValues.verificationLevel = this.base.verification_level;
	}
}
