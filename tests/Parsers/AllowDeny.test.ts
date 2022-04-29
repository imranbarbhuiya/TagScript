import { RequiredParser, DenyParser, Interpreter } from '../../src';

describe('RequiredParser', () => {
	const ts = new Interpreter(new RequiredParser());

	test('GIVEN a require tag THEN return empty string and require info', async () => {
		expect((await ts.run("{require(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			require: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag.",
			},
		});
	});
});

describe('DenyParser', () => {
	const ts = new Interpreter(new DenyParser());

	test('GIVEN a deny tag THEN return empty string and deny info', async () => {
		expect((await ts.run("{deny(758880890159235083):You aren't allowed to use this tag.}")).actions).toStrictEqual({
			deny: {
				ids: ['758880890159235083'],
				message: "You aren't allowed to use this tag.",
			},
		});
	});
});
