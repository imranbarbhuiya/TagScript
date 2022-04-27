import type { ITransformer, KeyValues } from '../interfaces';

/**
 * An object containing information on a completed TagScript process.
 */
export class Response {
	/**
	 * The raw string that was used to generate this response.
	 */
	public raw!: string;
	/**
	 * The cleaned message with all tags interpreted.
	 */
	public body: string | null;
	/**
	 * An object with all the variables that parsers such as the `LooseVarsParser` can access.
	 */
	public variables: { [key: string]: ITransformer };
	public actions: { [key: string]: unknown };
	public keyValues: KeyValues;

	public constructor(variables: { [key: string]: ITransformer } = {}, keyValues: KeyValues = {}) {
		this.body = null;
		this.actions = {};
		this.variables = variables;
		this.keyValues = keyValues;
	}

	public setValues(output: string, raw: string) {
		if (this.body === null) this.body = output.trim();
		else this.body = this.body.trim();

		this.raw = raw;
		return this;
	}

	public toJSON() {
		return {
			body: this.body,
			raw: this.raw,
			actions: this.actions,
			variables: this.variables,
			keyValues: this.keyValues,
		};
	}
}
