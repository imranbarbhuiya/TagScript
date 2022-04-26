import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

export class SafeObjectTransformer implements ITransformer {
	private obj: { [key: string]: unknown };
	public constructor(ojb: { [key: string]: unknown }) {
		this.obj = JSON.parse(JSON.stringify(ojb)) as { [key: string]: unknown };
	}

	public transform(tag: Lexer) {
		if (tag.parameter === null) return `${this.obj}`;
		if (tag.parameter.startsWith('_') || tag.parameter.includes('.')) return null;

		const attribute = this.obj[tag.parameter];
		return attribute ? `${attribute}` : null;
	}
}
