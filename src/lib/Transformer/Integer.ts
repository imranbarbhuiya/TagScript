import type { ITransformer } from '../interfaces';

export class IntegerTransformer implements ITransformer {
	private integer: number;
	public constructor(int: string) {
		this.integer = parseInt(int, 10);
	}

	public transform() {
		return `${this.integer}`;
	}
}
