import { Context, Lexer } from '../Interpreter';
import { Awaitable } from '../Utils/Util';

export interface ITransformer {
	transform(ctx: Lexer): string | null;
}
export interface IParser {
	willAccept(ctx: Context): Awaitable<boolean>;
	parse(ctx: Context): Awaitable<string | null>;
}
