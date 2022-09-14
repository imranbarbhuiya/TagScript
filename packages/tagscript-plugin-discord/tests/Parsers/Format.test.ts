import { Interpreter } from 'tagscript';
import { DateFormatParser } from '../../src';

const ts = new Interpreter(new DateFormatParser());
describe('currentTime', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});
	test('GIVEN currentTime or unix THEN return current timestamp in ms', async () => {
		const mockedDate = new Date(2022, 1, 1, 13);
		vi.setSystemTime(mockedDate);
		expect(Number((await ts.run('{unix}')).body)).toBeCloseTo(Date.now(), -1);
		expect(Number((await ts.run('{currenttime}')).body)).toBeCloseTo(Date.now(), -1);
	});
});

describe('DateFormat', () => {
	test('GIVEN date THEN return formatted date', async () => {
		expect((await ts.run('{date}')).body).toBe(`<t:${Math.floor(Date.now() / 1000)}:f>`);
		expect((await ts.run('{date:2020-01-01}')).body).toBe('<t:1577836800:f>');
		expect((await ts.run('{date(k):2020-01-01}')).body).toBe('{date(k):2020-01-01}');
		expect((await ts.run('{date(F):2020-01-01}')).body).toBe('<t:1577836800:F>');
		expect((await ts.run('{date(t):2020-01-01}')).body).toBe('<t:1577836800:t>');
		expect((await ts.run('{date(T):2020-01-01}')).body).toBe('<t:1577836800:T>');
		expect((await ts.run('{date(R):2020-01-01}')).body).toBe('<t:1577836800:R>');
		expect((await ts.run('{date(R):1577836800000}')).body).toBe('<t:1577836800:R>');
		expect((await ts.run('{date(R):1577836800}')).body).toBe('<t:1577836800:R>');
	});
});
