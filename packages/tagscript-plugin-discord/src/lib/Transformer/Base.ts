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
 * Transformer for raw Discord API payloads, the objects typed by
 * {@link https://discord-api-types.dev | discord-api-types}.
 *
 * Every subclass answers with a fixed list of keys, so a template can read `{member.displayName}` and has no
 * way to reach a client, a token or a method.
 *
 * @typeParam T - The payload type.
 */
export abstract class BaseTransformer<T extends object> implements ITransformer {
	protected base: T;

	protected safeValues: SafeValues<T> = {};

	public constructor(base: T, safeValues: SafeValues<T> = {}) {
		this.base = base;
		this.safeValues.id = this.resolveId();
		this.safeValues.mention = this.resolveMention();
		this.safeValues.name = 'name' in base ? (base.name as outputResolvable) : '';
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

	/**
	 * The snowflake this payload is identified by. Read as `{thing.id}`.
	 */
	protected abstract resolveId(): string;

	/**
	 * What a bare `{thing}` renders to.
	 */
	protected abstract resolveMention(): string;

	protected updateSafeValues() {
		//
	}
}
