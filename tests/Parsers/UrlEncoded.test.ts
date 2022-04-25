import { Interpreter, Response, UrlEncodeParser } from '../../src';
const ts = new Interpreter(new UrlEncodeParser());
describe('UrlEncodedParser', () => {
	test('Given a string in UrlEncoded parser THEN returns the urlencoded string', async () => {
		expect(await ts.run('{urlencode:This is Rkn}')).toStrictEqual(
			new Response().setValues(encodeURI('This is Rkn'), '{urlencode:This is Rkn}'),
		);
	});
});
