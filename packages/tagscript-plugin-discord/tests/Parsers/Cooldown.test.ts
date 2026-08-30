import { describe, expect, test } from 'bun:test';

import { Interpreter } from 'tagscript';

import { CooldownParser } from '../../src';

const ts = new Interpreter(new CooldownParser());

describe('CooldownParser', () => {
	test.each(['cooldown', 'cd'])('GIVEN the alias %s THEN record the cooldown', async (alias) => {
		expect((await ts.run(`{${alias}(5):You are in cd}`)).actions).toStrictEqual({
			cooldown: { cooldown: 5, message: 'You are in cd' },
		});
	});

	test('GIVEN a cooldown tag THEN render nothing in its place', async () => {
		expect((await ts.run('before {cd(5):wait} after')).body).toBe('before  after');
	});

	test('GIVEN no payload THEN record a null message', async () => {
		expect((await ts.run('{cd(5)}')).actions).toStrictEqual({
			cooldown: { cooldown: 5, message: null },
		});
	});

	test('GIVEN no parameter THEN leave the tag untouched, since the parameter is required', async () => {
		expect((await ts.run('{cd}')).body).toBe('{cd}');
		expect((await ts.run('{cd}')).actions).toStrictEqual({});
	});

	test('GIVEN a decimal parameter THEN keep only the integer part', async () => {
		expect((await ts.run('{cd(5.9):wait}')).actions.cooldown?.cooldown).toBe(5);
	});

	test('GIVEN a non numeric parameter THEN record NaN for the host to reject', async () => {
		expect((await ts.run('{cd(soon):wait}')).actions.cooldown?.cooldown).toBeNaN();
	});

	test('GIVEN a placeholder in the payload THEN keep it unrendered for the host to fill', async () => {
		expect((await ts.run('{cd(5):Try again in {retryAfter}.}')).actions.cooldown?.message).toBe(
			'Try again in {retryAfter}.',
		);
	});

	test('GIVEN two cooldown tags THEN the last one wins', async () => {
		expect((await ts.run('{cd(5):first}{cd(10):second}')).actions.cooldown).toStrictEqual({
			cooldown: 10,
			message: 'second',
		});
	});
});
