import { CooldownParser, Interpreter, Response } from '../../src';

describe('CooldownParser', () => {
	const ts = new Interpreter(new CooldownParser());

	test('GIVEN a cooldown token THEN return empty string and cooldown info', async () => {
		expect(await ts.run('{cd(5):You are in cd}')).toStrictEqual(
			new Response(
				{},
				{
					cooldown: {
						cooldown: 5,
						message: 'You are in cd',
					},
				},
			).setValues('', '{cd(5):You are in cd}'),
		);
	});
});
