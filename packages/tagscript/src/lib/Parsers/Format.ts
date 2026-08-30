import { BaseParser } from './Base';

import { escapeContent } from '../Utils/Util';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * This tag formats a given string.
 *
 * @example
 * ```yaml
 * {lower:Hello Parbez!}
 * # hello parbez!
 * {upper:Hello Parbez!}
 * # HELLO PARBEZ!
 * {capitalize:hello parbez!}
 * # Hello parbez!
 * {escape:Hello| Parbez!}
 * # Hello\\| Parbez!
 * ```
 */
export class StringFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['lower', 'upper', 'capitalize', 'escape'], false, true);
	}

	public parse(ctx: Context) {
		const { declaration, payload } = ctx.tag;
		switch (declaration!.toLowerCase() as 'capitalize' | 'escape' | 'lower' | 'upper') {
			case 'lower':
				return payload!.toLowerCase();
			case 'upper':
				return payload!.toUpperCase();
			case 'capitalize':
				return payload!.charAt(0).toUpperCase() + payload!.slice(1).toLowerCase();
			case 'escape':
				return escapeContent(payload!);
		}
	}
}

export class OrdinalFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['ordinal', 'ord'], false, true);
	}

	public parse(ctx: Context) {
		const { payload } = ctx.tag;
		const value = Number(payload);
		if (Number.isNaN(value)) return payload;

		// 11, 12 and 13 take "th" even though they end in 1, 2 and 3.
		const teens = Math.abs(value) % 100;
		if (teens >= 11 && teens <= 13) return `${payload}th`;

		const lastDigit = Math.abs(value) % 10;
		const suffix = lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th';
		return `${payload}${suffix}`;
	}
}
