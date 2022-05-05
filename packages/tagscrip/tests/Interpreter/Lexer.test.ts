import { Lexer, ParenType } from '../../src';

describe('ParenType.Both', () => {
	const text1 = '{embed.title:Hello world}';
	const text2 = '{embed(title):Hello world}';
	const result1 = new Lexer(text1);
	const result2 = new Lexer(text2);
	test('GIVEN a string in dot or paren form THEN give result for both', () => {
		expect(result1.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title',
			payload: 'Hello world',
			usedParenType: ParenType.Dot
		});

		expect(result2.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title',
			payload: 'Hello world',
			usedParenType: ParenType.Parenthesis
		});
	});

	test('GIVEN a string in dot or paren form THEN toString should return the original input', () => {
		expect(result1.toString()).toStrictEqual(text1);
		expect(result2.toString()).toStrictEqual(text2);
	});

	test('GIVEN a string in dot or paren form THEN all all the properties should be same', () => {
		expect(result1.declaration).toStrictEqual(result2.declaration);
		expect(result1.parameter).toStrictEqual(result2.parameter);
		expect(result1.payload).toStrictEqual(result2.payload);
	});
});

describe('ParenType.Dot', () => {
	test('GIVEN a string in dot form THEN parse only dot form and not paren', () => {
		const text = '{embed.title:Hello world}';
		const result = new Lexer(text, 2000, ParenType.Dot);
		expect(result.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title',
			payload: 'Hello world',
			usedParenType: ParenType.Dot
		});

		const textP = '{embed(title):Hello world}';
		const resultP = new Lexer(textP, 2000, ParenType.Dot);
		expect(resultP.parameter).not.toStrictEqual('title');

		expect(result.toString()).toStrictEqual(text);
	});
});

describe('ParenType.Parenthesis', () => {
	test('GIVEN a string in paren form THEN parse only paren form and not dot', () => {
		const text = '{embed(title):Hello world}';
		const result = new Lexer(text, 2000, ParenType.Parenthesis);
		expect(result.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title',
			payload: 'Hello world',
			usedParenType: ParenType.Parenthesis
		});

		const textD = '{embed.title:Hello world}';
		const resultD = new Lexer(textD, 2000, ParenType.Parenthesis);

		expect(resultD.parameter).not.toStrictEqual('title');

		expect(result.toString()).toStrictEqual(text);
	});
});

describe('Escape', () => {
	test('GIVEN a string with escape character THEN escape that character while parsing', () => {
		const text = '{embed\\.title.description:Hello world}';
		const result = new Lexer(text);
		expect(result.toJSON()).toStrictEqual({
			declaration: 'embed\\.title',
			parameter: 'description',
			payload: 'Hello world',
			usedParenType: ParenType.Dot
		});

		expect(result.toString()).toStrictEqual(text);
	});
});

describe('decDepth', () => {
	test('GIVEN two open parameter THEN respect paren closing', () => {
		const text = '{embed(title(description)):Hello world}';
		const result = new Lexer(text);
		expect(result.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title(description)',
			payload: 'Hello world',
			usedParenType: ParenType.Parenthesis
		});
	});

	test('GIVEN two types of open parameter THEN respect paren closing', () => {
		const text = '{embed(title.description)):Hello world}';
		const result = new Lexer(text);
		expect(result.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title.description',
			payload: 'Hello world',
			usedParenType: ParenType.Parenthesis
		});

		const text2 = '{embed.title.description:Hello world}';
		const result2 = new Lexer(text2);
		expect(result2.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title.description',
			payload: 'Hello world',
			usedParenType: ParenType.Dot
		});

		const text3 = '{embed.title.description}';
		const result3 = new Lexer(text3);
		expect(result3.toJSON()).toStrictEqual({
			declaration: 'embed',
			parameter: 'title.description',
			payload: null,
			usedParenType: ParenType.Dot
		});
	});
});
