import { BreakParser, Interpreter } from '../../src';

describe('BreakParser', () => {
	const ts = new Interpreter(new BreakParser());

	test('GIVEN a predefined input then using break THEN reset the output body', async () => {
		expect((await ts.run('Hi, {break(12==12):Hello World}')).body).toStrictEqual('Hello World');
		expect((await ts.run('Hi, {break(false):Hello World}')).body).toStrictEqual('Hi,');
		expect((await ts.run('Hi, {break(true)}')).body).toStrictEqual('');
	});
});
