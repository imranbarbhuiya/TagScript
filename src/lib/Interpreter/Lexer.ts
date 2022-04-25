export enum Part {
	tagStart = '{',
	tagEnd = '}',
	colon = ':',
	comma = ',',
	dot = '.',
	parenStart = '(',
	parenEnd = ')',
	comment = '\\',
	pipe = '|',
}

/**
 * Represents the passed Tag.
 */
export class Lexer {
	public parameter: string | null;
	public declaration: string | null;
	public payload: string | null;
	private dotParameter: boolean;
	private parsedInput!: string;
	private parsedLength!: number;
	private decDepth!: number;
	private decStart!: number;
	private skipNext!: boolean;

	public constructor(input: string, limit = 2000, dotParameter = false) {
		this.declaration = null;
		this.parameter = null;
		this.payload = null;
		this.dotParameter = dotParameter;
		this.lex(input, limit);
	}

	public toString() {
		let response: string = Part.tagStart;
		if (this.declaration !== null) response += this.declaration;
		if (this.parameter !== null)
			response += this.dotParameter
				? `${Part.dot}${this.parameter}`
				: `${Part.parenStart}${this.parameter}${Part.parenEnd}`;
		if (this.payload !== null) response += `${Part.colon}${this.payload}`;
		response += Part.tagEnd;
		return response;
	}

	public toJSON() {
		return {
			declaration: this.declaration,
			parameter: this.parameter,
			payload: this.payload,
			dotParameter: this.dotParameter,
		};
	}

	private lex(input: string, limit: number) {
		this.parsedInput = input.slice(1, -1).slice(0, limit);
		this.parsedLength = this.parsedInput.length;
		this.decDepth = 0;
		this.decStart = 0;
		this.skipNext = false;

		const parseParameter = this.dotParameter
			? this.parseDotParameter.bind(this)
			: this.parseParenthesisParameter.bind(this);

		for (let i = 0; i < this.parsedInput.length; i++) {
			const char = this.parsedInput[i];
			if (this.skipNext) {
				this.skipNext = false;
				continue;
			} else if (char === Part.comment) {
				this.skipNext = true;
				continue;
			}

			if (char === Part.colon && !this.decDepth) {
				this.setPayload();
				return;
			} else if (parseParameter(i, char)) return;
			this.setPayload();
		}
	}

	private parseDotParameter(index: number, char: string) {
		if (char === Part.dot) this.openParameter(index);
		else if ((char === Part.colon || index === this.parsedLength - 1) && this.decDepth)
			return this.closeParameter(index + 1);
		return false;
	}

	private parseParenthesisParameter(index: number, char: string) {
		if (char === Part.parenStart) this.openParameter(index);
		else if (char === Part.parenEnd && this.decDepth) return this.closeParameter(index);
		return false;
	}

	private setPayload() {
		const [declaration, ...payloads] = this.parsedInput.split(':');
		const payload = payloads.join(Part.colon);
		if (payload.length) this.payload = payload;
		if (!this.declaration) this.declaration = declaration;
	}

	private openParameter(i: number) {
		this.decDepth += 1;
		if (!this.decStart) this.decStart = i;
		this.declaration = this.parsedInput.slice(0, i);
	}

	private closeParameter(i: number) {
		this.decDepth -= 1;
		if (this.decDepth === 0) {
			this.parameter = this.parsedInput.slice(this.decStart + 1, i);
			if (this.parsedInput[i + 1] === Part.colon) this.payload = this.parsedInput.slice(i + 2);
			return true;
		}
		return false;
	}
}
