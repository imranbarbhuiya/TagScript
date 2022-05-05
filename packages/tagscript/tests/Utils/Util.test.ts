import { asyncFilter, escapeContent, implicitBool, parseIf, split } from '../../src';

describe('asyncFilter', () => {
	test('GIVEN async tasks in AsyncFilter THEN filter out all Promise<false>', async () => {
		// eslint-disable-next-line @typescript-eslint/require-await
		const result = await asyncFilter([true, false], async (value) => Boolean(value));
		expect(result).toStrictEqual([true]);
	});
});

describe('escapeContent', () => {
	test('GIVEN content with escape characters THEN return escaped content', () => {
		const content = '|():{}';
		const result = escapeContent(content);
		expect(result).toStrictEqual('\\|\\(\\)\\:\\{\\}');
	});

	test("GIVEN content with already escaped characters THEN don't escape content", () => {
		const content = '|(\\)';
		const result = escapeContent(content);
		expect(result).toStrictEqual('\\|\\(\\)');
	});
});

describe('parseIf', () => {
	test('GIVEN boolean string THEN return parsed value', () => {
		const str = 'true';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});

	test('GIVEN boolean string THEN return parsed value', () => {
		const str = 'false';
		const result = parseIf(str);
		expect(result).toStrictEqual(false);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = 'a!=b';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = 'a==b';
		const result = parseIf(str);
		expect(result).toStrictEqual(false);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = '5>=5';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = '2<=3';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = '3>1';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});

	test('GIVEN boolean expression THEN return parsed value', () => {
		const str = '3<1';
		const result = parseIf(str);
		expect(result).toStrictEqual(false);
	});

	test('GIVEN a const THEN return true', () => {
		const str = 'hello';
		const result = parseIf(str);
		expect(result).toStrictEqual(true);
	});
});

describe('implicitBool', () => {
	test('GIVEN string with implicit boolean THEN return boolean', () => {
		const result1 = implicitBool('true');
		expect(result1).toStrictEqual(true);
		const result2 = implicitBool('false');
		expect(result2).toStrictEqual(false);
	});

	test("GIVEN string which isn't implicit boolean THEN return null", () => {
		const result = implicitBool('test');
		expect(result).toStrictEqual(null);
	});
});

describe('split', () => {
	test('GIVEN string THEN return array of strings', () => {
		const result = split('a,b,c', true);
		expect(result).toStrictEqual(['a', 'b', 'c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a~b', true);
		expect(result).toStrictEqual(['a', 'b', 'c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a,b,c');
		expect(result).toStrictEqual(['a,b,c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a,b,c', false);
		expect(result).toStrictEqual(['a,b,c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a~c', false);
		expect(result).toStrictEqual(['a~c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a|b|c', true);
		expect(result).toStrictEqual(['a', 'b', 'c']);
	});

	test('GIVEN string THEN return array of strings', () => {
		const result = split('a|b\\|c');
		expect(result).toStrictEqual(['a', 'b\\|c']);
	});
});
