import { Response } from '../src';

describe('Response', () => {
	const response = new Response().setValues('Hello World', '{Hello World}');

	test('GIVEN a value in setValues THEN return the same values in toJSON', () => {
		expect(response.toJSON()).toStrictEqual({
			body: 'Hello World',
			raw: '{Hello World}',
			actions: {},
			keyValues: {},
			variables: {},
		});
	});
});
