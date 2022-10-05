import {
	DefineParser,
	IfStatementParser,
	Interpreter,
	IntersectionStatementParser,
	Response,
	StrictVarsParser,
	StringTransformer,
	UnionStatementParser
} from '../../src';

describe('IntersectionStatementParser', () => {
	const ts = new Interpreter(new IntersectionStatementParser());
	test('GIVEN a string in intersection parser THEN returns the string if all conditions are true else return empty string', async () => {
		const text1 = '{all(10>=100|10<=1000):You picked 10.|You must provide a number between 100 and 1000.}';
		expect(await ts.run(text1)).toStrictEqual(new Response().setValues('You must provide a number between 100 and 1000.', text1));

		const text2 = '{all(282>=100|282<=1000):You picked 282.|You must provide a number between 100 and 1000.}';
		expect(await ts.run(text2)).toStrictEqual(new Response().setValues('You picked 282.', text2));
	});
});

describe('UnionStatementParser', () => {
	const ts = new Interpreter(new UnionStatementParser());
	test('GIVEN a string in union parser THEN returns the string if any conditions are true else return empty string', async () => {
		const text1 = '{any(hi==hi|hi==hello|hi==heyy):Hello!|How rude.}';
		expect(await ts.run(text1)).toStrictEqual(new Response().setValues('Hello!', text1));

		const text2 = "{any(what's up==hi|what's up==hello|what's up==hey):Hello!|How rude.}";
		expect(await ts.run(text2)).toStrictEqual(new Response().setValues('How rude.', text2));
	});
});

describe('IfStatementParser', () => {
	const ts = new Interpreter(new IfStatementParser(), new DefineParser(), new StrictVarsParser());

	test('GIVEN a string in union parser THEN returns the string if any conditions are true else return empty string', async () => {
		const text1 = '{if(63==63):You guessed it! The number I was thinking of was 63!|Too {if(63<63):low|high}, try again.}';
		expect(await ts.run(text1)).toStrictEqual(new Response().setValues('You guessed it! The number I was thinking of was 63!', text1));

		const text2 = '{if(73==63):You guessed it! The number I was thinking of was 63!|Too {if(73<63):low|high}, try again.}';
		expect(await ts.run(text2)).toStrictEqual(new Response().setValues('Too high, try again.', text2));

		const text3 = '{if(14==63):You guessed it! The number I was thinking of was 63!|Too {if(14<63):low|high}, try again.}';
		expect(await ts.run(text3)).toStrictEqual(new Response().setValues('Too low, try again.', text3));

		const text4 = '{=(a):{if(52==63):You guessed it! The number I was thinking of was 63!}}{a}';
		expect(await ts.run(text4)).toStrictEqual(
			new Response({
				a: new StringTransformer('')
			}).setValues('', text4)
		);

		const text5 = '{=(a):{if(63==63):You guessed it! The number I was thinking of was 63!}}{a}';
		expect(await ts.run(text5)).toStrictEqual(
			new Response({
				a: new StringTransformer('You guessed it! The number I was thinking of was 63!')
			}).setValues('You guessed it! The number I was thinking of was 63!', text5)
		);
	});
});
