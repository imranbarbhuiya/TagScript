import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

/**
 * Integer transformer transforms an integer based on the given parameters.
 *
 * If no parameters are given, the integer will be returned as is.
 *
 * if `++` parameter is given, the integer will be incremented.
 * if `--` parameter is given, the integer will be decremented.
 */
export class IntegerTransformer implements ITransformer {
	private integer: number;

	public constructor(int: `${bigint | number}`) {
		this.integer = Number.parseInt(int, 10);
	}

	public transform(tag: Lexer) {
		if (tag.parameter === '++') {
			return `${++this.integer}`;
		}

		if (tag.parameter === '--') {
			return `${--this.integer}`;
		}

		return `${this.integer}`;
	}
}
