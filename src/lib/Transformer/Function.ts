import { ITransformer } from '../interfaces';

type AdapterFunction = (...args: unknown[]) => string;

export class FunctionTransformer implements ITransformer {
	private fn: AdapterFunction;
	public constructor(fn: AdapterFunction) {
		this.fn = fn;
	}

	public transform() {
		return this.fn();
	}
}
