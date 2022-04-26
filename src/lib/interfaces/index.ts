import type { Context, Lexer } from '../Interpreter';
import type { Awaitable } from '../Utils/Util';

export interface ITransformer {
	transform(tag: Lexer): string | null;
}
export interface IParser {
	willAccept(ctx: Context): Awaitable<boolean>;
	parse(ctx: Context): Awaitable<string | null>;
}

export interface KeyValues {
	cooldown?: {
		cooldown: number;
		message: string | null;
	};
}
