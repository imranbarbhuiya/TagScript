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

/**
 * The if tag returns a message based on the passed expression to the parameter.
 * An expression is represented by two values compared with an operator.
 * The payload is a required message that must be split by pipe (`|`).
 * If the expression evaluates true, then the message before the pipe (`|`) is returned, else the message after is returned.
 * **Expression Operators:**
 * +----------+--------------------------+---------+---------------------------------------------+
 * | Operator | Check                    | Example | Description                                 |
 * +==========+==========================+=========+=============================================+
 * | ``==``   | equality                 | a==a    | value 1 is equal to value 2                 |
 * +----------+--------------------------+---------+---------------------------------------------+
 * | ``!=``   | inequality               | a!=b    | value 1 is not equal to value 2             |
 * +----------+--------------------------+---------+---------------------------------------------+
 * | ``>``    | greater than             | 5>3     | value 1 is greater than value 2             |
 * +----------+--------------------------+---------+---------------------------------------------+
 * | ``<``    | less than                | 4<8     | value 1 is less than value 2                |
 * +----------+--------------------------+---------+---------------------------------------------+
 * | ``>=``   | greater than or equality | 10>=10  | value 1 is greater than or equal to value 2 |
 * +----------+--------------------------+---------+---------------------------------------------+
 * | ``<=``   | less than or equality    | 5<=6    | value 1 is less than or equal to value 2    |
 * +----------+--------------------------+---------+---------------------------------------------+
 * @usage
 * ```yaml
 * 	  {if(<expression>):<message>]}
 * ```
 * @example
 * ```yaml
 *     {if({args}==63):You guessed it! The number I was thinking of was 63!|Too {if({args}<63):low|high}, try again.}
 *     # if args is 63
 *     # You guessed it! The number I was thinking of was 63!
 *     # if args is 73
 *     # Too low, try again.
 *     # if args is 14
 *     # Too high, try again.
 * ```
 */
export class IfStatementParser extends BaseParser implements IParser {
	public constructor() {
		super(['if'], true, true);
	}

	public parse(ctx: Context) {
		const result = parseIf(ctx.tag.parameter!);
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}

export class UnionStatementParser extends BaseParser implements IParser {
	protected override acceptedNames = ['union', 'any', 'or'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public parse(ctx: Context) {
		// TODO: test
		const result = any(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}

export class IntersectionStatementParser extends BaseParser implements IParser {
	protected override acceptedNames = ['intersection', 'all', 'and'];
	protected override requiredParameter = true;
	protected override requiredPayload = true;

	public parse(ctx: Context) {
		const result = all(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}
