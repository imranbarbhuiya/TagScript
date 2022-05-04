import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

/**
 * Object transformer safely transforms an object by removing all the methods (except toString), private properties and based on the given parameters.
 */
export class SafeObjectTransformer implements ITransformer {
	private obj: { [key: string]: unknown };
	public constructor(obj: { [key: string]: unknown }) {
		this.obj = obj;
	}

	public transform(tag: Lexer) {
		if (tag.parameter === null) return `${this.obj}`;
		if (tag.parameter.startsWith('_')) return null;

		const attribute = this.obj[tag.parameter];
		return !attribute || typeof attribute === 'function' ? null : `${attribute}`;
	}
}
