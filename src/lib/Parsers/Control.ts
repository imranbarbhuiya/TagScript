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
 *
 * @allOperators
 * ```md
 * +----------+--------------------------+---------+---------------------------------------------+
 * | Operator | Check                    | Example | Description                                 |
 * +==========+==========================+=========+=============================================+
 * |   ==     | equality                 |  a==a   | value 1 is equal to value 2                 |
 * +----------+--------------------------+---------+---------------------------------------------+
 * |   !=     | inequality               |  a!=b   | value 1 is not equal to value 2             |
 * +----------+--------------------------+---------+---------------------------------------------+
 * |   >      | greater than             |  5>3    | value 1 is greater than value 2             |
 * +----------+--------------------------+---------+---------------------------------------------+
 * |   <      | less than                |  4<8    | value 1 is less than value 2                |
 * +----------+--------------------------+---------+---------------------------------------------+
 * |   >=     | greater than or equality | 10>=10  | value 1 is greater than or equal to value 2 |
 * +----------+--------------------------+---------+---------------------------------------------+
 * |   <=     | less than or equality    |  5<=6   | value 1 is less than or equal to value 2    |
 * +----------+--------------------------+---------+---------------------------------------------+
 * ```
 *
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
 *     # Too high, try again.
 *     # if args is 14
 *     # Too low, try again.
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

/**
 * The union parser checks that any of the passed expressions are true.
 * Multiple expressions can be passed to the parameter by splitting them with pipe (`|`).
 * The payload is a required message that must be split by pipe (`|`).
 * If the expression evaluates true, then the message before the pipe (`|`) is returned, else the message after is returned.
 * @usage
 * ```yaml
 * 		{any(<expression|expression|...>):<message>}
 * ```
 * @alias or, union
 * @example
 * ```yaml
 *     {any({args}==hi|{args}==hello|{args}==heyy):Hello {user}!|How rude.}
 *     # if {args} is hi
 *     Hello sravan#0001!
 *     # if {args} is what's up
 *     How rude.
 * ```
 */
export class UnionStatementParser extends BaseParser implements IParser {
	public constructor() {
		super(['union', 'any', 'or'], true, true);
	}

	public parse(ctx: Context) {
		const result = any(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}

/**
 *  The intersection parser checks that all of the passed expressions are true.
 *  Multiple expressions can be passed to the parameter by splitting them with pipe (`|`).
 *  The payload is a required message that must be split by pipe (`|`).
 *  If the expression evaluates true, then the message before the pipe (`|`) is returned, else the message after is returned.
 *  @usage
 * ```yaml
 * 		{all(<expression|expression|...>):<message>}
 * ```
 *  @alias and, all
 *  @example
 * ```yaml
 *      {all({args}>=100|{args}<=1000):You picked {args}.|You must provide a number between 100 and 1000.}
 *      # if {args} is 52
 *      You must provide a number between 100 and 1000.
 *      # if {args} is 282
 *      You picked 282.
 * ```
 */
export class IntersectionStatementParser extends BaseParser implements IParser {
	public constructor() {
		super(['intersection', 'all', 'and'], true, true);
	}

	public parse(ctx: Context) {
		const result = all(parseListIf(ctx.tag.parameter!));
		return parseIntoOutput(ctx.tag.payload!, result);
	}
}
