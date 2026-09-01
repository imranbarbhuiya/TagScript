import { describe, expect, test } from 'bun:test';

import { IncludesParser, Interpreter, Response } from '../../src';
import { rendered } from '../rendered';

const ts = new Interpreter(new IncludesParser());
describe('IncludesParser', () => {
	test('GIVEN a string THEN check if a substring exist in that string', async () => {
		const text1 = '{in(hi):Hello Parbez!}';
		expect(rendered(await ts.run(text1))).toStrictEqual(rendered(new Response().setValues('false', text1)));

		const text2 = '{includes(Parbez):Hello Parbez!}';
		expect(rendered(await ts.run(text2))).toStrictEqual(rendered(new Response().setValues('true', text2)));
	});

	test('GIVEN a string THEN strictly check if a substring exist in that string', async () => {
		const text1 = '{contain(hi):Hello Parbez!}';
		expect(rendered(await ts.run(text1))).toStrictEqual(rendered(new Response().setValues('false', text1)));

		const text2 = '{contain(Parbez!):Hello Parbez!}';
		expect(rendered(await ts.run(text2))).toStrictEqual(rendered(new Response().setValues('true', text2)));

		const text3 = '{contain(Parbez):Hello Parbez!}';
		expect(rendered(await ts.run(text3))).toStrictEqual(rendered(new Response().setValues('false', text3)));
	});

	test('GIVEN a string THEN give index of the parameter from payload slitted with space', async () => {
		const text1 = '{index(hi):Hello Parbez!}';
		expect(rendered(await ts.run(text1))).toStrictEqual(rendered(new Response().setValues('-1', text1)));

		const text2 = '{index(Parbez!):Hello Parbez!}';
		expect(rendered(await ts.run(text2))).toStrictEqual(rendered(new Response().setValues('1', text2)));
	});

	test('GIVEN a string THEN give index of the parameter from payload', async () => {
		const text1 = '{lindex(hi):Hello Parbez!}';
		expect(rendered(await ts.run(text1))).toStrictEqual(rendered(new Response().setValues('-1', text1)));

		const text2 = '{lindex(Parbez):Hello Parbez!}';
		expect(rendered(await ts.run(text2))).toStrictEqual(rendered(new Response().setValues('6', text2)));
	});
});

describe('IncludesParser index positions', () => {
	test('GIVEN index and lindex THEN return the word index and the character index', async () => {
		expect((await ts.run('{index(there!):Hi there!}')).body).toBe('1');
		expect((await ts.run('{lindex(t):Hi there!}')).body).toBe('3');
	});
});
