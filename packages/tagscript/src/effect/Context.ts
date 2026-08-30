import type { Lexer } from '../lib/Interpreter/Lexer';
import type { Response } from './Response';

/**
 * The data of the tag being processed, handed to every parser.
 */
export interface ParseContext {
	/**
	 * The original message passed to the interpreter.
	 */
	readonly originalMessage: string;
	/**
	 * The response being built. Parsers write actions and variables here.
	 */
	readonly response: Response;
	/**
	 * The tag that triggered the parser.
	 */
	readonly tag: Lexer;
}
