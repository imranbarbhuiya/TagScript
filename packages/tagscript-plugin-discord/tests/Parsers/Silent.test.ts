import { describe, expect, test } from 'bun:test';

import { Interpreter } from 'tagscript';

import { SilentParser } from '../../src';

const ts = new Interpreter(new SilentParser());

describe('SilentParser', () => {
	test('GIVEN a silent tag THEN record the action', async () => {
		expect((await ts.run('{silent}')).actions).toStrictEqual({ silentResponse: true });
	});

	test('GIVEN a silent tag THEN render nothing in its place', async () => {
		expect((await ts.run('before {silent} after')).body).toBe('before  after');
	});

	test('GIVEN no silent tag THEN record no action', async () => {
		expect((await ts.run('nothing here')).actions).toStrictEqual({});
	});

	test('GIVEN the tag twice THEN the action stays true', async () => {
		expect((await ts.run('{silent}{silent}')).actions).toStrictEqual({ silentResponse: true });
	});

	test('GIVEN an unrelated tag THEN leave it untouched', async () => {
		expect((await ts.run('{quiet}')).body).toBe('{quiet}');
	});
});
