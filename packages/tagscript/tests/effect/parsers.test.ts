import { describe, expect, test } from 'bun:test';

import * as Effect from 'effect/Effect';
import * as Random from 'effect/Random';

import { body, run } from './helpers';

import { StringTransformer } from '../../src';
import { Interpreter, TemplateError, builtinParsers, looseVarsParser } from '../../src/effect';

const ts = new Interpreter(...builtinParsers, looseVarsParser);
const seedVariables = { args: new StringTransformer('63') };

const render = async (template: string) => body(ts.run(template, { seedVariables }));

describe('built-in parsers', () => {
	describe('control flow', () => {
		test.each([
			['{if({args}==63):yes|no}', 'yes'],
			['{if({args}==1):yes|no}', 'no'],
			['{any(1<2|3<2):y|n}', 'y'],
			['{any(1>2|3<2):y|n}', 'n'],
			['{all(1<2|3>2):y|n}', 'y'],
			['{all(1<2|3<2):y|n}', 'n'],
		])('GIVEN %s THEN render %s', async (template, expected) => {
			expect(await render(template)).toBe(expected);
		});

		test('GIVEN a break tag whose expression holds THEN the body becomes its payload', async () => {
			expect(await render('{break({args}==63):stopped}tail')).toBe('stopped');
		});

		test('GIVEN a break tag whose expression fails THEN the render continues', async () => {
			expect(await render('{break({args}==1):stopped}tail')).toBe('tail');
		});

		test('GIVEN a stop tag THEN keep what came before and drop the rest', async () => {
			expect(await render('a {stop(true):halt} b')).toBe('a  halt');
		});

		test('GIVEN a stop tag whose expression fails THEN the render continues', async () => {
			expect(await render('a {stop(false):halt} b')).toBe('a  b');
		});
	});

	describe('variables', () => {
		test('GIVEN a defined variable THEN read it back', async () => {
			expect(await render('{=(x):hi}{x}')).toBe('hi');
		});

		test.each(['assign', 'let', 'var'])('GIVEN the alias %s THEN define a variable', async (alias) => {
			expect(await render(`{${alias}(x):hi}{x}`)).toBe('hi');
		});

		test('GIVEN a seeded variable THEN read it', async () => {
			expect(await render('{args}')).toBe('63');
		});

		test('GIVEN an unknown variable THEN leave the tag untouched', async () => {
			expect(await render('{nope}')).toBe('{nope}');
		});

		test('GIVEN a json variable THEN read a nested key', async () => {
			expect(await render('{json(d):{"n":5}}{d.n}')).toBe('5');
		});

		test('GIVEN malformed json THEN raise a TemplateError', async () => {
			const response = await run(ts.run('{json(d):{bad}}'));

			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect(response.body).toBe('json was given something that is not valid JSON');
		});
	});

	describe('strings', () => {
		test.each([
			['{upper:hello}', 'HELLO'],
			['{lower:HeLLo}', 'hello'],
			['{capitalize:hELLO}', 'Hello'],
			['{escape:{a}}', '\\{a\\}'],
			['{ord:1}', '1st'],
			['{ord:2}', '2nd'],
			['{ord:3}', '3rd'],
			['{ord:4}', '4th'],
			['{ord:11}', '11th'],
			['{ord:12}', '12th'],
			['{ord:13}', '13th'],
			['{ord:21}', '21st'],
			['{ord:notanumber}', 'notanumber'],
			['{replace(o,0):foo}', 'f00'],
			['{slice(2):abcdefg}', 'cdefg'],
			['{slice(1-4):abcdefg}', 'bcd'],
			['{slice(1,4):abcdefg}', 'bcd'],
			['{includes(b):abc}', 'true'],
			['{includes(z):abc}', 'false'],
			['{in(b):abc}', 'true'],
			['{contain(b):a b c}', 'true'],
			['{index(b):a b c}', '1'],
			['{lindex(b):abc}', '1'],
			['{urlencode:a b}', 'a%20b'],
			['{urlencode(+):a b}', 'a+b'],
			['{urldecode:a%20b}', 'a b'],
			['{urldecode(+):a+b}', 'a b'],
		])('GIVEN %s THEN render %s', async (template, expected) => {
			expect(await render(template)).toBe(expected);
		});

		test('GIVEN a url it cannot decode THEN raise a TemplateError', async () => {
			const response = await run(ts.run('{urldecode:%zz}'));

			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect(response.body).toBe('urldecode was given a url it cannot decode');
		});
	});

	describe('randomness', () => {
		const seeded = (seed: string, template: string) =>
			run(Random.withSeed(seed)(ts.run(template)).pipe(Effect.map((response) => response.body)));

		test('GIVEN the same seed THEN a render repeats exactly', async () => {
			const template = '{range:1-1000} {random:a,b,c,d,e,f} {rangef:1-10}';

			expect(await seeded('alpha', template)).toBe(await seeded('alpha', template));
		});

		test('GIVEN a different seed THEN the render differs', async () => {
			const template = '{range:1-1000} {range:1-1000} {range:1-1000}';

			expect(await seeded('alpha', template)).not.toBe(await seeded('bravo', template));
		});

		test('GIVEN a random tag THEN pick one of the options', async () => {
			expect(['a', 'b', 'c']).toContain((await render('{random:a,b,c}'))!);
		});

		test.each(['~', ','])('GIVEN options split by %s THEN pick one of them', async (separator) => {
			expect(['a', 'b']).toContain((await render(`{random:a${separator}b}`))!);
		});

		test('GIVEN a range THEN stay within it', async () => {
			const value = Number(await render('{range:5-7}'));

			expect(value).toBeGreaterThanOrEqual(5);
			expect(value).toBeLessThanOrEqual(7);
		});

		test('GIVEN a single point range THEN return that point', async () => {
			expect(await render('{range:7-7}')).toBe('7');
		});

		test('GIVEN rangef THEN return a value to one decimal place', async () => {
			const value = Number(await render('{rangef:1-2}'));

			expect(value).toBeGreaterThanOrEqual(1);
			expect(value).toBeLessThanOrEqual(2);
			expect(Number.isInteger(Math.round(value * 10))).toBe(true);
		});

		test('GIVEN a range that is not numbers THEN raise a TemplateError', async () => {
			const response = await run(ts.run('{range:x-y}'));

			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect(response.body).toContain('needs two numbers');
		});

		test.each(['5050', '50', '?'])('GIVEN the alias %s THEN render the payload or nothing', async (alias) => {
			expect(['', 'heads']).toContain((await render(`{${alias}:heads}`))!);
		});
	});

	describe('required parameters and payloads', () => {
		test.each([
			['{if:no parameter}', '{if:no parameter}'],
			['{replace(a,b)}', '{replace(a,b)}'],
			['{random}', '{random}'],
			['{json(x)}', '{json(x)}'],
		])('GIVEN %s THEN leave the tag untouched', async (template, expected) => {
			expect(await render(template)).toBe(expected);
		});
	});
});
