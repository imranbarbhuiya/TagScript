import { describe, expect, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { BaseTransformer } from '../../src';

import type { ITransformer } from 'tagscript';

interface Thing {
	id: string;
	name: string;
	secret: string;
}

const thing: Thing = { id: '933368398996447292', name: 'A Thing', secret: 'do not leak' };

/**
 * A minimal subclass, so the behaviour every transformer inherits is tested once here rather than
 * repeated across the six real ones.
 */
class ThingTransformer extends BaseTransformer<Thing> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return `<t:${this.base.id}>`;
	}
}

class NamelessTransformer extends BaseTransformer<{ id: string }> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return this.base.id;
	}
}

const ts = new Interpreter(new StrictVarsParser());

const render = async (template: string, transformer: ITransformer) =>
	(await ts.run(template, { seedVariables: { thing: transformer } })).body ?? '';

describe('BaseTransformer', () => {
	describe('defaults every subclass inherits', () => {
		test('GIVEN no parameter THEN render the mention', async () => {
			expect(await render('{thing}', new ThingTransformer(thing))).toBe('<t:933368398996447292>');
		});

		test('GIVEN id THEN render what resolveId returned', async () => {
			expect(await render('{thing(id)}', new ThingTransformer(thing))).toBe('933368398996447292');
		});

		test('GIVEN a payload with a name THEN pick it up automatically', async () => {
			expect(await render('{thing(name)}', new ThingTransformer(thing))).toBe('A Thing');
		});

		test('GIVEN a payload without a name THEN render name as empty', async () => {
			expect(await render('{thing(name)}', new NamelessTransformer({ id: '1' }))).toBe('');
		});
	});

	describe('extra safe values', () => {
		test('GIVEN a static extra value THEN render it', async () => {
			const transformer = new ThingTransformer(thing, { colour: 'blue' });

			expect(await render('{thing(colour)}', transformer)).toBe('blue');
		});

		test('GIVEN a function extra value THEN call it with the payload', async () => {
			const transformer = new ThingTransformer(thing, { shout: (base) => base.name.toUpperCase() });

			expect(await render('{thing(shout)}', transformer)).toBe('A THING');
		});

		test('GIVEN an extra value THEN it wins over a built-in one', async () => {
			const transformer = new ThingTransformer(thing, { id: 'hidden' });

			expect(await render('{thing(id)}', transformer)).toBe('hidden');
		});

		test('GIVEN a function returning null THEN render an empty string', async () => {
			const transformer = new ThingTransformer(thing, { nothing: () => null });

			expect(await render('{thing(nothing)}', transformer)).toBe('');
		});

		test('GIVEN a function returning undefined THEN leave the tag untouched', async () => {
			const transformer = new ThingTransformer(thing, { nothing: () => undefined });

			expect(await render('{thing(nothing)}', transformer)).toBe('{thing(nothing)}');
		});

		test.each([
			['a number', 42, '42'],
			['zero', 0, '0'],
			['true', true, 'true'],
			['false', false, 'false'],
			['an empty string', '', ''],
		])('GIVEN %s THEN render it as %s', async (_label, value, expected) => {
			const transformer = new ThingTransformer(thing, { value });

			expect(await render('{thing(value)}', transformer)).toBe(expected);
		});
	});

	describe('sandbox', () => {
		test('GIVEN a field that is not a safe value THEN leave the tag untouched', async () => {
			expect(await render('{thing(secret)}', new ThingTransformer(thing))).toBe('{thing(secret)}');
		});

		test('GIVEN toJSON THEN expose only the safe values', () => {
			expect(new ThingTransformer(thing).toJSON()).toStrictEqual({
				id: '933368398996447292',
				mention: '<t:933368398996447292>',
				name: 'A Thing',
			});
		});
	});
});
