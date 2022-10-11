import { resolveColor } from '../../src';

describe('ResolveColor', () => {
	test('GIVEN a color name THEN return valid hex code', () => {
		expect(resolveColor('Red')).toBe(0xed4245);
	});

	test('GIVEN a hex code starts with # THEN return valid hex code', () => {
		expect(resolveColor('#FF0000')).toBe(0xff0000);
	});

	test('GIVEN a hex code starts with 0x THEN return valid hex code', () => {
		expect(resolveColor('0xFF0000')).toBe(0xff0000);
	});

	test('GIVEN an invalid color THEN return the input', () => {
		expect(resolveColor('invalid')).toBe('invalid');
	});
});
