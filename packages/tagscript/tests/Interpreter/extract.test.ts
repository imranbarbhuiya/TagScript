import { describe, expect, test } from 'bun:test';

import { Lexer, ParenType, extractTags } from '../../src';

describe('Lexer#spans', () => {
	const slice = (input: string, span: { start: number; end: number } | null) =>
		span === null ? null : input.slice(span.start, span.end);

	test.each([
		'{upper:hello}',
		'{upper(2):hi}',
		'{upper.2:hi}',
		'{user}',
		'{=(name):value}',
		'{if({args}==):No input.}',
		'{range:1-10}',
	])('GIVEN %p THEN every span slices out the part the lexer reported', (input) => {
		const lexer = new Lexer(input);
		expect(slice(input, lexer.spans.declaration)).toBe(lexer.declaration);
		expect(slice(input, lexer.spans.parameter)).toBe(lexer.parameter);
		expect(slice(input, lexer.spans.payload)).toBe(lexer.payload);
	});

	test('GIVEN a tag with no parameter or payload THEN those spans are null', () => {
		expect(new Lexer('{user}').spans).toStrictEqual({
			declaration: { start: 1, end: 5 },
			parameter: null,
			payload: null,
		});
	});
});

describe('extractTags', () => {
	test('GIVEN a template with no tags THEN find nothing', () => {
		expect(extractTags('plain text')).toStrictEqual([]);
	});

	test('GIVEN nested tags THEN report them in document order with their depth', () => {
		const tags = extractTags('Hi {upper:{lower:ABC}}');
		expect(tags.map((tag) => [tag.tag.declaration, tag.depth])).toStrictEqual([
			['upper', 0],
			['lower', 1],
		]);
	});

	test('GIVEN nested tags THEN order reflects that the interpreter runs innermost first', () => {
		const tags = extractTags('Hi {upper:{lower:ABC}}');
		expect(tags.map((tag) => [tag.tag.declaration, tag.order])).toStrictEqual([
			['upper', 1],
			['lower', 0],
		]);
	});

	test('GIVEN a tag THEN start and end bracket the whole tag', () => {
		const template = 'Hi {upper:there}!';
		const [tag] = extractTags(template);
		expect(template.slice(tag.start, tag.end + 1)).toBe('{upper:there}');
	});

	test('GIVEN a tag THEN spans are offsets into the template, not into the tag', () => {
		const template = 'Hi {upper(2):there}!';
		const [tag] = extractTags(template);
		expect(template.slice(tag.spans.declaration!.start, tag.spans.declaration!.end)).toBe('upper');
		expect(template.slice(tag.spans.parameter!.start, tag.spans.parameter!.end)).toBe('2');
		expect(template.slice(tag.spans.payload!.start, tag.spans.payload!.end)).toBe('there');
	});

	test('GIVEN an escaped brace THEN it is not a tag', () => {
		expect(extractTags('Use \\{braces\\} to write a tag')).toStrictEqual([]);
	});

	test('GIVEN an unterminated brace THEN it is not a tag', () => {
		expect(extractTags('Hi {upper')).toStrictEqual([]);
	});

	test('GIVEN a parameter syntax THEN honour it, as a render would', () => {
		expect(extractTags('{a.b}', { parenType: ParenType.Dot })[0].tag.parameter).toBe('b');
		expect(extractTags('{a.b}', { parenType: ParenType.Parenthesis })[0].tag.parameter).toBeNull();
	});
});
