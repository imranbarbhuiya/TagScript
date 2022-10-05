import type { Lexer } from './Lexer';

/**
 * A low-level object representing a bracketed tag.
 */
export class Node {
	public coordinates: [number, number];

	public tag: Lexer | null;

	public output: string | null;

	public constructor(coordinates: [number, number], tag: Lexer | null) {
		this.output = null;
		this.tag = tag;
		this.coordinates = coordinates;
	}

	public toString() {
		const [start, end] = this.coordinates;
		return `${this.tag ?? ''} at ${start}-${end}`;
	}

	public toJSON() {
		return {
			output: this.output,
			tag: this.tag,
			coordinates: this.coordinates
		};
	}
}
