export enum Part {
	colon = ':',
	comma = ',',
	dot = '.',
	escape = '\\',
	parenEnd = ')',
	parenStart = '(',
	pipe = '|',
	tagEnd = '}',
	tagStart = '{'
}

export enum ParenType {
	Parenthesis,
	Dot,
	Both
}

/**
 * Represents the passed Tag.
 */
export class Lexer {
	public parameter: string | null;

	public declaration: string | null;

	public payload: string | null;

	private readonly parenType: ParenType;

	private parsedInput!: string;

	private parsedLength!: number;

	private dotDecDepth!: number;

	private dotDecStart!: number;

	private parenDecDepth!: number;

	private parenDecStart!: number;

	private skipNext!: boolean;

	private usedParenType!: ParenType;

	public constructor(input: string, limit = 2_000, parenType = ParenType.Both) {
		this.declaration = null;
		this.parameter = null;
		this.payload = null;
		this.parenType = parenType;
		this.lex(input, limit);
	}

	public toString() {
		let response: string = Part.tagStart;
		if (this.declaration !== null) response += this.declaration;
		if (this.parameter !== null)
			response += this.usedParenType === ParenType.Dot ? `${Part.dot}${this.parameter}` : `${Part.parenStart}${this.parameter}${Part.parenEnd}`;
		if (this.payload !== null) response += `${Part.colon}${this.payload}`;
		response += Part.tagEnd;
		return response;
	}

	public toJSON() {
		return {
			declaration: this.declaration,
			parameter: this.parameter,
			payload: this.payload,
			usedParenType: this.usedParenType
		};
	}

	private lex(input: string, limit: number) {
		this.parsedInput = input.slice(1, -1).slice(0, limit);
		this.parsedLength = this.parsedInput.length;
		this.dotDecDepth = 0;
		this.dotDecStart = 0;
		this.parenDecDepth = 0;
		this.parenDecStart = 0;
		this.skipNext = false;

		for (let index = 0; index < this.parsedInput.length; index++) {
			const token = this.parsedInput[index];
			if (this.skipNext) {
				this.skipNext = false;
				continue;
			} else if (token === Part.escape) {
				this.skipNext = true;
				continue;
			}

			if (token === Part.colon && !this.dotDecDepth && !this.parenDecDepth) {
				this.setPayload();
				return;
			} else if (this.parseParameter(index, token)) return;
			this.setPayload();
		}
	}

	private parseParameter(index: number, token: string) {
		return this.parenType === ParenType.Dot
			? this.parseDotParameter(index, token)
			: this.parenType === ParenType.Parenthesis
				? this.parseParenthesisParameter(index, token)
				: this.parseParenthesisParameter(index, token) || this.parseDotParameter(index, token);
	}

	private parseDotParameter(index: number, token: string) {
		if (token === Part.dot && !this.parenDecDepth) {
			this.usedParenType = ParenType.Dot;
			this.openParameter(index);
		} else if (this.dotDecDepth && (token === Part.colon || index === this.parsedLength - 1))
			return this.closeParameter(token === Part.colon ? index : index + 1);

		return false;
	}

	private parseParenthesisParameter(index: number, token: string) {
		if (token === Part.parenStart && !this.dotDecDepth) {
			this.usedParenType = ParenType.Parenthesis;
			this.openParameter(index);
		} else if (this.parenDecDepth && token === Part.parenEnd) return this.closeParameter(index);
		return false;
	}

	private setPayload() {
		const [declaration, ...payloads] = this.parsedInput.split(':');
		const payload = payloads.join(Part.colon);
		if (payload.length) this.payload = payload;
		this.declaration ??= declaration;
	}

	private openParameter(index: number, type: ParenType = this.usedParenType) {
		const decDepth = type === ParenType.Dot ? (this.dotDecDepth += 1) : (this.parenDecDepth += 1);
		if (type === ParenType.Dot) this.dotDecStart ||= index;
		else this.parenDecStart ||= index;
		if (decDepth === 1) this.declaration = this.parsedInput.slice(0, index);
	}

	private closeParameter(index: number) {
		const decDepth = this.usedParenType === ParenType.Dot ? (this.dotDecDepth = 0) : (this.parenDecDepth -= 1);
		const decStart = this.usedParenType === ParenType.Dot ? this.dotDecStart : this.parenDecStart;
		if (decDepth === 0) {
			this.parameter = this.parsedInput.slice(decStart + 1, index);
			if (this.parsedInput[index + 1] === Part.colon) this.payload = this.parsedInput.slice(index + 2);
			return true;
		}

		return false;
	}
}
