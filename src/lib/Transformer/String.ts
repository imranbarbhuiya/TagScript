import { ITransformer } from '../interfaces';
import { Lexer } from '../Interpreter';

export class StringTransformer implements ITransformer {
	private str: string;
	private escape: boolean;
	public constructor(str: string, escape = false) {
		this.str = str;
		this.escape = escape;
	}

	public transform(ctx: Lexer) {
		return this.returnValue(this.handleContext(ctx));
	}

	private handleContext(ctx: Lexer): string {
		if (ctx.parameter === null) return this.str;
		try {
			if (!ctx.parameter.includes('+')) {
				const index = parseInt(ctx.parameter, 10) - 1;
				const splitter = ctx.payload ?? ' ';
				return this.str.split(splitter)[index];
			}

			const index = parseInt(ctx.parameter.replace('+', ''), 10) - 1;
			const splitter = ctx.payload ?? ' ';
			if (ctx.parameter.startsWith('+')) {
				return this.str
					.split(splitter)
					.slice(0, index + 1)
					.join(splitter);
			} else if (ctx.parameter.endsWith('+')) {
				return this.str.split(splitter).slice(index).join(splitter);
			}

			return this.str.split(splitter)[index];
		} catch {
			return this.str;
		}
	}

	private returnValue(str: string): string {
		return this.escape ? escapeContent(str) : str;
	}
}

const escapeContent = (content: string): string => {
	const regex = /(?<!\\)([{():|}])/g;
	return content.replace(regex, '\\$1');
};
