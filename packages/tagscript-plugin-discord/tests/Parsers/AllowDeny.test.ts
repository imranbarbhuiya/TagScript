import { describe, expect, test } from 'bun:test';

import { Interpreter } from 'tagscript';

import { RequiredParser, DenyParser } from '../../src';

describe('RequiredParser', () => {
	const ts = new Interpreter(new RequiredParser());

	test('GIVEN a require tag THEN return empty string and require info', async () => {
		expect((await ts.run("{require(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			require: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag.",
			},
		});
	});

	test('GIVEN a require tag twice THEN ignore 2nd one', async () => {
		expect((await ts.run('{require(757164765582721054)} {require(758880890159235083)}')).actions).toStrictEqual({
			require: {
				ids: ['757164765582721054'],
				message: null,
			},
		});
	});
});

describe('DenyParser', () => {
	const ts = new Interpreter(new DenyParser());

	test('GIVEN a deny tag THEN return empty string and deny info', async () => {
		expect((await ts.run("{deny(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			deny: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag.",
			},
		});
	});

	test('GIVEN a deny tag twice THEN ignore 2nd one', async () => {
		expect((await ts.run('{deny(757164765582721054)} {deny(758880890159235083)}')).actions).toStrictEqual({
			deny: {
				ids: ['757164765582721054'],
				message: null,
			},
		});
	});
});

describe('RequiredParser and DenyParser, shared behaviour', () => {
	test.each([
		['require', new RequiredParser()],
		['deny', new DenyParser()],
	])('GIVEN a %s tag THEN render nothing in its place', async (name, parser) => {
		const ts = new Interpreter(parser);

		expect((await ts.run(`before {${name}(1)} after`)).body).toBe('before  after');
	});

	test.each([
		['require', new RequiredParser()],
		['deny', new DenyParser()],
	])('GIVEN several ids in a %s tag THEN record each of them', async (name, parser) => {
		const ts = new Interpreter(parser);
		const actions = (await ts.run(`{${name}(1,2,3):no}`)).actions;

		expect(actions[name as 'deny' | 'require']?.ids).toStrictEqual(['1', '2', '3']);
	});

	test.each([
		['require', new RequiredParser()],
		['deny', new DenyParser()],
	])('GIVEN no parameter in a %s tag THEN leave it untouched', async (name, parser) => {
		const ts = new Interpreter(parser);

		expect((await ts.run(`{${name}}`)).body).toBe(`{${name}}`);
	});

	test('GIVEN both a require and a deny tag THEN record both actions', async () => {
		const ts = new Interpreter(new RequiredParser(), new DenyParser());
		const actions = (await ts.run('{require(1):members only}{deny(2):not you}')).actions;

		expect(actions.require).toStrictEqual({ ids: ['1'], message: 'members only' });
		expect(actions.deny).toStrictEqual({ ids: ['2'], message: 'not you' });
	});
});
