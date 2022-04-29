import type { ITransformer } from '../interfaces';
import type { GuildTextBasedChannel, Role, User, GuildMember, Guild } from 'discord.js';
import type { Lexer } from '../Interpreter';

type outputResolvable = string | number | boolean | null | undefined;

interface SafeValues<T> {
	[key: string]: outputResolvable | ((base: T) => outputResolvable);
}

export abstract class DiscordJsBaseTransformer<T extends GuildTextBasedChannel | Role | User | GuildMember | Guild>
	implements ITransformer
{
	protected base: T;
	protected safeValues: SafeValues<T>;

	public constructor(base: T, safeValues: SafeValues<T> = {}) {
		this.base = base;
		this.safeValues = safeValues;
		this.safeValues.id = this.base.id;
		this.safeValues.mention = base.toString();
		this.safeValues.name = 'name' in base ? base.name : '';
		this.updateSafeValues();
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

export class MemberTransformer extends DiscordJsBaseTransformer<GuildMember> {
	protected override updateSafeValues() {
		this.safeValues.username = this.base.user.username;
		this.safeValues.discriminator = this.base.user.discriminator;
		this.safeValues.tag = this.base.user.tag;
		this.safeValues.avatar = this.base.avatarURL();
		this.safeValues.displayAvatar = this.base.displayAvatarURL();
		this.safeValues.nickname = this.base.nickname;
		this.safeValues.joinedAt = this.base.joinedAt?.toISOString() ?? '';
		this.safeValues.joinedTimestamp = this.base.joinedTimestamp;
		this.safeValues.color = this.base.roles.color?.hexColor ?? '';
		this.safeValues.position = this.base.roles.highest.position;
		this.safeValues.roles = this.base.roles.cache.map((role) => role).join(' ') || '`None`';
		this.safeValues.roleIds = this.base.roles.cache.map((role) => role.id).join(', ') || '`None`';
		this.safeValues.roleNames = this.base.roles.cache.map((role) => role.name).join(', ') || '`None`';
		this.safeValues.topRole = this.base.roles.highest.name;
	}
}

export class UserTransformer extends DiscordJsBaseTransformer<User> {
	protected override updateSafeValues() {
		this.safeValues.username = this.base.username;
		this.safeValues.discriminator = this.base.discriminator;
		this.safeValues.tag = this.base.tag;
		this.safeValues.avatar = this.base.avatarURL();
		this.safeValues.displayAvatar = this.base.displayAvatarURL();
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
	}
}

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

export class RoleTransformer extends DiscordJsBaseTransformer<Role> {
	protected override updateSafeValues() {
		this.safeValues.name = this.base.name;
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
