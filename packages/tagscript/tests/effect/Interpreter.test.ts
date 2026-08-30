import { describe, expect, test } from 'bun:test';

import * as Context from 'effect/Context';
import * as Data from 'effect/Data';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

import { body, outcome, run } from './helpers';

import { ParenType, StringTransformer } from '../../src';
import {
	CharLimit,
	GENERIC_PARSER_ERROR_MESSAGE,
	Interpreter,
	ParameterSyntax,
	ParserError,
	StopSignal,
	TagLimit,
	TemplateError,
	WorkloadExceededError,
	definePlugin,
} from '../../src/effect';

const upper = definePlugin({
	names: ['upper'],
	requiredPayload: true,
	parse: (ctx) => Effect.succeed(ctx.tag.payload!.toUpperCase()),
});

const bad = definePlugin<TemplateError>({
	names: ['bad'],
	parse: Effect.fnUntraced(function* (ctx) {
		return yield* new TemplateError({ message: 'that is not a number', tag: ctx.tag.declaration });
	}),
});

const buggy = definePlugin({
	names: ['buggy'],
	parse: () =>
		Effect.sync(() => {
			throw new TypeError('secret internal detail');
		}),
});

const halt = definePlugin<StopSignal>({
	names: ['halt'],
	parse: Effect.fnUntraced(function* (ctx) {
		return yield* new StopSignal({ message: ctx.tag.payload ?? '' });
	}),
});

const passing = definePlugin({ names: ['skip'], parse: () => Effect.succeed(null) });

