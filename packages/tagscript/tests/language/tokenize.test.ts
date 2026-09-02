import { describe, expect, test } from 'bun:test';

import { ParenType, builtinTags } from '../../src';
import { TokenKind, tokenize } from '../../src/language';

/**
 *
 * Renders a token run as kind and text, which is what these assertions are about.
 *
 * @param message - The template that was read.
 * @returns
 */
const shape = (message: string, tags?: typeof builtinTags) =>
	tokenize(message, tags && { tags }).map((token) => [token.kind, message.slice(token.start, token.end)]);

describe('tokenize', () => {
	test('GIVEN any template THEN the tokens are contiguous and cover all of it', () => {
		for (const message of ['Hi {upper:{lower:a}} there', '{if({a}==1):x|y}', 'plain', '\\{x\\}', '{a', '']) {
			const tokens = tokenize(message);
			let cursor = 0;
			for (const token of tokens) {
				expect(token.start).toBe(cursor);
				cursor = token.end;
			}

			expect(cursor).toBe(message.length);
		}
	});

	test('GIVEN a simple tag THEN name each part', () => {
		expect(shape('Hi {upper:there}')).toStrictEqual([
			[TokenKind.Text, 'Hi '],
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'upper'],
			[TokenKind.Colon, ':'],
			[TokenKind.Payload, 'there'],
			[TokenKind.TagEnd, '}'],
		]);
	});

	test('GIVEN a parenthesised parameter THEN mark both delimiters', () => {
		expect(shape('{upper(2):hi}')).toStrictEqual([
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'upper'],
			[TokenKind.ParameterStart, '('],
			[TokenKind.Parameter, '2'],
			[TokenKind.ParameterEnd, ')'],
			[TokenKind.Colon, ':'],
			[TokenKind.Payload, 'hi'],
			[TokenKind.TagEnd, '}'],
		]);
	});

	test('GIVEN a dot parameter THEN mark the dot, which has no closing delimiter', () => {
		expect(shape('{upper.2:hi}')).toStrictEqual([
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'upper'],
			[TokenKind.ParameterStart, '.'],
			[TokenKind.Parameter, '2'],
			[TokenKind.Colon, ':'],
			[TokenKind.Payload, 'hi'],
			[TokenKind.TagEnd, '}'],
		]);
	});

	test('GIVEN a tag inside a payload THEN read it as a tag, not as payload text', () => {
		expect(shape('{upper:{lower:ABC}}')).toStrictEqual([
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'upper'],
			[TokenKind.Colon, ':'],
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'lower'],
			[TokenKind.Colon, ':'],
			[TokenKind.Payload, 'ABC'],
			[TokenKind.TagEnd, '}'],
			[TokenKind.TagEnd, '}'],
		]);
	});

	test('GIVEN a tag inside a parameter THEN read it there too', () => {
		expect(shape('{if({args}==63):yes}')).toStrictEqual([
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'if'],
			[TokenKind.ParameterStart, '('],
			[TokenKind.TagStart, '{'],
			[TokenKind.Declaration, 'args'],
			[TokenKind.TagEnd, '}'],
			[TokenKind.Parameter, '==63'],
			[TokenKind.ParameterEnd, ')'],
			[TokenKind.Colon, ':'],
			[TokenKind.Payload, 'yes'],
			[TokenKind.TagEnd, '}'],
		]);
	});

	test('GIVEN an escape THEN mark the backslash and what it takes literally', () => {
		expect(shape('Use \\{braces\\} here')).toStrictEqual([
			[TokenKind.Text, 'Use '],
			[TokenKind.Escape, '\\{'],
			[TokenKind.Text, 'braces'],
			[TokenKind.Escape, '\\}'],
			[TokenKind.Text, ' here'],
		]);
	});

	test('GIVEN an unterminated brace THEN it is text, as the interpreter treats it', () => {
		expect(shape('{a')).toStrictEqual([[TokenKind.Text, '{a']]);
	});

	test('GIVEN no manifest THEN say nothing about whether a tag exists', () => {
		for (const token of tokenize('{naem}')) expect(token.known).toBeUndefined();
	});

	test('GIVEN a manifest THEN mark each declaration as known or not', () => {
		const tokens = tokenize('{upper:a}{naem}', { tags: builtinTags });
		const declarations = tokens.filter((token) => token.kind === TokenKind.Declaration);
		expect(declarations.map((token) => token.known)).toStrictEqual([true, false]);
	});

	test('GIVEN a parameter syntax THEN honour it, so what is read matches what would render', () => {
		expect(shape('{a.b}', undefined)).toContainEqual([TokenKind.Parameter, 'b']);
		expect(tokenize('{a.b}', { parenType: ParenType.Parenthesis }).map((token) => token.kind)).not.toContain(
			TokenKind.Parameter,
		);
	});

	test('GIVEN a token THEN it carries a TextMate scope, so a theme can colour it', () => {
		const [, tagStart] = tokenize('Hi {a}');
		expect(tagStart.scope).toBe('punctuation.definition.tag.begin.tagscript');
	});
});
