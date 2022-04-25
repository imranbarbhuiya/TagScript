import { ITransformer } from '../interfaces';

export class Response {
	public raw!: string;
	public body: string | null;
	public variables: { [key: string]: ITransformer };
	public actions: { [key: string]: unknown };
	public keyValues: { [key: string]: unknown };

	public constructor(variables: { [key: string]: ITransformer } = {}, keyValues: { [key: string]: unknown } = {}) {
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
			actions: this.actions,
			variables: this.variables,
			keyValues: this.keyValues,
		};
	}
}
