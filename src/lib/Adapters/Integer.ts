import { Adapter } from '../Interpreter';

export class IntegerAdapter implements Adapter {
	private integer: number;
	public constructor(int: string) {
		this.integer = parseInt(int, 10);
	}

	public getValue() {
		return `${this.integer}`;
	}
}
