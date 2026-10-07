import { describe, expect, test } from 'vitest';

import { readTag, toSource } from '../src';

describe('readTag', () => {
	test.each([
		['{name}', { name: 'name', parameter: null, source: '{name}' }],
		['{name(first)} and more', { name: 'name', parameter: 'first', source: '{name(first)}' }],
		['{100}', { name: '100', parameter: null, source: '{100}' }],
	])('GIVEN %j THEN read a chip', (text, expected) => {
		expect(readTag(text)).toEqual(expected);
	});

	test.each(['name}', '{name', '{}', '{ name }', '{name:}', '{if(a):b}', '{a{b}', '{"x": 1}'])(
		'GIVEN %j THEN read nothing',
		(text) => {
			expect(readTag(text)).toBeNull();
		},
	);
});

describe('toSource', () => {
	test('GIVEN attributes THEN write the tag back out', () => {
		expect(toSource({ name: 'name', parameter: null })).toBe('{name}');
		expect(toSource({ name: 'name', parameter: 'first' })).toBe('{name(first)}');
	});
});
