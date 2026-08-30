import { describe, expect, test } from 'bun:test';

import { RangeParser, Interpreter } from '../../src';

describe('RangeParser', () => {
	const ts = new Interpreter(new RangeParser());

	test('GIVEN a number random in range tag THEN return a random number from the given numbers', async () => {
		expect((await ts.run('{range:1, 12}')).body).toMatch(/^1|2|3|4|5|6|7|8|9|10|11|12$/);
		expect((await ts.run('{rangef:1.5-3}')).body).toMatch(/^[1-3](?:.\d)?$/);
	});
});

describe('RangeParser bounds', () => {
	const ts = new Interpreter(new RangeParser());

	test('GIVEN a range THEN both ends are reachable and nothing falls outside', async () => {
		const seen = new Set<string>();
		for (let index = 0; index < 500; index++) seen.add((await ts.run('{range:1-3}')).body!);

		expect([...seen].sort((a, b) => Number(a) - Number(b))).toStrictEqual(['1', '2', '3']);
	});

	test('GIVEN a rangef range THEN both ends are reachable', async () => {
		const seen = new Set<string>();
		for (let index = 0; index < 500; index++) seen.add((await ts.run('{rangef:1-2}')).body!);

		expect(seen.has('1')).toBe(true);
		expect(seen.has('2')).toBe(true);
		expect([...seen].every((value) => Number(value) >= 1 && Number(value) <= 2)).toBe(true);
	});
});
