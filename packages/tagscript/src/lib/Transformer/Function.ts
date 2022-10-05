import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

export type TransformerFunction = (tag: Lexer) => string;

export class FunctionTransformer implements ITransformer {
	private readonly fn: TransformerFunction;

	public constructor(fn: TransformerFunction) {
		this.fn = fn;
	}

	public transform(tag: Lexer) {
		return this.fn(tag);
	}
}
