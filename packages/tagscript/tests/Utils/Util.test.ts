import { describe, expect, test } from 'bun:test';

import { asyncFilter, escapeContent, implicitBool, parseIf, parseListIf, split } from '../../src';

describe('asyncFilter', () => {
	test('GIVEN an async predicate THEN drop the values it rejects', async () => {
		expect(await asyncFilter([1, 2, 3, 4], async (value) => value % 2 === 0)).toStrictEqual([2, 4]);
	});

	test('GIVEN a sync predicate THEN work the same', async () => {
		expect(await asyncFilter([1, 2, 3, 4], (value) => value > 2)).toStrictEqual([3, 4]);
	});

	test('GIVEN an empty array THEN return an empty array', async () => {
		expect(await asyncFilter([], () => true)).toStrictEqual([]);
	});

	test('GIVEN a predicate that rejects everything THEN return an empty array', async () => {
		expect(await asyncFilter([1, 2], () => false)).toStrictEqual([]);
	});

	test('GIVEN slow and fast predicates THEN preserve the input order', async () => {
		const delay = async (ms: number) =>
			new Promise((resolve) => {
				setTimeout(resolve, ms);
			});

		const result = await asyncFilter([1, 2, 3], async (value) => {
			if (value === 1) await delay(5);
			return true;
		});

		expect(result).toStrictEqual([1, 2, 3]);
	});
});

describe('escapeContent', () => {
	test.each([
		['every special character', '|():{}', '\\|\\(\\)\\:\\{\\}'],
		['an already escaped character', '|(\\)', '\\|\\(\\)'],
		['no special characters', 'hello world', 'hello world'],
		['an empty string', '', ''],
		['a tag', '{if(1<2):yes}', '\\{if\\(1<2\\)\\:yes\\}'],
	])('GIVEN %s THEN escape it', (_label, input, expected) => {
		expect(escapeContent(input)).toBe(expected);
	});
});

describe('implicitBool', () => {
	test.each([
		['true', true],
		['false', false],
		['TRUE', true],
		['False', false],
	])('GIVEN %s THEN return the boolean', (input, expected) => {
		expect(implicitBool(input)).toBe(expected);
	});

	test.each(['test', '', '1', '0', 'yes'])('GIVEN the non-boolean %s THEN return null', (input) => {
		expect(implicitBool(input)).toBeNull();
	});
});

describe('parseIf', () => {
	test.each([
		['a true literal', 'true', true],
		['a false literal', 'false', false],
	])('GIVEN %s THEN return it', (_label, input, expected) => {
		expect(parseIf(input)).toBe(expected);
	});

	test.each([
		['inequality, differing', 'a!=b', true],
		['inequality, matching', 'a!=a', false],
		['equality, matching', 'a==a', true],
		['equality, differing', 'a==b', false],
		['equality ignoring surrounding space', ' a == a ', true],
	])('GIVEN %s THEN return %s', (_label, input, expected) => {
		expect(parseIf(input)).toBe(expected);
	});

	test.each([
		['greater or equal, equal', '5>=5', true],
		['greater or equal, greater', '6>=5', true],
		['greater or equal, less', '4>=5', false],
		['less or equal, equal', '3<=3', true],
		['less or equal, less', '2<=3', true],
		['less or equal, greater', '4<=3', false],
		['greater than, true', '3>1', true],
		['greater than, false', '1>3', false],
		['less than, true', '1<3', true],
		['less than, false', '3<1', false],
		['decimals', '1.5>1.2', true],
	])('GIVEN %s THEN return %s', (_label, input, expected) => {
		expect(parseIf(input)).toBe(expected);
	});

	test('GIVEN a bare string with no operator THEN treat it as true', () => {
		expect(parseIf('hello')).toBe(true);
	});

	test('GIVEN a comparison of non-numbers THEN return false, since NaN compares false', () => {
		expect(parseIf('a>b')).toBe(false);
	});

	test('GIVEN >= THEN prefer it over the bare > it contains', () => {
		expect(parseIf('5>=6')).toBe(false);
	});
});

describe('parseListIf', () => {
	test('GIVEN a single expression THEN return one result', () => {
		expect(parseListIf('1<2')).toStrictEqual([true]);
	});

	test('GIVEN pipe separated expressions THEN evaluate each of them', () => {
		expect(parseListIf('1<2|3<2|a==a')).toStrictEqual([true, false, true]);
	});

	test('GIVEN literals THEN evaluate each of them', () => {
		expect(parseListIf('true|false')).toStrictEqual([true, false]);
	});

	test('GIVEN an escaped pipe THEN do not split on it', () => {
		expect(parseListIf('a\\|b==a\\|b')).toStrictEqual([true]);
	});
});

describe('split', () => {
	describe('default, pipe only', () => {
		test('GIVEN pipes THEN split on them', () => {
			expect(split('a|b|c')).toStrictEqual(['a', 'b', 'c']);
		});

		test('GIVEN commas THEN do not split', () => {
			expect(split('a,b,c')).toStrictEqual(['a,b,c']);
		});

		test('GIVEN tildes THEN do not split', () => {
			expect(split('a~c')).toStrictEqual(['a~c']);
		});

		test('GIVEN an escaped pipe THEN keep it in one piece', () => {
			expect(split('a|b\\|c')).toStrictEqual(['a', 'b\\|c']);
		});

		test('GIVEN no separator THEN return the whole string', () => {
			expect(split('abc')).toStrictEqual(['abc']);
		});
	});

	describe('extended', () => {
		test('GIVEN commas THEN split on them', () => {
			expect(split('a,b,c', true)).toStrictEqual(['a', 'b', 'c']);
		});

		test('GIVEN tildes THEN split on them', () => {
			expect(split('a~b', true)).toStrictEqual(['a', 'b']);
		});

		test('GIVEN pipes THEN split on them', () => {
			expect(split('a|b|c', true)).toStrictEqual(['a', 'b', 'c']);
		});

		test('GIVEN both tildes and commas THEN prefer the tilde', () => {
			expect(split('a~b,c', true)).toStrictEqual(['a', 'b,c']);
		});

		test('GIVEN both commas and pipes THEN prefer the comma', () => {
			expect(split('a,b|c', true)).toStrictEqual(['a', 'b|c']);
		});
	});
});
