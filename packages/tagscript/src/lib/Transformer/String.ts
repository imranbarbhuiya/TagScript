import { escapeContent } from '../Utils/Util';

import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';

/**
 * String transformer transforms a string based on the given parameters.
 *
 * If no parameters are given, the string will be returned as is.
 * If an integer parameter is given, the string will be splitted into an array of strings using payload or space as a separator.
 * And will return the element at the given index (integer parameter).
 *
 * Use a `+` before the index to reference every element up to and including the index value.
 *
 * Use a `+` after the index to reference the index value and every element after it.
 *
 *
 * @example
 * ```ts
 * import { Interpreter, StringTransformer } from 'tagscript';
 *
 * const ts = new Interpreter();
 *
 * await ts.run('{args}', { args: new StringTransformer('Hi, How are you?') });
 * // Hi, How are you?
 *
 * await ts.run('{args(0)}', { args: new StringTransformer('Hi, How are you?') });
 * // Hi,
 *
 * await ts.run('{args(1)}', { args: new StringTransformer('Hi, How are you?') });
 * // How
 *
 * await ts.run('{args(2+)}', { args: new StringTransformer('Hi, How are you?') });
 * // How are you?
 *
 * await ts.run('{args(+2)}', { args: new StringTransformer('Hi Vox, How are you?') });
 * // Hi Vox,
 * ```
 */
export class StringTransformer implements ITransformer {
	private readonly str: string;

	private readonly escape: boolean;

	/**
	 *
	 * @param str - The string to transform.
	 * @param escape - If true, the string will be escaped.
	 */
	public constructor(str: string, escape = false) {
		this.str = str;
		this.escape = escape;
	}

	public transform(tag: Lexer) {
		return this.returnValue(this.handleContext(tag));
	}

	private handleContext(tag: Lexer): string {
		if (tag.parameter === null) return this.str;
		if (!tag.parameter.includes('+')) {
			const index = Number.parseInt(tag.parameter, 10) - 1;
			const splitter = tag.payload ?? / +/;
			return this.str.split(splitter)[index] ?? this.str;
		}

		const index = Number.parseInt(tag.parameter.replace('+', ''), 10) - 1;
		const splitter = tag.payload ?? / +/;
		if (tag.parameter.startsWith('+')) {
			return this.str
				.split(splitter)
				.slice(0, index + 1)
				.join(tag.payload ?? ' ');
		} else if (tag.parameter.endsWith('+')) {
			return this.str
				.split(splitter)
				.slice(index)
				.join(tag.payload ?? ' ');
		}

		return this.str.split(splitter)[index] ?? this.str;
	}

	private returnValue(str: string): string {
		return this.escape ? escapeContent(str) : str;
	}
}
