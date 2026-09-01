import { describe, expect, test } from 'bun:test';

import { Interpreter, Response, TemplateError, UrlDecodeParser, UrlEncodeParser } from '../../src';
import { rendered } from '../rendered';

const ts = new Interpreter(new UrlEncodeParser(), new UrlDecodeParser());

describe('UrlEncodedParser', () => {
	test('GIVEN a string in UrlEncode parser THEN returns the urlencoded string', async () => {
		const text = '{urlencode:This is Rkn}';
		expect(rendered(await ts.run(text))).toStrictEqual(rendered(new Response().setValues('This%20is%20Rkn', text)));
	});

	test('GIVEN a string in UrlEncode parser with + param THEN returns the urlencoded string by replacing space with +', async () => {
		const text = '{urlencode(+):This is Rkn}';
		expect(rendered(await ts.run(text))).toStrictEqual(rendered(new Response().setValues('This+is+Rkn', text)));
	});
});

describe('UrlDecodedParser', () => {
	test('GIVEN a string in UrlDecode parser THEN returns the urldecoded string', async () => {
		const text = '{urldecode:This%20is%20Rkn}';
		expect(rendered(await ts.run(text))).toStrictEqual(rendered(new Response().setValues('This is Rkn', text)));
	});

	test('GIVEN a string in UrlDecode parser with + param THEN returns the urldecoded string by replacing + with space', async () => {
		const text = '{urldecode(+):This+is+Rkn}';
		expect(rendered(await ts.run(text))).toStrictEqual(rendered(new Response().setValues('This is Rkn', text)));
	});

	test('GIVEN a malformed escape THEN report it as a TemplateError', async () => {
		const response = await ts.run('{urldecode:%zz}');

		expect(response.errors).toHaveLength(1);
		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect(response.body).toBe('urldecode was given a url it cannot decode');
	});
});
