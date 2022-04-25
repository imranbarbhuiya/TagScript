import { StringTransformer } from '../Transformer';
import { IParser } from '../interfaces';
import { Context } from '../Interpreter';
import { BaseParser } from './Base';

export class DefineParser extends BaseParser implements IParser {
	public constructor() {
		super(['=', 'assign', 'let', 'var'], true);
	}

	public process(ctx: Context) {
		ctx.response.variables[ctx.tag.parameter!] = new StringTransformer(ctx.tag.payload!);
		return '';
	}
}
