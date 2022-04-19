import { Context } from '../Interpreter';

export abstract class BaseParser {
	protected acceptedNames: string[] = [];

	public willAccept(ctx: Context): boolean {
		const dec = ctx.token.declaration?.toLowerCase();
		return this.acceptedNames.includes(dec!);
	}
}
