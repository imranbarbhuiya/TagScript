import type { Context } from '../Interpreter';

/**
 * A base class for all transformers.
 * @abstract
 */
export abstract class BaseParser {
	protected acceptedNames: string[];
	protected requiredParameter: boolean;
	protected requiredPayload: boolean;

	public constructor(acceptedNames: string[], requiredParameter = false, requiredPayload = false) {
		this.acceptedNames = acceptedNames;
		this.requiredParameter = requiredParameter;
		this.requiredPayload = requiredPayload;
	}

	public willAccept(ctx: Context): boolean {
		const dec = ctx.tag.declaration?.toLowerCase();
		return (
			this.acceptedNames.includes(dec!) &&
			Boolean(!this.requiredParameter || ctx.tag.parameter) &&
			Boolean(!this.requiredPayload || ctx.tag.payload)
		);
	}
}
