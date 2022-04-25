import { Context, Lexer } from '../Interpreter';
import { Awaitable } from '../Utils/Util';

export interface ITransformer {
	getValue(ctx: Lexer): string | null;
}
export interface IParser {
	willAccept(ctx: Context): Awaitable<boolean>;
	process(ctx: Context): Awaitable<string | null>;
}
