import { Context } from '../Interpreter';

export abstract class BaseParser {
	protected acceptedNames: string[] = [];
	protected requiredParameter = false;
	protected requiredPayload = false;

	public willAccept(ctx: Context): boolean {
		const dec = ctx.token.declaration?.toLowerCase();
		return (
			this.acceptedNames.includes(dec!) &&
			Boolean(!this.requiredParameter || ctx.token.parameter) &&
			Boolean(!this.requiredPayload || ctx.token.payload)
		);
	}
}