describe('Interpreter', () => {
	const ts = new Interpreter<StopSignal | TemplateError>(upper, bad, buggy, halt, passing);

	test('GIVEN a template with no tags THEN return it unchanged', async () => {
		expect(await body(ts.run('plain text'))).toBe('plain text');
	});

	test('GIVEN a tag no parser accepts THEN leave it untouched', async () => {
		expect(await body(ts.run('a {unknown} b'))).toBe('a {unknown} b');
	});

	test('GIVEN a parser that returns null THEN fall through to the next one', async () => {
		const withFallthrough = new Interpreter(passing, upper);

		expect(await body(withFallthrough.run('{upper:hi}'))).toBe('HI');
	});

	test('GIVEN nested tags THEN resolve the inner one first', async () => {
		expect(await body(ts.run('{upper:{upper:hi}}'))).toBe('HI');
	});

	test('GIVEN seed variables THEN expose them on the response', async () => {
		const response = await run(ts.run('x', { seedVariables: { a: new StringTransformer('1') } }));

		expect(response.variables.a).toBeInstanceOf(StringTransformer);
	});

	test('GIVEN key values THEN pass them through untouched', async () => {
		const keyValues = { tag: 'demo' } as unknown as Record<string, never>;

		expect((await run(ts.run('x', { keyValues }))).keyValues).toBe(keyValues);
	});

	test('GIVEN a render THEN record the raw template', async () => {
		expect((await run(ts.run('{upper:hi}'))).raw).toBe('{upper:hi}');
	});

	describe('parsers', () => {
		test('GIVEN addParsers THEN the new parser is used', async () => {
			const empty = new Interpreter();
			empty.addParsers(upper);

			expect(await body(empty.run('{upper:hi}'))).toBe('HI');
		});

		test('GIVEN setParsers THEN the old parsers are dropped', async () => {
			const replaced = new Interpreter(upper);
			replaced.setParsers(passing);

			expect(await body(replaced.run('{upper:hi}'))).toBe('{upper:hi}');
		});
	});

	describe('TemplateError', () => {
		test('GIVEN a TemplateError THEN render its message in place of the tag', async () => {
			expect(await body(ts.run('a {bad} b'))).toBe('a that is not a number b');
		});

		test('GIVEN a TemplateError THEN keep rendering the rest of the template', async () => {
			expect(await body(ts.run('{bad} {upper:tail}'))).toBe('that is not a number TAIL');
		});

		test('GIVEN a TemplateError THEN record it on the response', async () => {
			const response = await run(ts.run('{bad}'));

			expect(response.errors).toHaveLength(1);
			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect((response.errors[0] as TemplateError).tag).toBe('bad');
		});

		test('GIVEN a clean render THEN leave errors empty', async () => {
			expect((await run(ts.run('{upper:hi}'))).errors).toStrictEqual([]);
		});
	});

	describe('defects', () => {
		test('GIVEN a parser that throws THEN render a generic message', async () => {
			const rendered = await body(ts.run('a {buggy} b'));

			expect(rendered).toBe(`a ${GENERIC_PARSER_ERROR_MESSAGE} b`);
			expect(rendered).not.toContain('secret');
		});

		test('GIVEN a defect THEN keep the real error on the response', async () => {
			const response = await run(ts.run('{buggy}'));

			expect(response.errors[0]).toBeInstanceOf(ParserError);
			const error = response.errors[0] as ParserError;
			expect(error.tag).toBe('buggy');
			expect((error.cause as TypeError).message).toContain('secret');
		});
	});

	describe('StopSignal', () => {
		test('GIVEN a stop THEN keep what was rendered and drop the rest', async () => {
			expect(await body(ts.run('a {halt:done} {upper:tail}'))).toBe('a  done');
		});

		test('GIVEN a stop THEN do not record it as an error', async () => {
			expect((await run(ts.run('{halt:done}'))).errors).toStrictEqual([]);
		});
	});

	describe('CharLimit', () => {
		test('GIVEN a render over the limit THEN fail with WorkloadExceededError', async () => {
			const { failure } = await outcome(ts.run('{upper:hello world}').pipe(Effect.provideService(CharLimit, 3)));

			expect(failure).toBeInstanceOf(WorkloadExceededError);
			expect((failure as WorkloadExceededError).limit).toBe(3);
			expect((failure as WorkloadExceededError).attempted).toBe(11);
		});

		test('GIVEN a render under the limit THEN succeed', async () => {
			const rendered = await body(ts.run('{upper:hi}').pipe(Effect.provideService(CharLimit, 100)));

			expect(rendered).toBe('HI');
		});

		test('GIVEN no limit provided THEN never fail on size', async () => {
			// Kept under the default TagLimit of 2000, which truncates the tag body before the
			// character limit ever gets a say.
			expect(await body(ts.run(`{upper:${'a'.repeat(1_500)}}`))).toHaveLength(1_500);
		});
	});

	describe('TagLimit', () => {
		test('GIVEN a low tag limit THEN truncate the tag body rather than failing', async () => {
			const rendered = await body(ts.run('{upper:abcdefghij}').pipe(Effect.provideService(TagLimit, 8)));

			expect(rendered).not.toBe('ABCDEFGHIJ');
		});
	});

	describe('ParameterSyntax', () => {
		const vars = { args: new StringTransformer('one two') };
		const varsTs = new Interpreter(
			definePlugin({
				names: ['args'],
				parse: (ctx) => Effect.succeed(ctx.response.variables.args.transform(ctx.tag)),
			}),
		);

		test('GIVEN Dot only THEN a parenthesis parameter is not read as one', async () => {
			const rendered = await body(
				varsTs.run('{args(1)}', { seedVariables: vars }).pipe(Effect.provideService(ParameterSyntax, ParenType.Dot)),
			);

			expect(rendered).not.toBe('one');
		});

		test('GIVEN the default THEN both syntaxes work', async () => {
			expect(await body(varsTs.run('{args(1)}', { seedVariables: vars }))).toBe('one');
			expect(await body(varsTs.run('{args.1}', { seedVariables: vars }))).toBe('one');
		});
	});

	describe('the requirement channel', () => {
		class OnCooldown extends Data.TaggedError('OnCooldown')<{ readonly retryAfter: number }> {}

		class CooldownStore extends Context.Service<
			CooldownStore,
			{
				readonly check: () => Effect.Effect<number | null>;
			}
		>()('test/CooldownStore') {
			static readonly onCooldown = Layer.sync(CooldownStore)(() =>
				CooldownStore.of({ check: () => Effect.succeed(42) }),
			);

			static readonly free = Layer.sync(CooldownStore)(() => CooldownStore.of({ check: () => Effect.succeed(null) }));
		}

		const cooldown = definePlugin<OnCooldown, CooldownStore>({
			names: ['cd'],
			parse: Effect.fnUntraced(function* () {
				const store = yield* CooldownStore;
				const retryAfter = yield* store.check();
				if (retryAfter !== null) return yield* new OnCooldown({ retryAfter });
				return '';
			}),
		});

		const cooldownTs = new Interpreter<OnCooldown, CooldownStore>(cooldown);

		test('GIVEN a parser error THEN it reaches the caller rather than the response', async () => {
			const { failure } = await outcome(cooldownTs.run('{cd}').pipe(Effect.provide(CooldownStore.onCooldown)));

			expect(failure).toBeInstanceOf(OnCooldown);
			expect((failure as OnCooldown).retryAfter).toBe(42);
		});

		test('GIVEN catchTag at the call site THEN the caller can recover', async () => {
			const recovered = await run(
				cooldownTs.run('{cd}').pipe(
					Effect.map((response) => response.body),
					Effect.catchTag('OnCooldown', (error) => Effect.succeed(`wait ${error.retryAfter}s`)),
					Effect.catchTag('WorkloadExceededError', () => Effect.succeed('too big')),
					Effect.provide(CooldownStore.onCooldown),
				),
			);

			expect(recovered).toBe('wait 42s');
		});

		test('GIVEN the service says no cooldown THEN the render succeeds', async () => {
			const rendered = await body(cooldownTs.run('a {cd} b').pipe(Effect.provide(CooldownStore.free)));

			expect(rendered).toBe('a  b');
		});
	});
});
