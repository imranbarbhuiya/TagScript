import type { Lexer, Interpreter, Response } from '.';

/**
 *  An object containing data of the TagScript tag processed by the interpreter.
    This class is passed to transformers and parsers during parsing.
 */
export class Context {
	/**
	 * The tag object representing a TagScript tag.
	 */
	public tag: Lexer;
	public response: Response;
	/**
	 * The original message passed to the interpreter.
	 */
	public originalMessage: string;
	/**
	 * The interpreter parsing the TagScript.
	 */
	public interpreter: Interpreter;

	public constructor(tag: Lexer, response: Response, interpreter: Interpreter, originalMessage: string) {
		this.tag = tag;
		this.originalMessage = originalMessage;
		this.interpreter = interpreter;
		this.response = response;
	}

	public toJSON() {
		return {
			tag: this.tag,
			originalMessage: this.originalMessage,
			interpreter: this.interpreter,
			response: this.response
		};
	}
}
