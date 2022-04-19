import { Adapter } from '../Interpreter';
import { Tokenizer } from '../Tokenizer';

export class SafeObjectAdapter implements Adapter {
	private obj: { [key: string]: unknown };
	public constructor(ojb: { [key: string]: unknown }) {
		this.obj = JSON.parse(JSON.stringify(ojb));
	}

	public getValue(ctx: Tokenizer) {
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		if (ctx.parameter === null) return `${this.obj}`;
		if (ctx.parameter.startsWith('_') || ctx.parameter.includes('.')) return null;

		const attribute = this.obj[ctx.parameter];
		return attribute ? `${attribute}` : null;
	}
}
