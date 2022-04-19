import { Adapter } from '../Interpreter';

type AdapterFunction = (...args: unknown[]) => string;

export class FunctionAdapter implements Adapter {
	private fn: AdapterFunction;
	public constructor(fn: AdapterFunction) {
		this.fn = fn;
	}

	public getValue() {
		return this.fn();
	}
}
