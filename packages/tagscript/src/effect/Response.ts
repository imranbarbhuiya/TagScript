import type { IActions, IKeyValues, ITransformer } from '../lib/interfaces';
import type { ParserError, TemplateError } from './Errors';

/**
 * Everything a completed render produced.
 *
 * This mirrors the classic `Response`, but `errors` holds tagged errors rather than the class
 * hierarchy the classic entry point uses.
 */
export class Response {
	/**
	 * The cleaned message with all tags interpreted.
	 */
	public body: string | null;

	/**
	 * The raw string that was used to generate this response.
	 */
	public raw!: string;

	/**
	 * Side effects the template requested. Your code decides what to do with them.
	 *
	 * Extend it with [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
	 * on `IActions`, the same interface the classic entry point uses.
	 */
	public actions: IActions;

	/**
	 * Seeded variables plus anything the template defined during the render.
	 */
	public variables: { [key: string]: ITransformer };

	/**
	 * Whatever you passed in. The interpreter never touches it.
	 */
	public keyValues: IKeyValues;

	/**
	 * Every error a parser raised that the render recovered from, in the order they happened.
	 *
	 * A {@link TemplateError} has already been rendered into `body` in place of its tag; a
	 * {@link ParserError} means a parser threw a defect and `body` got a generic message instead,
	 * with the real error on `cause`. An empty array means the render was clean.
	 *
	 * Anything a parser fails with that is not a `TemplateError` reaches the error channel instead
	 * of landing here, so the caller handles it with `Effect.catchTag`.
	 */
	public errors: (ParserError | TemplateError)[];

	public constructor(variables: { [key: string]: ITransformer } = {}, keyValues: IKeyValues = {}) {
		this.body = null;
		this.actions = {};
		this.variables = variables;
		this.keyValues = keyValues;
		this.errors = [];
	}

	public setValues(output: string, raw: string) {
		this.body = this.body === null ? output.trim() : this.body.trim();
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
			errors: this.errors,
		};
	}
}
