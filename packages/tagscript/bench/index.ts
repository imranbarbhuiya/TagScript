import { bench, group, do_not_optimize } from 'mitata';

import { emitResults, runBenchmarks } from '../../../scripts/bench/harness';
import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	FunctionTransformer,
	IfStatementParser,
	IncludesParser,
	IntegerTransformer,
	Interpreter,
	IntersectionStatementParser,
	JSONVarParser,
	Lexer,
	LooseVarsParser,
	OrdinalFormatParser,
	ParenType,
	RandomParser,
	RangeParser,
	ReplaceParser,
	SafeObjectTransformer,
	SliceParser,
	StopParser,
	StrictVarsParser,
	StringFormatParser,
	StringTransformer,
	UnionStatementParser,
	UrlDecodeParser,
	UrlEncodeParser,
	buildNodeTree,
} from '../src';

import type { IParser } from '../src';

const seedVariables = () => ({
	args: new StringTransformer('63'),
	n: new IntegerTransformer(7),
	data: new SafeObjectTransformer('{"name":"John Doe","age":30}'),
	fn: new FunctionTransformer(() => 'called'),
});

/**
 *
 * Benchmarks one parser in isolation, through a real interpreter holding only that parser.
 *
 * Registering a single parser keeps the `willAccept` fan-out at one, so what is measured is the
 * parser plus the fixed per-node interpreter overhead rather than the size of somebody's parser
 * list.
 *
 * @param name - The label for the benchmark.
 * @param parser - The parser under test.
 * @param template - A template that exercises it.
 * @param extraParsers - Parsers the template also needs, such as a variable parser.
 */
const benchParser = (name: string, parser: IParser, template: string, ...extraParsers: IParser[]) => {
	const ts = new Interpreter(parser, ...extraParsers);
	const variables = seedVariables();

	bench(name, function* () {
		yield async () => do_not_optimize(await ts.run(template, { seedVariables: variables }));
	});
};

group('lexer', () => {
	for (const [name, input] of [
		['declaration only', '{args}'],
		['parenthesis parameter', '{args(1)}'],
		['dot parameter', '{args.name}'],
		['payload', '{random:a,b,c}'],
		['parameter and payload', '{if(1<2):yes|no}'],
		['nested braces in payload', '{if({args}==63):{random:a,b}|no}'],
		['escaped characters', '{replace(\\|,-):a\\|b\\|c}'],
	] as const) {
		bench(name, function* () {
			yield () => do_not_optimize(new Lexer(input, 2_000, ParenType.Both));
		});
	}
});

group('node tree', () => {
	for (const [name, input] of [
		['no tags', 'Just some text with no tags in it at all.'],
		['one tag', 'Hello {args} how are you'],
		['nested tags', '{if({args}==63):{random:a,b}|{random:c,d}}'],
		['fifty tags', Array.from({ length: 50 }, (_, index) => `{random:${index}}`).join(' ')],
	] as const) {
		bench(name, function* () {
			yield () => do_not_optimize(buildNodeTree(input));
		});
	}
});

group('parsers', () => {
	benchParser('BreakParser', new BreakParser(), '{break({args}==63):done}');
	benchParser('DefineParser', new DefineParser(), '{=(name):value}');
	benchParser('FiftyFiftyParser', new FiftyFiftyParser(), '{50:heads}');
	benchParser('IfStatementParser', new IfStatementParser(), '{if({args}==63):yes|no}');
	benchParser('IncludesParser', new IncludesParser(), '{includes(63):61,62,63}');
	benchParser('IntersectionStatementParser', new IntersectionStatementParser(), '{all(1<2|3<4):yes|no}');
	benchParser('JSONVarParser', new JSONVarParser(), '{json(user):{"name":"John","age":30}}');
	benchParser('LooseVarsParser', new LooseVarsParser(), '{args}');
	benchParser('OrdinalFormatParser', new OrdinalFormatParser(), '{ord:63}');
	benchParser('RandomParser', new RandomParser(), '{random:a,b,c,d,e}');
	benchParser('RangeParser', new RangeParser(), '{range:1-100}');
	benchParser('ReplaceParser', new ReplaceParser(), '{replace(o,0):foobar}');
	benchParser('SliceParser', new SliceParser(), '{slice(1:4):abcdefg}');
	benchParser('StopParser', new StopParser(), 'text {stop({args}==63):halted}');
	benchParser('StrictVarsParser', new StrictVarsParser(), '{args}');
	benchParser('StringFormatParser', new StringFormatParser(), '{upper:hello world}');
	benchParser('UnionStatementParser', new UnionStatementParser(), '{any(1<2|3>4):yes|no}');
	benchParser('UrlDecodeParser', new UrlDecodeParser(), '{urldecode:Hello%20World}');
	benchParser('UrlEncodeParser', new UrlEncodeParser(), '{urlencode:Hello World}');
});

group('transformers', () => {
	const tag = new Lexer('{args(1)}', 2_000, ParenType.Both);
	const dotTag = new Lexer('{data.name}', 2_000, ParenType.Both);

	const string = new StringTransformer('one two three four');
	const integer = new IntegerTransformer(63);
	const object = new SafeObjectTransformer('{"name":"John Doe","age":30}');
	const fn = new FunctionTransformer(() => 'called');

	bench('StringTransformer', function* () {
		yield () => do_not_optimize(string.transform(tag));
	});
	bench('IntegerTransformer', function* () {
		yield () => do_not_optimize(integer.transform(tag));
	});
	bench('SafeObjectTransformer', function* () {
		yield () => do_not_optimize(object.transform(dotTag));
	});
	bench('FunctionTransformer', function* () {
		yield () => do_not_optimize(fn.transform(tag));
	});
});

group('interpreter', () => {
	const everyParser = () =>
		new Interpreter(
			new DefineParser(),
			new IfStatementParser(),
			new UnionStatementParser(),
			new IntersectionStatementParser(),
			new RandomParser(),
			new RangeParser(),
			new ReplaceParser(),
			new SliceParser(),
			new IncludesParser(),
			new StringFormatParser(),
			new OrdinalFormatParser(),
			new UrlEncodeParser(),
			new UrlDecodeParser(),
			new JSONVarParser(),
			new BreakParser(),
			new StopParser(),
			new StrictVarsParser(),
			new LooseVarsParser(),
		);

	const ts = everyParser();
	const variables = seedVariables();

	for (const [name, template] of [
		['plain text, no tags', 'Just some text with no tags in it at all.'],
		['single tag', '{if(1<2):yes|no}'],
		['typical template', '{=(a):hello} {if({a}==hello):yes|no} {random:1,2,3} {a} {=(b):x}{b}'],
		['nested tags', '{if({args}==63):You guessed it!|Too {if({args}<63):low|high}, try again.}'],
		['deeply nested', '{if({if(1<2):yes|no}==yes):{upper:{replace(a,b):aaa}}|no}'],
		['fifty tags', Array.from({ length: 50 }, (_, index) => `{random:${index},${index + 1}}`).join(' ')],
		['long text, few tags', `${'lorem ipsum dolor sit amet '.repeat(200)}{args}`],
		['escaped braces only', '\\{not a tag\\} '.repeat(50)],
	] as const) {
		bench(name, function* () {
			yield async () => do_not_optimize(await ts.run(template, { seedVariables: variables }));
		});
	}

	bench('charLimit enforced', function* () {
		yield async () => do_not_optimize(await ts.run('{random:a,b,c}', { charLimit: 1_000 }));
	});

	bench('construction, eighteen parsers', function* () {
		yield () => do_not_optimize(everyParser());
	});
});

await emitResults(await runBenchmarks('tagscript'));
