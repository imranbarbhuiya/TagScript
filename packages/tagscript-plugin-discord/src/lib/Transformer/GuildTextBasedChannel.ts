import type { GuildTextBasedChannel } from 'discord.js';
import { BaseTransformer } from './Base';

/**
 * Transformer for Discord {@link GuildTextBasedChannel}
 *
 * @properties
 * ```yaml
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
export class ChannelTransformer extends BaseTransformer<GuildTextBasedChannel> {
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
