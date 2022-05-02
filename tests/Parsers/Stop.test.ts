import { StopParser, Interpreter } from '../../src';

describe('StopParser', () => {
	const ts = new Interpreter(new StopParser());

	test('GIVEN a predefined input then using stop THEN reset the complete output body', async () => {
		expect((await ts.run('Hi, {stop(12==12):Hello World}')).body).toStrictEqual('Hi,  Hello World');
		expect((await ts.run('Hi, {stop(12==12):Hello World} Hi')).body).toStrictEqual('Hi,  Hello World');
		expect((await ts.run('Hi, {stop(false):Hello World}')).body).toStrictEqual('Hi,');
	});
});
