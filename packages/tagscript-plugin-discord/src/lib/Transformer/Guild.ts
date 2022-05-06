import type { Guild } from 'discord.js';
import { BaseTransformer } from './Base';

/**
 * Transformer for Discord {@link https://discord.js.org/#/docs/discord.js/stable/class/Guild Guild}
 *
 * @properties
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
 * large: Gives true if the guild is large else false.
 * memberCount: Gives guild member count.
 * random: Gives random guild member.
 * roles: Gives guild roles.
 * roleIds: Gives guild roles ids.
 * roleNames: Gives guild roles names.
 * roleCount: Gives guild roles count.
 * channels: Gives guild channels.
 * channelIds: Gives guild channels ids.
 * channelNames: Gives guild channels names.
 * channelCount: Gives guild channels count.
 * emojiCount: Gives guild emojis count. (These values depends on cache so it might be inaccurate)
 * stickerCount: Gives guild stickers count. (These values depends on cache so it might be inaccurate)
 * bots: Gives guild bots count. (These values depends on cache so it might be inaccurate)
 * humans: Gives guild humans count. (These values depends on cache so it might be inaccurate)
 * afkTimeout: Gives guild afk timeout.
 * afkChannel: Gives guild afk channel.
 * verificationLevel: Gives guild verification level.
 * ```
 */
export class GuildTransformer extends BaseTransformer<Guild> {
	protected override updateSafeValues() {
		this.safeValues.description = this.base.description;
		this.safeValues.icon = this.base.iconURL();
		this.safeValues.splash = this.base.splashURL();
		this.safeValues.banner = this.base.bannerURL();
		this.safeValues.features = this.base.features.join(' ') || '`None`';
		this.safeValues.ownerId = this.base.ownerId;
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.large = this.base.large;
		this.safeValues.memberCount = this.base.memberCount;
		this.safeValues.random = this.base.members.cache.random()?.toString() ?? '';
		this.safeValues.roles = this.base.roles.cache.map((role) => role).join(' ') || '`None`';
		this.safeValues.roleIds = this.base.roles.cache.map((role) => role.id).join(', ') || '`None`';
		this.safeValues.roleNames = this.base.roles.cache.map((role) => role.name).join(', ') || '`None`';
		this.safeValues.roleCount = this.base.roles.cache.size;
		this.safeValues.channels = this.base.channels.cache.map((channel) => channel).join(' ') || '`None`';
		this.safeValues.channelIds = this.base.channels.cache.map((channel) => channel.id).join(', ') || '`None`';
		this.safeValues.channelNames = this.base.channels.cache.map((channel) => channel.name).join(', ') || '`None`';
		this.safeValues.channelCount = this.base.channels.cache.size;
		this.safeValues.emojiCount = this.base.emojis.cache.size;
		this.safeValues.stickerCount = this.base.stickers.cache.size;
		this.safeValues.bots = this.base.members.cache.filter((m) => m.user.bot).size;
		this.safeValues.humans = this.base.members.cache.filter((m) => !m.user.bot).size;
		this.safeValues.afkTimeout = this.base.afkTimeout;
		this.safeValues.afkChannel = `${this.base.afkChannel}`;
		this.safeValues.verificationLevel = this.base.verificationLevel;
	}
}
