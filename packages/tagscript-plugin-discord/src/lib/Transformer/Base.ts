import type { GuildChannel } from '../interfaces';
import type { Role, User, GuildMember, Guild, CommandInteraction } from 'discord.js';
import type { Lexer, ITransformer } from 'tagscript';

export type outputResolvable = boolean | number | string | null | undefined;

/**
 * A key value pair without sensitive information.
 *
 * @typeParam T - The base type.
 */
export interface SafeValues<T> {
	[key: string]: outputResolvable | ((base: T) => outputResolvable);
}

/**
 * Transformer for {@link https://discord.js.org | discord.js} objects.
 *
 * @typeParam T - The base type.
 */
export abstract class BaseTransformer<T extends CommandInteraction | Guild | GuildChannel | GuildMember | Role | User> implements ITransformer {
	protected base: T;

	protected safeValues: SafeValues<T> = {};

	public constructor(base: T, safeValues: SafeValues<T> = {}) {
		this.base = base;
		this.safeValues.id = this.base.id;
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
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

	public toJSON() {
		return this.safeValues;
	}

	protected updateSafeValues() {
		//
	}
}
