import { describe, expect, test } from 'bun:test';

import { Colors, resolveColor } from '../../src';

describe('ResolveColor', () => {
	test('GIVEN a color name THEN return valid hex code', () => {
		expect(resolveColor('Red')).toBe(0xed_42_45);
		expect(resolveColor('Default')).toBe(0);
	});

	test('GIVEN a hex code starts with # THEN return valid hex code', () => {
		expect(resolveColor('#FF0000')).toBe(0xff_00_00);
	});

	test('GIVEN a hex code starts with 0x THEN return valid hex code', () => {
		expect(resolveColor('0xFF0000')).toBe(0xff_00_00);
	});

	test('GIVEN a bare hex code THEN return valid hex code', () => {
		expect(resolveColor('ed4245')).toBe(0xed_42_45);
	});

	test('GIVEN a decimal string THEN return the number', () => {
		expect(resolveColor('3650251')).toBe(3_650_251);
	});

	test('GIVEN a number THEN return it untouched', () => {
		expect(resolveColor(0xed_42_45)).toBe(0xed_42_45);
	});

	test('GIVEN Random THEN return a color in range', () => {
		const color = resolveColor('Random') as number;

		expect(color).toBeGreaterThanOrEqual(0);
		expect(color).toBeLessThanOrEqual(0xff_ff_ff);
	});

	test('GIVEN an invalid color THEN return the input', () => {
		expect(resolveColor('invalid')).toBe('invalid');
		expect(resolveColor('')).toBe('');
		expect(resolveColor('toString')).toBe('toString');
		expect(resolveColor('99999999')).toBe('99999999');
	});

	test('GIVEN the Colors record THEN match the Discord palette', () => {
		expect(Colors.Blurple).toBe(0x58_65_f2);
	});
});
