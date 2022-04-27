export enum Part {
	tagStart = '{',
	tagEnd = '}',
	colon = ':',
	comma = ',',
	dot = '.',
	parenStart = '(',
	parenEnd = ')',
	escape = '\\',
	pipe = '|',
}

export enum ParenType {
	Parenthesis,
	Dot,
	Both,
}

/**
 * Represents the passed Tag.
 */
export class Lexer {
	public parameter: string | null;
	public declaration: string | null;
	public payload: string | null;
	private parenType: ParenType;
	private parsedInput!: string;
	private parsedLength!: number;
	private decDepth!: number;
	private decStart!: number;
	private skipNext!: boolean;
	private usedParenType!: ParenType;

	public constructor(input: string, limit = 2000, parenType = ParenType.Both) {
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
			response +=
				this.usedParenType === ParenType.Dot
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
			usedParenType: this.usedParenType,
		};
	}

	private lex(input: string, limit: number) {
		this.parsedInput = input.slice(1, -1).slice(0, limit);
		this.parsedLength = this.parsedInput.length;
		this.decDepth = 0;
		this.decStart = 0;
		this.skipNext = false;

		const parseParameter = (index: number, token: string) =>
			this.parenType === ParenType.Dot
				? this.parseDotParameter(index, token)
				: this.parenType === ParenType.Parenthesis
				? this.parseParenthesisParameter(index, token)
				: this.parseParenthesisParameter(index, token) || this.parseDotParameter(index, token);

		for (let i = 0; i < this.parsedInput.length; i++) {
			const token = this.parsedInput[i];
			if (this.skipNext) {
				this.skipNext = false;
				continue;
			} else if (token === Part.escape) {
				this.skipNext = true;
				continue;
			}

			if (token === Part.colon && !this.decDepth) {
				this.setPayload();
				return;
			} else if (parseParameter(i, token)) return;
			this.setPayload();
		}
	}

	private parseDotParameter(index: number, token: string) {
		if (token === Part.dot) {
			this.usedParenType = ParenType.Dot;
			this.openParameter(index);
		} else if (
			this.usedParenType === ParenType.Dot &&
			(token === Part.colon || index === this.parsedLength - 1) &&
			this.decDepth
		)
			return this.closeParameter(index);
		return false;
	}

	private parseParenthesisParameter(index: number, token: string) {
		if (token === Part.parenStart) {
			this.usedParenType = ParenType.Parenthesis;
			this.openParameter(index);
		} else if (this.usedParenType === ParenType.Parenthesis && token === Part.parenEnd && this.decDepth)
			return this.closeParameter(index);

		return false;
	}

	private setPayload() {
		const [declaration, ...payloads] = this.parsedInput.split(':');
		const payload = payloads.join(Part.colon);
		if (payload.length) this.payload = payload;
		this.declaration ||= declaration;
	}

	private openParameter(i: number) {
		this.decDepth += 1;
		if (!this.decStart) this.decStart = i;
		this.decDepth === 1 && (this.declaration = this.parsedInput.slice(0, i));
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
