import type { Lexer, ITransformer } from 'tagscript';
import type { GuildTextBasedChannel, Role, User, GuildMember, Guild } from 'discord.js';

export type outputResolvable = string | number | boolean | null | undefined;

export interface SafeValues<T> {
	[key: string]: outputResolvable | ((base: T) => outputResolvable);
}

/**
 * Transformer for {@link https://discord.js.org/#/ Discord.js} objects.
 */
export abstract class BaseTransformer<T extends GuildTextBasedChannel | Role | User | GuildMember | Guild> implements ITransformer {
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
