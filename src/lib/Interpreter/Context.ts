import { Lexer, Interpreter, Response } from '.';

export class Context {
	public tag: Lexer;
	public response: Response;
	private originalMessage: string;
	private interpreter: Interpreter;

	public constructor(tag: Lexer, res: Response, interpreter: Interpreter, originalMessage: string) {
		this.tag = tag;
		this.originalMessage = originalMessage;
		this.interpreter = interpreter;
		this.response = res;
	}

	public toJSON() {
		return {
			tag: this.tag,
			originalMessage: this.originalMessage,
			interpreter: this.interpreter,
			response: this.response,
		};
	}
}
