import { describe, expect, test } from 'bun:test';

import { Interpreter } from 'tagscript';

import { DeleteParser } from '../../src';

const ts = new Interpreter(new DeleteParser());

describe('DeleteParser', () => {
	test.each(['delete', 'del'])('GIVEN the alias %s THEN record the action', async (alias) => {
		expect((await ts.run(`{${alias}}`)).actions).toStrictEqual({ deleteMessage: true });
	});

	test('GIVEN a delete tag THEN render nothing in its place', async () => {
		expect((await ts.run('before {delete} after')).body).toBe('before  after');
	});

	test('GIVEN no delete tag THEN record no action', async () => {
		expect((await ts.run('nothing here')).actions).toStrictEqual({});
	});

	test('GIVEN an unrelated tag THEN leave it untouched', async () => {
		expect((await ts.run('{remove}')).body).toBe('{remove}');
	});
});
