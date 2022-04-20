import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';
import { split, parseIf } from './helpers';

export class IfStatementParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['if'];

	public process(ctx: Context) {
		if (!ctx.token.parameter) throw this.throwError(ctx, 'parameter is empty');
		if (!ctx.token.payload) throw this.throwError(ctx, 'payload is empty');
		const result = parseIf(ctx.token.parameter);
		return parseIntoOutput(ctx.token.payload, result);
	}

	private throwError(ctx: Context, message: string) {
		return new SyntaxError(`${message} at ${ctx.token.toString()} when parsing if statement`);
	}
}

const parseIntoOutput = (payload: string, result: boolean | null) => {
	if (result === null) return null;
	try {
		const output = split(payload, false);
		if (output !== null && output.length === 2) {
			if (result) return output[0];
			return output[1];
		} else if (result) return payload;
		return '';
	} catch {
		return null;
	}
};
