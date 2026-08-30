import { BaseTransformer } from './Base';

import { snowflakeDate, snowflakeTimestamp } from '../Utils/snowflake';

import type { GuildChannel } from '../interfaces';

/**
 * The fields only some channel types carry. Reading them off one type covers every channel a guild can hold.
 */
type OptionalChannelFields = Partial<{
	nsfw: boolean;
	parent_id: string | null;
	position: number;
	rate_limit_per_user: number;
	topic: string | null;
}>;

/**
 * Transformer for a Discord {@link GuildChannel} payload.
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
 * createdAt: Gives channel create date.
 * createdTimestamp: Gives channel create date in ms.
 * slowmode: Gives channel slowmode.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 *
 * A channel payload carries `parentId` and nothing else about the category, so pass the category yourself if
 * a template needs its name: `new ChannelTransformer(channel, { parentName: parent.name })`.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { ChannelTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('channel: {channel}', { channel: new ChannelTransformer(channel) });
 * // channel: <#870354581115256852>
 * ```
 */
export class ChannelTransformer extends BaseTransformer<GuildChannel> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return `<#${this.base.id}>`;
	}

	protected override updateSafeValues() {
		const channel = this.base as GuildChannel & OptionalChannelFields;

		this.safeValues.topic = channel.topic ?? '';
		this.safeValues.type = channel.type;
		this.safeValues.position = channel.position ?? 0;
		this.safeValues.nsfw = channel.nsfw ?? false;
		this.safeValues.parentId = channel.parent_id ?? null;
		this.safeValues.createdAt = snowflakeDate(channel.id);
		this.safeValues.createdTimestamp = snowflakeTimestamp(channel.id);
		this.safeValues.slowmode = channel.rate_limit_per_user ?? 0;
	}
}
