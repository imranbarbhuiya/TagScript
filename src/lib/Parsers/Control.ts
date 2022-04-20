import { Context, Parser } from '../Interpreter';
import { BaseParser } from './Base';
import { split, parseIf } from './helpers';

export class IfStatementParser extends BaseParser implements Parser {
	protected override acceptedNames: string[] = ['if'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public process(ctx: Context) {
		const result = parseIf(ctx.token.parameter!);
		return parseIntoOutput(ctx.token.payload!, result);
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
