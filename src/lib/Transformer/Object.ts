import { ITransformer } from '../interfaces';
import { Lexer } from '../Interpreter';

export class SafeObjectTransformer implements ITransformer {
	private obj: { [key: string]: unknown };
	public constructor(ojb: { [key: string]: unknown }) {
		this.obj = JSON.parse(JSON.stringify(ojb));
	}

	public getValue(ctx: Lexer) {
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		if (ctx.parameter === null) return `${this.obj}`;
		if (ctx.parameter.startsWith('_') || ctx.parameter.includes('.')) return null;

		const attribute = this.obj[ctx.parameter];
		return attribute ? `${attribute}` : null;
	}
}
