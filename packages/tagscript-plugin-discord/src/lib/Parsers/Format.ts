import { BaseParser, type Context, type IParser } from 'tagscript';

export class DateFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['date', 'unix', 'currenttime']);
	}

	public parse(ctx: Context) {
		const { declaration } = ctx.tag;
		if (['unix', 'currenttime'].includes(declaration!)) return Date.now().toString();

		const parameter = ctx.tag.parameter ?? 'f';
		if (!['f', 'F', 't', 'T', 'R'].includes(parameter)) return null;
		let payload: number | string = ctx.tag.payload ?? Date.now().toString();
		if (!/^\d+$/.test(payload)) payload = new Date(payload).getTime().toString();

		if (payload.length > 10) payload = Math.floor(Number(payload) / 1_000);

		return `<t:${payload}:${parameter}>`;
	}
}
