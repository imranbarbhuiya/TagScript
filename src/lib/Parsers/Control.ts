import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { all, any } from '../Utils/Util';
import { BaseParser } from './Base';
import { split, parseIf, parseListIf } from './helpers';

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
export class IfStatementParser extends BaseParser implements IParser {
	public constructor() {
		super(['if'], true, true);
	}

	public process(ctx: Context) {
		const result = parseIf(ctx.tag.parameter!);
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}

export class UnionStatementParser extends BaseParser implements IParser {
	protected override acceptedNames = ['union', 'any', 'or'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public process(ctx: Context) {
		const result = any(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}

export class IntersectionStatementParser extends BaseParser implements IParser {
	protected override acceptedNames = ['intersection', 'all', 'and'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public process(ctx: Context) {
		const result = all(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}
