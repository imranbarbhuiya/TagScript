import * as Effect from 'effect/Effect';
import { describe, expect, test } from 'vitest';

import {
	Interpreter,
	StrictVarsParser,
	StringFormatParser,
	StringTransformer,
	buildNodeTree,
	extractTags,
	validateTags,
} from '../../src';
import { Interpreter as EffectInterpreter, definePlugin } from '../../src/effect';

import type { SkipRange } from '../../src';

/**
 *
 * The range covering the first occurrence of `part`, so a test can say what to skip by its text.
 *
 * @param template - The template.
 * @param part - The text to skip.
 * @returns The range.
 */
const range = (template: string, part: string): SkipRange => {
	const start = template.indexOf(part);
	return { start, end: start + part.length };
};

const ts = new Interpreter(new StringFormatParser(), new StrictVarsParser());
const seedVariables = { name: new StringTransformer('Ada') };

describe('buildNodeTree', () => {
	test('GIVEN a tag inside a skipped range THEN do not open a node for it', () => {
		const template = 'a `{x}` {y}';
		const nodes = buildNodeTree(template, [range(template, '`{x}`')]);
		expect(nodes.map((node) => template.slice(node.coordinates[0], node.coordinates[1] + 1))).toStrictEqual(['{y}']);
	});

	test('GIVEN a closing brace inside a skipped range THEN it does not close a tag opened outside', () => {
		const template = '{upper:see `}` here}';
		const nodes = buildNodeTree(template, [range(template, '`}`')]);
		expect(nodes.map((node) => node.coordinates)).toStrictEqual([[0, template.length - 1]]);
	});

	test('GIVEN ranges out of order or overlapping THEN skip all of them', () => {
		const template = '{a} {b} {c} {d}';
		const nodes = buildNodeTree(template, [range(template, '{c}'), range(template, '{a} {b}'), { start: 1, end: 6 }]);
		expect(nodes.map((node) => template.slice(node.coordinates[0], node.coordinates[1] + 1))).toStrictEqual(['{d}']);
	});

	test('GIVEN a backslash at the end of a skipped range THEN it does not escape the next brace', () => {
		const template = '`a\\`{name}';
		expect(buildNodeTree(template, [range(template, '`a\\`')])).toHaveLength(1);
	});
});

describe('Interpreter#run with skipRanges', () => {
	test('GIVEN a code block THEN leave its tags exactly as written', async () => {
		const template = 'Use it like this:\n```\n{upper:hello}\n```\nHi {upper:{name}}';
		const response = await ts.run(template, {
			seedVariables,
			skipRanges: [range(template, '```\n{upper:hello}\n```')],
		});

		expect(response.body).toBe('Use it like this:\n```\n{upper:hello}\n```\nHi ADA');
	});

	test('GIVEN spans and a skipped range THEN the recorded spans still point at the output', async () => {
		const template = '`{name}` {upper:{name}} `{name}` {name}';
		const response = await ts.run(template, {
			seedVariables,
			spans: true,
			skipRanges: [
				range(template, '`{name}`'),
				{ start: template.lastIndexOf('`{'), end: template.lastIndexOf('}`') + 2 },
			],
		});

		expect(response.body).toBe('`{name}` ADA `{name}` Ada');
		expect(response.spans?.map((span) => response.body!.slice(span.start, span.end))).toStrictEqual(['ADA', 'Ada']);
	});

	test('GIVEN only skipRanges THEN read the object as options, not seed variables', async () => {
		const response = await ts.run('`{upper:a}`', { skipRanges: [{ start: 0, end: 11 }] });
		expect(response.body).toBe('`{upper:a}`');
	});

	test('GIVEN no skipRanges THEN render code regions like anything else', async () => {
		expect((await ts.run('`{upper:a}`')).body).toBe('`A`');
	});
});

describe('Effect Interpreter#run with skipRanges', () => {
	const upper = definePlugin({
		names: ['upper'],
		requiredPayload: true,
		parse: (ctx) => Effect.succeed(ctx.tag.payload!.toUpperCase()),
	});

	test('GIVEN a skipped range THEN behave as the classic interpreter does', async () => {
		const template = '`{upper:a}` {upper:b}';
		const response = await Effect.runPromise(
			new EffectInterpreter(upper).run(template, { skipRanges: [range(template, '`{upper:a}`')] }),
		);

		expect(response.body).toBe('`{upper:a}` B');
	});
});

describe('extractTags and validateTags with skipRanges', () => {
	const template = 'Hi {name}, write `{naem}` to see a typo';
	const skipRanges = [range(template, '`{naem}`')];

	test('GIVEN a skipped range THEN extractTags does not report tags inside it', () => {
		expect(extractTags(template, { skipRanges }).map((tag) => tag.tag.declaration)).toStrictEqual(['name']);
	});

	test('GIVEN a skipped range THEN validateTags does not report tags inside it', () => {
		const tags = [{ name: 'name', label: 'Name' }];
		expect(validateTags(template, tags)).toHaveLength(1);
		expect(validateTags(template, tags, { skipRanges })).toStrictEqual([]);
	});
});
