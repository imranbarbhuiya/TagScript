import { describe, expect, test } from 'bun:test';

import * as Effect from 'effect/Effect';

import { body, run } from './helpers';

import {
	BaseParser,
	Interpreter as ClassicInterpreter,
	ParserError as ClassicParserError,
	StopSignal as ClassicStopSignal,
	TemplateError as ClassicTemplateError,
	StringTransformer,
} from '../../src';
import {
	GENERIC_PARSER_ERROR_MESSAGE,
	Interpreter,
	StopSignal,
	TemplateError,
	definePlugin,
	fromClassic,
	toClassic,
	toPromise,
} from '../../src/effect';

import type { Context as ClassicContext, IParser } from '../../src';

class ShoutParser extends BaseParser implements IParser {
	public constructor() {
		super(['shout'], false, true);
	}

	public parse(ctx: ClassicContext) {
		return `${ctx.tag.payload!.toUpperCase()}!`;
	}
}

class DefineClassic extends BaseParser implements IParser {
	public constructor() {
		super(['cdef'], true, true);
	}

	public parse(ctx: ClassicContext) {
		ctx.response.variables[ctx.tag.parameter!] = new StringTransformer(ctx.tag.payload!);
		ctx.response.actions.deny = { ids: ['1'], message: null };
		return '';
	}
}

class ClassicTemplateMistake extends BaseParser implements IParser {
	public constructor() {
		super(['cbad']);
	}

	public parse(ctx: ClassicContext): string {
		throw new ClassicTemplateError('classic template mistake', ctx.tag.declaration);
	}
}

class ClassicHalt extends BaseParser implements IParser {
	public constructor() {
		super(['chalt']);
	}

	public parse(): string {
		throw new ClassicStopSignal('classic stop');
	}
}

class ClassicBug extends BaseParser implements IParser {
	public constructor() {
		super(['cbug']);
	}

	public parse(): string {
		throw new TypeError('classic internal detail');
	}
}

describe('fromClassic', () => {
	const ts = new Interpreter(
		fromClassic(new ShoutParser()),
		fromClassic(new DefineClassic()),
		fromClassic(new ClassicTemplateMistake()),
		fromClassic(new ClassicHalt()),
		fromClassic(new ClassicBug()),
	);

	const render = async (template: string) => body(ts.run(template));

	test('GIVEN a classic parser THEN it renders on the Effect interpreter', async () => {
		expect(await render('{shout:hey}')).toBe('HEY!');
	});

	test('GIVEN a classic parser THEN its required payload is still enforced', async () => {
		expect(await render('{shout}')).toBe('{shout}');
	});

	test('GIVEN a classic parser that defines a variable THEN the variable survives', async () => {
		const response = await run(ts.run('{cdef(x):hi}'));

		expect(response.variables.x).toBeInstanceOf(StringTransformer);
	});

	test('GIVEN a classic parser that writes actions THEN the actions survive', async () => {
		const response = await run(ts.run('{cdef(x):hi}'));

		expect(response.actions.deny).toStrictEqual({ ids: ['1'], message: null });
	});

	test('GIVEN a classic TemplateError THEN render its message and record it', async () => {
		const response = await run(ts.run('a {cbad} b'));

		expect(response.body).toBe('a classic template mistake b');
		expect(response.errors[0]).toBeInstanceOf(TemplateError);
	});

	test('GIVEN a classic StopSignal THEN halt the render', async () => {
		expect(await render('a {chalt} b')).toBe('a  classic stop');
	});

	test('GIVEN a classic parser bug THEN render the generic message and keep the cause', async () => {
		const response = await run(ts.run('a {cbug} b'));

		expect(response.body).toBe(`a ${GENERIC_PARSER_ERROR_MESSAGE} b`);
		expect(response.body).not.toContain('classic internal detail');
		expect(response.errors[0]).toBeInstanceOf(Object);
	});
});

describe('toClassic', () => {
	const effectUpper = definePlugin({
		names: ['eupper'],
		requiredPayload: true,
		parse: (ctx) => Effect.succeed(ctx.tag.payload!.toUpperCase()),
	});

	const effectBad = definePlugin<TemplateError>({
		names: ['ebad'],
		parse: Effect.fnUntraced(function* (ctx) {
			return yield* new TemplateError({ message: 'effect template mistake', tag: ctx.tag.declaration });
		}),
	});

	const effectHalt = definePlugin<StopSignal>({
		names: ['ehalt'],
		parse: Effect.fnUntraced(function* () {
			return yield* new StopSignal({ message: 'effect stop' });
		}),
	});

	const ts = new ClassicInterpreter(toClassic(effectUpper), toClassic(effectBad), toClassic(effectHalt));

	test('GIVEN an Effect parser THEN it renders on the classic interpreter', async () => {
		expect((await ts.run('{eupper:hey}')).body).toBe('HEY');
	});

	test('GIVEN a required payload THEN it is still enforced', async () => {
		expect((await ts.run('{eupper}')).body).toBe('{eupper}');
	});

	test('GIVEN a TemplateError THEN the classic interpreter renders its message', async () => {
		const response = await ts.run('a {ebad} b');

		expect(response.body).toBe('a effect template mistake b');
		expect(response.errors[0]).toBeInstanceOf(ClassicTemplateError);
	});

	test('GIVEN a StopSignal THEN the classic interpreter halts', async () => {
		expect((await ts.run('a {ehalt} b')).body).toBe('a  effect stop');
	});

	test('GIVEN a parser that needs no services THEN it converts', () => {
		expect(toClassic(effectUpper)).toHaveProperty('parse');
	});
});

describe('toPromise', () => {
	const parser = definePlugin({
		names: ['upper'],
		requiredPayload: true,
		parse: (ctx) => Effect.succeed(ctx.tag.payload!.toUpperCase()),
	});

	test('GIVEN an interpreter needing no services THEN it runs as a promise', async () => {
		const render = toPromise(new Interpreter(parser));

		expect((await render('{upper:done}')).body).toBe('DONE');
	});

	test('GIVEN seed variables THEN they reach the render', async () => {
		const withVars = toPromise(
			new Interpreter(
				definePlugin({
					names: ['args'],
					parse: (ctx) => Effect.succeed(ctx.response.variables.args.transform(ctx.tag)),
				}),
			),
		);

		const response = await withVars('{args}', { seedVariables: { args: new StringTransformer('63') } });

		expect(response.body).toBe('63');
	});
});

describe('round trip', () => {
	test('GIVEN a classic parser lifted and lowered again THEN it still works', async () => {
		const ts = new ClassicInterpreter(toClassic(fromClassic(new ShoutParser())));

		expect((await ts.run('{shout:hey}')).body).toBe('HEY!');
	});

	test('GIVEN a classic error through both adapters THEN it stays a classic error', async () => {
		const ts = new ClassicInterpreter(toClassic(fromClassic(new ClassicTemplateMistake())));
		const response = await ts.run('{cbad}');

		expect(response.body).toBe('classic template mistake');
		expect(response.errors[0]).toBeInstanceOf(ClassicTemplateError);
		expect(response.errors[0]).not.toBeInstanceOf(ClassicParserError);
	});
});
