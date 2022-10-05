import { BaseParser } from './Base';

import { parseIf } from '../Utils/Util';

import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';

/**
 * The stop tag stops tag processing if the given parameter is true.
 * If a message is passed to the payload it will return that message.
 *
 * Aliases: halt, stop
 *
 * @example
 * ```yaml
 * {stop({args}!=10):You didn't provided valid input.}
 * ```
 */
export class StopParser extends BaseParser implements IParser {
	public constructor() {
		super(['stop', 'halt', 'error'], true);
	}

	public parse(ctx: Context) {
		if (parseIf(ctx.tag.parameter!)) throw new Error(ctx.tag.payload ?? '');
		return '';
	}
}
