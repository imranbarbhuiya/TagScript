import { IfStatementParser, Interpreter, IntersectionStatementParser, Response, UnionStatementParser } from '../../src';
describe('IntersectionStatementParser', () => {
	const ts = new Interpreter(new IntersectionStatementParser());
	test('Given a string in intersection parser THEN returns the string if all conditions are true else return empty string', async () => {
		expect(
			await ts.run('{all(10>=100|10<=1000):You picked 10.|You must provide a number between 100 and 1000.}'),
		).toStrictEqual(
			new Response().setValues(
				'You must provide a number between 100 and 1000.',
				'{all(10>=100|10<=1000):You picked 10.|You must provide a number between 100 and 1000.}',
			),
		);
		expect(
			await ts.run('{all(282>=100|282<=1000):You picked 282.|You must provide a number between 100 and 1000.}'),
		).toStrictEqual(
			new Response().setValues(
				'You picked 282.',
				'{all(282>=100|282<=1000):You picked 282.|You must provide a number between 100 and 1000.}',
			),
		);
	});
});

describe('UnionStatementParser', () => {
	const ts = new Interpreter(new UnionStatementParser());
	test('Given a string in union parser THEN returns the string if any conditions are true else return empty string', async () => {
		expect(await ts.run('{any(hi==hi|hi==hello|hi==heyy):Hello!|How rude.}')).toStrictEqual(
			new Response().setValues('Hello!', '{any(hi==hi|hi==hello|hi==heyy):Hello!|How rude.}'),
		);
		expect(await ts.run("{any(what's up==hi|what's up==hello|what's up==heyy):Hello!|How rude.}")).toStrictEqual(
			new Response().setValues('How rude.', "{any(what's up==hi|what's up==hello|what's up==heyy):Hello!|How rude.}"),
		);
	});
});

describe('IfStatementParser', () => {
	const ts = new Interpreter(new IfStatementParser());
	test('Given a string in union parser THEN returns the string if any conditions are true else return empty string', async () => {
		expect(
			await ts.run(
				'{if(63==63):You guessed it! The number I was thinking of was 63!|Too {if(63<63):low|high}, try again.}',
			),
		).toStrictEqual(
			new Response().setValues(
				'You guessed it! The number I was thinking of was 63!',
				'{if(63==63):You guessed it! The number I was thinking of was 63!|Too {if(63<63):low|high}, try again.}',
			),
		);

		expect(
			await ts.run(
				'{if(73==63):You guessed it! The number I was thinking of was 63!|Too {if(73<63):low|high}, try again.}',
			),
		).toStrictEqual(
			new Response().setValues(
				'Too high, try again.',
				'{if(73==63):You guessed it! The number I was thinking of was 63!|Too {if(73<63):low|high}, try again.}',
			),
		);

		expect(
			await ts.run(
				'{if(14==63):You guessed it! The number I was thinking of was 63!|Too {if(14<63):low|high}, try again.}',
			),
		).toStrictEqual(
			new Response().setValues(
				'Too low, try again.',
				'{if(14==63):You guessed it! The number I was thinking of was 63!|Too {if(14<63):low|high}, try again.}',
			),
		);
	});
});
