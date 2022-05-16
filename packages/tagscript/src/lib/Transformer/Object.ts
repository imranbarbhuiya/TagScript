import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

/**
 * Object transformer safely transforms an object by removing all the methods (except toString), private properties and based on the given parameters.
 */
export class SafeObjectTransformer implements ITransformer {
	private obj: Record<string, unknown>;

	public constructor(obj: Record<string, unknown> | string) {
		this.obj = this.makeObject(obj);
	}

	public transform(tag: Lexer) {
		if (tag.parameter === null) return `${this.obj}`;
		if (tag.parameter.startsWith('_')) return null;

		const attribute = this.obj[tag.parameter];
		return attribute ? `${attribute}` : null;
	}

	private makeObject(obj: Record<string, unknown> | string) {
		const safeObject = JSON.parse(typeof obj === 'string' ? obj : JSON.stringify(obj)) as Record<string, unknown>;
		Object.defineProperty(safeObject, 'toString', {
			value: obj.toString.bind(obj)
		});
		return safeObject;
	}
}
