import { BaseTransformer } from './Base';

import type { GuildChannel } from '../interfaces';

/**
 * Transformer for Discord {@link GuildChannel}
 *
 * Properties:
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
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { ChannelTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('channel: {channel}', { channel: new ChannelTransformer(message.channel) });
 * // channel: <#870354581115256852>
 * ```
 */
export class ChannelTransformer extends BaseTransformer<GuildChannel> {
	protected override updateSafeValues() {
		this.safeValues.topic = 'topic' in this.base ? this.base.topic : '';
		this.safeValues.type = this.base.type;
		this.safeValues.position = 'position' in this.base ? this.base.position : 0;
		this.safeValues.nsfw = 'nsfw' in this.base ? this.base.nsfw : this.base.parent && 'nsfw' in this.base.parent ? this.base.parent.nsfw : false;
		this.safeValues.parentId = this.base.parentId;
		this.safeValues.parentName = this.base.parent?.name ?? '';
		this.safeValues.parentType = this.base.parent?.type ?? '';
		this.safeValues.parentPosition = this.base.parent?.position ?? 0;
		this.safeValues.createdAt = this.base.createdAt?.toISOString() ?? '';
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.slowmode = 'rateLimitPerUser' in this.base ? this.base.rateLimitPerUser : 0;
	}
}
