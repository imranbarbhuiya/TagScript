import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { escapeContent } from '../Utils/Util';
import { BaseParser } from './Base';

export class StringFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['lower', 'upper', 'capitalize', 'escape'], false, true);
	}

	public parse(ctx: Context) {
		const { declaration, payload } = ctx.tag;
		switch (declaration) {
			case 'lower':
				return payload!.toLowerCase();
			case 'upper':
				return payload!.toUpperCase();
			case 'capitalize':
				return payload!.charAt(0).toUpperCase() + payload!.slice(1);
			case 'escape':
				return escapeContent(payload!);
			default:
				return payload!;
		}
	}
}

// This is a discord specific formatter
export class DateFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['date', 'unix', 'currentTime'], false, true);
	}

	public parse(ctx: Context) {
		const { declaration } = ctx.tag;
		if (['unix', 'currentTime'].includes(declaration!)) {
			return Date.now().toString();
		}
		const parameter = ctx.tag.parameter ?? 'f';
		let payload: string | number = ctx.tag.payload!;
		if (!/^\d+$/.test(payload)) {
			payload = new Date(payload).getTime().toString();
		}
		if (payload.length > 10) payload = Math.floor(Number(payload) / 1000);

		return `<t:${payload}:${parameter}>`;
	}
}
