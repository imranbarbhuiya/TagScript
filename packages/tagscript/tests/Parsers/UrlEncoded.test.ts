import { Interpreter, Response, UrlDecodeParser, UrlEncodeParser } from '../../src';

const ts = new Interpreter(new UrlEncodeParser(), new UrlDecodeParser());

describe('UrlEncodedParser', () => {
	test('GIVEN a string in UrlEncode parser THEN returns the urlencoded string', async () => {
		const text = '{urlencode:This is Rkn}';
		expect(await ts.run(text)).toStrictEqual(new Response().setValues('This%20is%20Rkn', text));
	});

	test('GIVEN a string in UrlEncode parser with + param THEN returns the urlencoded string by replacing space with +', async () => {
		const text = '{urlencode(+):This is Rkn}';
		expect(await ts.run(text)).toStrictEqual(new Response().setValues('This+is+Rkn', text));
	});
});

describe('UrlDecodedParser', () => {
	test('GIVEN a string in UrlDecode parser THEN returns the urldecoded string', async () => {
		const text = '{urldecode:This%20is%20Rkn}';
		expect(await ts.run(text)).toStrictEqual(new Response().setValues('This is Rkn', text));
	});

	test('GIVEN a string in UrlDecode parser with + param THEN returns the urldecoded string by replacing + with space', async () => {
		const text = '{urldecode(+):This+is+Rkn}';
		expect(await ts.run(text)).toStrictEqual(new Response().setValues('This is Rkn', text));
	});
});
