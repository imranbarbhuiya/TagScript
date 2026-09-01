export enum Part {
	colon = ':',
	comma = ',',
	dot = '.',
	escape = '\\',
	parenEnd = ')',
	parenStart = '(',
	pipe = '|',
	tagEnd = '}',
	tagStart = '{',
}

export enum ParenType {
	Parenthesis,
	Dot,
	Both,
}

/**
 * Where one part of a tag sits, as a half-open `[start, end)` range measured from the tag's own
 * opening brace. Add the node's start coordinate to get an offset into the whole template.
 */
export interface TagSpan {
	start: number;
	end: number;
}

/**
 * Where each part of a tag sits. A part that the tag does not have is `null`.
 */
export interface TagSpans {
	declaration: TagSpan | null;
	parameter: TagSpan | null;
	payload: TagSpan | null;
}

/**
 * Represents the passed Tag.
 */
export class Lexer {
	public parameter: string | null;

	public declaration: string | null;

	public payload: string | null;

	/**
	 * Where each part of this tag sits in the original text. Needed by anything that highlights or
	 * edits a template rather than just rendering it.
	 */
	public spans: TagSpans;

	private readonly parenType: ParenType;

	private parsedInput!: string;

	private parsedLength!: number;

	private dotDecDepth!: number;

	private dotDecStart!: number;

	private parenDecDepth!: number;

	private parenDecStart!: number;

	private skipNext!: boolean;

	private usedParenType!: ParenType;

	private declarationEnd!: number;

	private parameterStart!: number;

	private parameterEnd!: number;

	private payloadStart!: number;

	public constructor(input: string, limit = 2_000, parenType = ParenType.Both) {
		this.declaration = null;
		this.parameter = null;
		this.payload = null;
		this.parenType = parenType;
		this.lex(input, limit);
		this.spans = this.buildSpans();
	}

	public toString() {
		let response: string = Part.tagStart;
		if (this.declaration !== null) response += this.declaration;
		if (this.parameter !== null) {
			response +=
				this.usedParenType === ParenType.Dot
					? `${Part.dot}${this.parameter}`
					: `${Part.parenStart}${this.parameter}${Part.parenEnd}`;
		}
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
		this.dotDecDepth = 0;
		this.dotDecStart = 0;
		this.parenDecDepth = 0;
		this.parenDecStart = 0;
		this.skipNext = false;
		this.declarationEnd = -1;
		this.parameterStart = -1;
		this.parameterEnd = -1;
		this.payloadStart = -1;

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
		} else if (this.dotDecDepth && (token === Part.colon || index === this.parsedLength - 1)) {
			return this.closeParameter(token === Part.colon ? index : index + 1);
		}

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
		if (payload.length) {
			this.payload = payload;
			this.payloadStart = declaration.length + 1;
		}

		if (this.declaration === null) {
			this.declaration = declaration;
			this.declarationEnd = declaration.length;
		}
	}

	private openParameter(index: number, type: ParenType = this.usedParenType) {
		const decDepth = type === ParenType.Dot ? (this.dotDecDepth += 1) : (this.parenDecDepth += 1);
		if (type === ParenType.Dot) this.dotDecStart ||= index;
		else this.parenDecStart ||= index;
		if (decDepth === 1) {
			this.declaration = this.parsedInput.slice(0, index);
			this.declarationEnd = index;
		}
	}

	private closeParameter(index: number) {
		const decDepth = this.usedParenType === ParenType.Dot ? (this.dotDecDepth = 0) : (this.parenDecDepth -= 1);
		const decStart = this.usedParenType === ParenType.Dot ? this.dotDecStart : this.parenDecStart;
		if (decDepth === 0) {
			this.parameter = this.parsedInput.slice(decStart + 1, index);
			this.parameterStart = decStart + 1;
			this.parameterEnd = index;
			if (this.parsedInput[index + 1] === Part.colon) {
				this.payload = this.parsedInput.slice(index + 2);
				this.payloadStart = index + 2;
			}

			return true;
		}

		return false;
	}

	/**
	 *
	 * Turns the offsets collected during lexing into spans, once, at the end.
	 *
	 * `setPayload` runs once per character until the tag resolves, so building objects in there
	 * would allocate a handful of them per tag for nothing. Numbers are free to reassign.
	 *
	 * @returns
	 */
	private buildSpans(): TagSpans {
		const shift = (start: number, end: number): TagSpan => ({ start: start + 1, end: end + 1 });

		return {
			declaration: this.declarationEnd === -1 ? null : shift(0, this.declarationEnd),
			parameter: this.parameterStart === -1 ? null : shift(this.parameterStart, this.parameterEnd),
			payload: this.payloadStart === -1 ? null : shift(this.payloadStart, this.parsedInput.length),
		};
	}
}
