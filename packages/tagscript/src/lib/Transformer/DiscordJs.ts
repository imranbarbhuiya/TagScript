import type { ITransformer } from '../interfaces';
import type { GuildTextBasedChannel, Role, User, GuildMember, Guild } from 'discord.js';
import type { Lexer } from '../Interpreter';

export type outputResolvable = string | number | boolean | null | undefined;

export interface SafeValues<T> {
	[key: string]: outputResolvable | ((base: T) => outputResolvable);
}

/**
 * Transformer for Discord.js objects.
 * > These objects will be removed from this package and will be added in a new package.</warn>
 *
 * @abstract
 */
export abstract class DiscordJsBaseTransformer<T extends GuildTextBasedChannel | Role | User | GuildMember | Guild> implements ITransformer {
	protected base: T;
	protected safeValues: SafeValues<T> = {};

	public constructor(base: T, safeValues: SafeValues<T> = {}) {
		this.base = base;
		this.safeValues.id = this.base.id;
		this.safeValues.mention = base.toString();
		this.safeValues.name = 'name' in base ? base.name : '';
		this.updateSafeValues();
		this.safeValues = { ...this.safeValues, ...safeValues };
	}

	public transform(tag: Lexer) {
		if (!tag.parameter) return this.safeValues.mention as string;
		let value = this.safeValues[tag.parameter];

		if (typeof value === 'function') value = value(this.base);
		if (value === undefined) return null;
		return `${value ?? ''}`;
	}

	protected updateSafeValues() {
		//
	}
}

/**
 * Transformer for {@link User}
 *
 * @properties
 * ```
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
export class UserTransformer extends DiscordJsBaseTransformer<User> {
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

/**
 * Transformer for {@link GuildMember}.
 *
 * @properties
 * ```
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
export class MemberTransformer extends DiscordJsBaseTransformer<GuildMember> {
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
		this.safeValues.roles = this.base.roles.cache.map((role) => role).join(' ') || '`None`';
		this.safeValues.roleIds = this.base.roles.cache.map((role) => role.id).join(', ') || '`None`';
		this.safeValues.roleNames = this.base.roles.cache.map((role) => role.name).join(', ') || '`None`';
		this.safeValues.topRole = this.base.roles.highest.name;
		this.safeValues.timeoutUntil = this.base.communicationDisabledUntil?.toISOString() ?? '';
		this.safeValues.timeoutUntilTimestamp = this.base.communicationDisabledUntilTimestamp;
	}
}

/**
 * Transformer for Discord {@link GuildTextBasedChannel}
 *
 * @properties
 * ```
 * id: Gives channel id.
 * mention: Mentions the channel.
 * name: Gives channel name.
 * topic: Gives channel topic.
 * type: Gives channel type.
 * position: Gives channel position.
 * nsfw: Gives true if the channel is nsfw else false.
 * parentId: Gives channel parent id.
 * parentName: Gives channel parent name.
 * parentType: Gives channel parent type.
 * parentPosition: Gives channel parent position.
 * createdAt: Gives channel create date.
 * createdTimestamp: Gives channel create date in ms.
 * slowmode: Gives channel slowmode.
 */
export class ChannelTransformer extends DiscordJsBaseTransformer<GuildTextBasedChannel> {
	protected override updateSafeValues() {
		this.safeValues.topic = 'topic' in this.base ? this.base.topic : '';
		this.safeValues.type = this.base.type;
		this.safeValues.position = 'position' in this.base ? this.base.position : 0;
		this.safeValues.nsfw = 'nsfw' in this.base ? this.base.nsfw : this.base.parent?.nsfw ?? false;
		this.safeValues.parentId = this.base.parentId;
		this.safeValues.parentName = this.base.parent?.name ?? '';
		this.safeValues.parentType = this.base.parent?.type ?? '';
		this.safeValues.parentPosition = this.base.parent?.position ?? 0;
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.slowmode = 'rateLimitPerUser' in this.base ? this.base.rateLimitPerUser : 0;
	}
}

/**
 * Transformer for Discord {@link Guild}
 *
 * @properties
 * ```
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
export class GuildTransformer extends DiscordJsBaseTransformer<Guild> {
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

/**
 * Transformer for Discord {@link Role}
 *
 * @properties
 * ```
 * id: Gives role id.
 * name: Gives role name.
 * mention: Mentions the role.
 * color: Gives role color.
 * hoist: Gives true if the role is hoisted else false.
 * mentionable: Gives true if the role is mentionable else false.
 * position: Gives role position.
 * permissions: Gives role permissions.
 * createdAt: Gives role create date.
 * createdTimestamp: Gives role create date in ms.
 * memberCount: Gives role member count.
 * ```
 */
export class RoleTransformer extends DiscordJsBaseTransformer<Role> {
	protected override updateSafeValues() {
		this.safeValues.color = this.base.color.toString();
		this.safeValues.hoist = this.base.hoist;
		this.safeValues.mentionable = this.base.mentionable;
		this.safeValues.position = this.base.position;
		this.safeValues.permissions = this.base.permissions.toArray().join(', ');
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.memberCount = this.base.members.size;
	}
}
