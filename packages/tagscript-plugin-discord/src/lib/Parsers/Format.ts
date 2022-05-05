import { BaseParser, type Context, type IParser } from 'tagscript';

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
