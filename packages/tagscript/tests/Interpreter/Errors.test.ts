import { describe, expect, test } from 'bun:test';

import {
	GENERIC_PARSER_ERROR_MESSAGE,
	Interpreter,
	ParserError,
	StopParser,
	StringTransformer,
	TemplateError,
	WorkloadExceededError,
} from '../../src';

import type { Context, IParser } from '../../src';

class TemplateErrorParser implements IParser {
	public willAccept(ctx: Context) {
		return ctx.tag.declaration === 'bad';
	}

	public parse(ctx: Context): string {
		throw new TemplateError('that is not a number', ctx.tag.declaration);
	}
}

class BuggyParser implements IParser {
	public willAccept(ctx: Context) {
		return ctx.tag.declaration === 'buggy';
	}

	public parse(): string {
		throw new TypeError("Cannot read properties of undefined (reading 'secret')");
	}
}

describe('TemplateError', () => {
	const ts = new Interpreter(new TemplateErrorParser());

	test('GIVEN a parser that raises a TemplateError THEN render its message in place of the tag', async () => {
		expect((await ts.run('value: {bad}')).body).toBe('value: that is not a number');
	});

	test('GIVEN a TemplateError THEN keep rendering the rest of the template', async () => {
		expect((await ts.run('before {bad} after')).body).toBe('before that is not a number after');
	});

	test('GIVEN a TemplateError THEN record it on the response', async () => {
		const response = await ts.run('{bad}');

		expect(response.errors).toHaveLength(1);
		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect((response.errors[0] as TemplateError).tag).toBe('bad');
	});

	test('GIVEN several failing tags THEN record each of them', async () => {
		expect((await ts.run('{bad} {bad}')).errors).toHaveLength(2);
	});

	test('GIVEN a clean render THEN leave errors empty', async () => {
		expect((await ts.run('nothing to see')).errors).toStrictEqual([]);
	});
});

describe('ParserError', () => {
	const ts = new Interpreter(new BuggyParser());

	test('GIVEN a parser that throws a bug THEN render a generic message, not the real one', async () => {
		const body = (await ts.run('value: {buggy}')).body;

		expect(body).toBe(`value: ${GENERIC_PARSER_ERROR_MESSAGE}`);
		expect(body).not.toContain('secret');
	});

	test('GIVEN a parser bug THEN keep the real error on the response for the developer', async () => {
		const response = await ts.run('{buggy}');

		expect(response.errors).toHaveLength(1);
		const error = response.errors[0] as ParserError;
		expect(error).toBeInstanceOf(ParserError);
		expect(error.tag).toBe('buggy');
		expect(error.cause).toBeInstanceOf(TypeError);
		expect((error.cause as TypeError).message).toContain('secret');
	});

	test('GIVEN a parser bug THEN keep rendering the rest of the template', async () => {
		expect((await ts.run('before {buggy} after')).body).toBe(`before ${GENERIC_PARSER_ERROR_MESSAGE} after`);
	});
});

describe('StopSignal', () => {
	const ts = new Interpreter(new StopParser(), new TemplateErrorParser());

	test('GIVEN a stop tag THEN halt the render and drop what follows', async () => {
		expect((await ts.run('Hi, {stop(12==12):Hello World} tail')).body).toBe('Hi,  Hello World');
	});

	test('GIVEN a stop tag THEN do not record it as an error', async () => {
		expect((await ts.run('{stop(true):done}')).errors).toStrictEqual([]);
	});
});

describe('WorkloadExceededError', () => {
	const ts = new Interpreter(new TemplateErrorParser());

	test('GIVEN a render over the character limit THEN reject rather than render', async () => {
		await expect(ts.run('{bad}', { charLimit: 1 })).rejects.toThrowError(WorkloadExceededError);
	});

	test('GIVEN a WorkloadExceededError THEN carry the limit and the attempted count', async () => {
		const error = await ts.run('{bad}', { charLimit: 1 }).catch((error: unknown) => error);

		expect(error).toBeInstanceOf(WorkloadExceededError);
		expect((error as WorkloadExceededError).limit).toBe(1);
		expect((error as WorkloadExceededError).attempted).toBe(20);
	});
});

describe('RunOptions', () => {
	const ts = new Interpreter(new TemplateErrorParser());

	test('GIVEN an options object THEN read the seed variables from it', async () => {
		const response = await ts.run('{args}', { seedVariables: { args: new StringTransformer('hi') } });

		expect(response.variables.args).toBeInstanceOf(StringTransformer);
	});

	test('GIVEN the deprecated positional form THEN behave the same', async () => {
		const positional = await ts.run('{args}', { args: new StringTransformer('hi') }, 100);
		const options = await ts.run('{args}', {
			seedVariables: { args: new StringTransformer('hi') },
			charLimit: 100,
		});

		expect(positional.body).toBe(options.body);
	});

	test('GIVEN seed variables as the second argument THEN treat them as seed variables', async () => {
		const response = await ts.run('{args}', { args: new StringTransformer('hi') });

		expect(response.variables.args).toBeInstanceOf(StringTransformer);
	});

	test('GIVEN keyValues in the options THEN pass them through untouched', async () => {
		const keyValues = { tagName: 'demo' } as unknown as Record<string, never>;
		const response = await ts.run('nothing', { keyValues });

		expect(response.keyValues).toBe(keyValues);
	});
});
