import { Interpreter } from 'tagscript';
import { RequiredParser, DenyParser } from '../../src';

describe('RequiredParser', () => {
	const ts = new Interpreter(new RequiredParser());

	test('GIVEN a require tag THEN return empty string and require info', async () => {
		expect((await ts.run("{require(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			require: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag."
			}
		});
	});

	test('GIVEN a require tag twice THEN ignore 2nd one', async () => {
		expect((await ts.run('{require(757164765582721054)} {require(758880890159235083)}')).actions).toStrictEqual({
			require: {
				ids: ['757164765582721054'],
				message: null
			}
		});
	});
});

describe('DenyParser', () => {
	const ts = new Interpreter(new DenyParser());

	test('GIVEN a deny tag THEN return empty string and deny info', async () => {
		expect((await ts.run("{deny(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			deny: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag."
			}
		});
	});

	test('GIVEN a deny tag twice THEN ignore 2nd one', async () => {
		expect((await ts.run('{deny(757164765582721054)} {deny(758880890159235083)}')).actions).toStrictEqual({
			deny: {
				ids: ['757164765582721054'],
				message: null
			}
		});
	});
});
