import { extractTags } from '../lib/Interpreter/extract';
import { findTag } from '../lib/manifest';

import type { ExtractedTag } from '../lib/Interpreter/extract';
import type { ParenType } from '../lib/Interpreter/Lexer';
import type { TagDefinition } from '../lib/manifest';

/**
 * What one piece of a template is.
 */
export const enum TokenKind {
	/**
	 * Text outside any tag.
	 */
	Text = 'text',
	/**
	 * An opening brace.
	 */
	TagStart = 'tagStart',
	/**
	 * A closing brace.
	 */
	TagEnd = 'tagEnd',
	/**
	 * The tag name.
	 */
	Declaration = 'declaration',
	/**
	 * The `(` or `.` that opens a parameter.
	 */
	ParameterStart = 'parameterStart',
	/**
	 * The `)` that closes one. The dot form has no closing delimiter.
	 */
	ParameterEnd = 'parameterEnd',
	/**
	 * The text of a parameter.
	 */
	Parameter = 'parameter',
	/**
	 * The `:` before a payload.
	 */
	Colon = 'colon',
	/**
	 * The text of a payload.
	 */
	Payload = 'payload',
	/**
	 * A backslash and the character it takes literally.
	 */
	Escape = 'escape',
}

/**
 * The TextMate scope each kind carries, so a host can colour these with a theme it already has and
 * get the same result the grammar gives a static code block.
 */
export const SCOPES: Record<TokenKind, string> = {
	[TokenKind.Text]: 'source.tagscript',
	[TokenKind.TagStart]: 'punctuation.definition.tag.begin.tagscript',
	[TokenKind.TagEnd]: 'punctuation.definition.tag.end.tagscript',
	[TokenKind.Declaration]: 'entity.name.function.tagscript',
	[TokenKind.ParameterStart]: 'punctuation.definition.parameter.begin.tagscript',
	[TokenKind.ParameterEnd]: 'punctuation.definition.parameter.end.tagscript',
	[TokenKind.Parameter]: 'variable.parameter.tagscript',
	[TokenKind.Colon]: 'punctuation.separator.key-value.tagscript',
	[TokenKind.Payload]: 'string.unquoted.payload.tagscript',
	[TokenKind.Escape]: 'constant.character.escape.tagscript',
};

/**
 * One piece of a template, with where it sits.
 */
export interface Token {
	/**
	 * Where it ends, exclusive.
	 */
	end: number;
	/**
	 * What this piece is.
	 */
	kind: TokenKind;
	/**
	 * Whether a manifest defines this tag. Only set on a {@link TokenKind.Declaration}, and only
	 * when tags were given. `false` is the mistyped tag that would otherwise reach a reader as
	 * literal braces.
	 */
	known?: boolean;
	/**
	 * The TextMate scope, from {@link SCOPES}.
	 */
	scope: string;
	/**
	 * Where it starts.
	 */
	start: number;
}

/**
 * What to read, and what counts as a known tag.
 */
export interface TokenizeOptions {
	/**
	 * Which parameter syntaxes a template may use.
	 *
	 * @defaultValue ParenType.Both
	 */
	parenType?: ParenType;
	/**
	 * The maximum number of characters read from inside one tag.
	 *
	 * @defaultValue 2000
	 */
	tagLimit?: number;
	/**
	 * Every tag that is allowed to appear. Give this and each declaration reports whether it is one
	 * of them, which is what lets an editor show a typo before anyone reads the output.
	 */
	tags?: readonly TagDefinition[];
}

interface TagNode {
	children: TagNode[];
	tag: ExtractedTag;
}

/**
 *
 * Turns the flat list of tags into a tree, so a payload's own tags can be walked inside it.
 *
 * @param tags - Every tag, in document order.
 * @returns The outermost tags, each carrying the ones inside it.
 */
const toTree = (tags: ExtractedTag[]): TagNode[] => {
	const roots: TagNode[] = [];
	const open: TagNode[] = [];

	for (const tag of tags) {
		while (open.length && open[open.length - 1].tag.end < tag.start) open.pop();
		const node: TagNode = { tag, children: [] };
		if (open.length) open[open.length - 1].children.push(node);
		else roots.push(node);
		open.push(node);
	}

	return roots;
};

/**
 *
 * Reads a template into a flat run of tokens covering every character.
 *
 * This is the same `Lexer` a render uses, so what it reports and what the interpreter does cannot
 * disagree. Use it to highlight a template as it is typed, or to drive an editor.
 *
 * @param message - The template to read.
 * @param options - Parameter syntax, tag limit, and the tags that are allowed to appear.
 * @returns Every token, in document order, with no gaps between them.
 * @example
 * ```ts showLineNumbers
 * tokenize('Hi {upper:there}', { tags: builtinTags });
 * // text 'Hi ', tagStart '{', declaration 'upper' (known), colon ':', payload 'there', tagEnd '}'
 * ```
 */
export const tokenize = (message: string, options: TokenizeOptions = {}): Token[] => {
	const { tags, parenType, tagLimit } = options;
	const tokens: Token[] = [];

	const push = (kind: TokenKind, start: number, end: number, known?: boolean) => {
		if (end <= start) return;
		tokens.push({ kind, start, end, scope: SCOPES[kind], ...(known === undefined ? {} : { known }) });
	};

	const fill = (from: number, to: number, kind: TokenKind) => {
		let cursor = from;
		for (let index = from; index < to - 1; index++) {
			if (message[index] !== '\\') continue;
			push(kind, cursor, index);
			push(TokenKind.Escape, index, index + 2);
			cursor = index + 2;
			index++;
		}

		push(kind, cursor, to);
	};

	function region(from: number, to: number, kind: TokenKind, children: TagNode[]) {
		let cursor = from;
		for (const child of children) {
			if (child.tag.start < from || child.tag.end >= to) continue;
			fill(cursor, child.tag.start, kind);
			emit(child);
			cursor = child.tag.end + 1;
		}

		fill(cursor, to, kind);
	}

	function emit(node: TagNode) {
		const { tag, children } = node;
		const { spans } = tag;
		push(TokenKind.TagStart, tag.start, tag.start + 1);
		let cursor = tag.start + 1;

		if (spans.declaration) {
			push(
				TokenKind.Declaration,
				spans.declaration.start,
				spans.declaration.end,
				tags === undefined ? undefined : Boolean(findTag(tags, tag.tag.declaration)),
			);
			cursor = spans.declaration.end;
		}

		if (spans.parameter) {
			push(TokenKind.ParameterStart, cursor, spans.parameter.start);
			region(spans.parameter.start, spans.parameter.end, TokenKind.Parameter, children);
			cursor = spans.parameter.end;
			if (message[cursor] === ')') {
				push(TokenKind.ParameterEnd, cursor, cursor + 1);
				cursor++;
			}
		}

		if (spans.payload) {
			push(TokenKind.Colon, cursor, spans.payload.start);
			region(spans.payload.start, spans.payload.end, TokenKind.Payload, children);
			cursor = spans.payload.end;
		}

		// A tag longer than the tag limit is read only that far, so the rest is not any part of it.
		fill(cursor, tag.end, TokenKind.Payload);
		push(TokenKind.TagEnd, tag.end, tag.end + 1);
	}

	region(0, message.length, TokenKind.Text, toTree(extractTags(message, { parenType, tagLimit })));
	return tokens;
};
