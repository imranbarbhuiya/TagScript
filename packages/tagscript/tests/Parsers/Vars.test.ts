import { describe, expect, test } from 'bun:test';

import {
	Context,
	DefineParser,
	Interpreter,
	Lexer,
	LooseVarsParser,
	ParenType,
	Response,
	StrictVarsParser,
	StringTransformer,
} from '../../src';

const contextFor = (tag: string, variables = {}) =>
	new Context(new Lexer(tag, 2_000, ParenType.Both), new Response(variables), new Interpreter(), tag);

describe('StrictVarsParser', () => {
	const parser = new StrictVarsParser();
	const ts = new Interpreter(parser);

	test('GIVEN a seeded variable THEN accept the tag', () => {
		expect(parser.willAccept(contextFor('{args}', { args: new StringTransformer('hi') }))).toBe(true);
	});

	test('GIVEN an unknown variable THEN reject the tag during willAccept', () => {
		expect(parser.willAccept(contextFor('{args}'))).toBe(false);
	});

	test('GIVEN a seeded variable THEN render its value', async () => {
		const body = (await ts.run('{args}', { seedVariables: { args: new StringTransformer('hi') } })).body;

		expect(body).toBe('hi');
	});

	test('GIVEN an unknown variable THEN leave the tag untouched', async () => {
		expect((await ts.run('{args}')).body).toBe('{args}');
	});

	test('GIVEN a variable defined mid render THEN pick it up afterwards', async () => {
		const withDefine = new Interpreter(new DefineParser(), parser);

		expect((await withDefine.run('{=(name):Vox}{name}')).body).toBe('Vox');
	});
});

describe('LooseVarsParser', () => {
	const parser = new LooseVarsParser();
	const ts = new Interpreter(parser);

	test('GIVEN any tag THEN accept it during willAccept', () => {
		expect(parser.willAccept()).toBe(true);
	});

	test('GIVEN a seeded variable THEN render its value', async () => {
		const body = (await ts.run('{args}', { seedVariables: { args: new StringTransformer('hi') } })).body;

		expect(body).toBe('hi');
	});

	test('GIVEN an unknown variable THEN leave the tag untouched, deciding during parse', async () => {
		expect((await ts.run('{args}')).body).toBe('{args}');
	});

	test('GIVEN a variable defined mid render THEN pick it up afterwards', async () => {
		const withDefine = new Interpreter(new DefineParser(), parser);

		expect((await withDefine.run('{=(name):Vox}{name}')).body).toBe('Vox');
	});
});

describe('StrictVarsParser and LooseVarsParser', () => {
	test('GIVEN a known variable THEN both render the same value', async () => {
		const strict = new Interpreter(new StrictVarsParser());
		const loose = new Interpreter(new LooseVarsParser());
		const seedVariables = { args: new StringTransformer('hi') };

		expect((await strict.run('{args}', { seedVariables })).body).toBe(
			(await loose.run('{args}', { seedVariables })).body,
		);
	});

	test('GIVEN a loose parser first THEN it does not block a later parser for unknown names', async () => {
		// LooseVars accepts every tag but returns null for unknown names, so the interpreter
		// falls through to the next acceptor.
		const ts = new Interpreter(new LooseVarsParser(), new DefineParser());

		expect((await ts.run('{=(name):Vox}{name}')).body).toBe('Vox');
	});
});
