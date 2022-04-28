import type { ITransformer } from '../interfaces';
import type { Lexer } from '../Interpreter';
import { escapeContent } from '../Utils/Util';

export class StringTransformer implements ITransformer {
	private str: string;
	private escape: boolean;
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
			const index = parseInt(tag.parameter, 10) - 1;
			const splitter = tag.payload ?? ' ';
			return this.str.split(splitter)[index] ?? this.str;
		}

		const index = parseInt(tag.parameter.replace('+', ''), 10) - 1;
		const splitter = tag.payload ?? ' ';
		if (tag.parameter.startsWith('+')) {
			return this.str
				.split(splitter)
				.slice(0, index + 1)
				.join(splitter);
		} else if (tag.parameter.endsWith('+')) {
			return this.str.split(splitter).slice(index).join(splitter);
		}

		return this.str.split(splitter)[index] ?? this.str;
	}

	private returnValue(str: string): string {
		return this.escape ? escapeContent(str) : str;
	}
}
