import { describe, expect, test } from 'bun:test';

import { createHighlighter } from 'shiki';

import { SCOPES, TokenKind, grammar, tokenize } from '../../src/language';

import type { LanguageRegistration } from 'shiki';

/**
 * Templates the grammar and the lexer both have to agree on.
 *
 * Two implementations of one language drift. The answer is not to keep only one, since a VS Code
 * extension needs the grammar and an editor needs the lexer, but to fail the build when they stop
 * matching.
 */
const CORPUS = [
	'plain text with no tags',
	'Hi {upper:there}',
	'{user}',
	'{upper(2):hi}',
	'{upper.2:hi}',
	'{=(name):value}',
	'{5050:heads}',
	'a {upper:{lower:ABC}} b',
	'{if({args}==63):yes|no}',
	'Use \\{braces\\} here',
	'{a}{b}',
	'{embed(title):Rules of the server}',
	'{range:1-10} and {random:a,b,c}',
	'trailing text {stop(1==1):done}',
];

const highlighter = await createHighlighter({
	langs: [grammar as unknown as LanguageRegistration],
	themes: ['github-dark'],
});

/**
 *
 * Reduces a token run to the scope covering each character, so the two can be compared without
 * caring where either chose to split a run of identical scopes.
 *
 * @param length - How long the template is.
 * @param spans - The scoped ranges to lay down.
 * @returns
 */
const perCharacter = (length: number, spans: { end: number; scope: string; start: number }[]): string[] => {
	const scopes = Array.from({ length }, () => SCOPES[TokenKind.Text]);
	for (const span of spans) {
		for (let index = span.start; index < span.end; index++) scopes[index] = span.scope;
	}

	return scopes;
};

/**
 *
 * Reads a template through the grammar and reports the tagscript scope on each character.
 *
 * @param template - The template to read.
 * @returns
 */
const fromGrammar = (template: string): string[] => {
	const { tokens } = highlighter.codeToTokens(template, {
		lang: 'tagscript',
		theme: 'github-dark',
		includeExplanation: 'scopeName',
	});
	const spans: { end: number; scope: string; start: number }[] = [];
	let offset = 0;
	for (const lineTokens of tokens) {
		for (const token of lineTokens) {
			// One shiki token can cover several scope stacks, so the explanation is what to walk.
			for (const part of token.explanation ?? [{ content: token.content, scopes: [] }]) {
				const scope = part.scopes.at(-1)?.scopeName ?? SCOPES[TokenKind.Text];
				spans.push({ start: offset, end: offset + part.content.length, scope });
				offset += part.content.length;
			}
		}
	}

	return perCharacter(template.length, spans);
};

describe('grammar and lexer conformance', () => {
	test.each(CORPUS)('GIVEN %p THEN the grammar scopes every character the way the lexer does', (template) => {
		const fromLexer = perCharacter(
			template.length,
			tokenize(template).map((token) => ({ start: token.start, end: token.end, scope: token.scope })),
		);

		expect(fromGrammar(template)).toStrictEqual(fromLexer);
	});
});

describe('grammar', () => {
	test('GIVEN the grammar THEN it is a usable TextMate grammar with our scope name', () => {
		expect(grammar.scopeName).toBe('source.tagscript');
		expect(grammar.name).toBe('tagscript');
		expect(grammar.displayName).toBe('TagScript');
	});
});
