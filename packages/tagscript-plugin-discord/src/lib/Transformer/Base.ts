import type { Lexer, ITransformer } from 'tagscript';
import type { Role, User, GuildMember, Guild, CommandInteraction } from 'discord.js';
import { GuildChannel } from '../interfaces';

export type outputResolvable = string | number | boolean | null | undefined;

export interface SafeValues<T> {
	[key: string]: outputResolvable | ((base: T) => outputResolvable);
}

/**
 * Transformer for [Discord.js](https://discord.js.org/) objects.
 */
export abstract class BaseTransformer<T extends GuildChannel | Role | User | GuildMember | Guild | CommandInteraction> implements ITransformer {
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
