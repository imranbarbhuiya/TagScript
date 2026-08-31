import { describe, expect, test } from 'bun:test';

import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as TestClock from 'effect/testing/TestClock';
import { Interpreter, TagLimit, TemplateError } from 'tagscript/effect';

import { CooldownStore, OnCooldown, builtinParsers, cooldownParser, dateFormatParser } from '../../src/effect';

import type { Response } from 'tagscript/effect';

const run = async <A, E>(effect: Effect.Effect<A, E, never>) =>
	Effect.runPromise(effect as Effect.Effect<A, never, never>);

const ts = new Interpreter(...builtinParsers);

const render = async (template: string) => run(ts.run(template) as Effect.Effect<Response, never, never>);

describe('actions', () => {
	test('GIVEN a silent tag THEN record it and render nothing', async () => {
		const response = await render('a {silent} b');

		expect(response.actions.silentResponse).toBe(true);
		expect(response.body).toBe('a  b');
	});

	test.each(['delete', 'del'])('GIVEN the alias %s THEN mark the message for deletion', async (alias) => {
		expect((await render(`{${alias}}`)).actions.deleteMessage).toBe(true);
	});

	test.each([
		['{files:a.png,b.png}', ['a.png', 'b.png']],
		['{files:a.png~b.png}', ['a.png', 'b.png']],
		['{files:a.png}', ['a.png']],
	])('GIVEN %s THEN record the files', async (template, expected) => {
		expect((await render(template)).actions.files).toStrictEqual(expected);
	});

	test.each(['require', 'allowlist', 'whitelist'])('GIVEN the alias %s THEN record the ids', async (alias) => {
		expect((await render(`{${alias}(1, 2):members only}`)).actions.require).toStrictEqual({
			ids: ['1', '2'],
			message: 'members only',
		});
	});

	test.each(['deny', 'denylist', 'blacklist'])('GIVEN the alias %s THEN record the ids', async (alias) => {
		expect((await render(`{${alias}(1, 2):not you}`)).actions.deny).toStrictEqual({
			ids: ['1', '2'],
			message: 'not you',
		});
	});

	test('GIVEN two require tags THEN the first one wins', async () => {
		expect((await render('{require(1)} {require(2)}')).actions.require?.ids).toStrictEqual(['1']);
	});
});

describe('embedParser', () => {
	test('GIVEN a JSON payload THEN build the embed', async () => {
		const response = await render('{embed:{"title":"Hello!","description":"A test."}}');

		expect(response.actions.embed).toStrictEqual({ title: 'Hello!', description: 'A test.' });
	});

	test('GIVEN properties one at a time THEN merge them', async () => {
		const response = await render('{embed(title):Rules}{embed(description):Read them.}');

		expect(response.actions.embed).toStrictEqual({ title: 'Rules', description: 'Read them.' });
	});

	test('GIVEN a colour name THEN resolve it to a number', async () => {
		expect((await render('{embed(color):0x37b2cb}')).actions.embed?.color).toBe(3_650_251);
	});

	test('GIVEN a field THEN append it', async () => {
		const response = await render('{embed(field):Rule 1|Be nice.|true}');

		expect(response.actions.embed?.fields).toStrictEqual([{ name: 'Rule 1', value: 'Be nice.', inline: true }]);
	});

	test('GIVEN two fields THEN keep both', async () => {
		const response = await render('{embed(field):A|1|false}{embed(field):B|2|false}');

		expect(response.actions.embed?.fields).toHaveLength(2);
	});

	test.each(['image', 'thumbnail'])('GIVEN %s THEN wrap it as a url object', async (property) => {
		const response = await render(`{embed(${property}):https://example.com/a.png}`);

		expect(response.actions.embed).toStrictEqual({ [property]: { url: 'https://example.com/a.png' } });
	});

	test('GIVEN an author with a url and icon THEN keep all three', async () => {
		const response = await render('{embed(author):Parbez|https://example.com|https://example.com/a.png}');

		expect(response.actions.embed?.author).toStrictEqual({
			name: 'Parbez',
			url: 'https://example.com',
			icon_url: 'https://example.com/a.png',
		});
	});

	test('GIVEN a footer with no icon THEN keep just the text', async () => {
		expect((await render('{embed(footer):Posted by the mods}')).actions.embed?.footer).toStrictEqual({
			text: 'Posted by the mods',
		});
	});

	describe('malformed input', () => {
		test('GIVEN malformed JSON THEN raise a TemplateError', async () => {
			const response = await render('{embed:{bad}}');

			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect(response.body).toBe('embed was given something that is not valid JSON');
		});

		test('GIVEN malformed JSON in a property THEN name that property', async () => {
			const response = await render('{embed(author):{bad}}');

			expect(response.body).toBe('embed(author) was given something that is not valid JSON');
		});

		test('GIVEN no message leaked THEN the body never mentions JSON.parse', async () => {
			expect((await render('{embed:{bad}}')).body).not.toContain('JSON.parse');
		});
	});

	describe("Discord's limits", () => {
		test('GIVEN a title over 256 characters THEN say so in a message the author can act on', async () => {
			const response = await render(`{embed(title):${'a'.repeat(300)}}`);

			expect(response.errors[0]).toBeInstanceOf(TemplateError);
			expect(response.body).toBe('embed title is 300 characters, and Discord allows 256');
		});

		test('GIVEN a title inside the limit THEN accept it', async () => {
			expect((await render(`{embed(title):${'a'.repeat(256)}}`)).errors).toStrictEqual([]);
		});

		test('GIVEN a description over 4096 characters THEN say so, once the tag limit allows it', async () => {
			const response = await run(
				ts
					.run(`{embed(description):${'a'.repeat(5_000)}}`)
					.pipe(Effect.provideService(TagLimit, 10_000)) as Effect.Effect<Response, never, never>,
			);

			expect(response.body).toBe('embed description is 5000 characters, and Discord allows 4096');
		});

		test('GIVEN a property with no limit THEN leave it alone', async () => {
			expect((await render(`{embed(url):${'a'.repeat(500)}}`)).errors).toStrictEqual([]);
		});
	});
});

describe('dateFormatParser', () => {
	const dates = new Interpreter(dateFormatParser);

	// The classic parser calls `Date.now()` and cannot be pinned. This one reads the clock, so a
	// test can put it at a known instant and assert on the output.
	const NEW_YEAR_2025 = 1_735_689_600_000;

	const at = (template: string) =>
		run(
			Effect.gen(function* () {
				yield* TestClock.setTime(NEW_YEAR_2025);
				const response = yield* dates.run(template);
				return response.body;
			}).pipe(Effect.provide(TestClock.layer())) as Effect.Effect<string | null, never, never>,
		);

	test('GIVEN a millisecond timestamp THEN convert it to seconds', async () => {
		expect(await at('{date(R):1735689600000}')).toBe('<t:1735689600:R>');
	});

	test('GIVEN a second timestamp THEN leave it alone', async () => {
		expect(await at('{date(f):1735689600}')).toBe('<t:1735689600:f>');
	});

	test('GIVEN no style THEN default to f', async () => {
		expect(await at('{date:1735689600000}')).toBe('<t:1735689600:f>');
	});

	test.each(['f', 'F', 't', 'T', 'R'])('GIVEN the style %s THEN use it', async (style) => {
		expect(await at(`{date(${style}):1735689600000}`)).toBe(`<t:1735689600:${style}>`);
	});

	test('GIVEN a style Discord does not have THEN leave the tag untouched', async () => {
		expect(await at('{date(z):1735689600000}')).toBe('{date(z):1735689600000}');
	});

	test('GIVEN a date string THEN parse it', async () => {
		expect(await at('{date(R):2025-01-01T00:00:00.000Z}')).toBe('<t:1735689600:R>');
	});

	test('GIVEN something that is not a date THEN raise a TemplateError', async () => {
		const response = await run(dates.run('{date(R):not a date}') as Effect.Effect<Response, never, never>);

		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect(response.body).toContain('cannot read');
	});

	test.each(['unix', 'currenttime'])('GIVEN %s THEN render the pinned clock, not the wall clock', async (alias) => {
		expect(await at(`{${alias}}`)).toBe(`${NEW_YEAR_2025}`);
	});

	test('GIVEN no payload THEN use the pinned clock', async () => {
		expect(await at('{date(R)}')).toBe('<t:1735689600:R>');
	});
});

describe('cooldownParser', () => {
	const cooldowns = new Interpreter(cooldownParser);

	const render = (template: string, layer = CooldownStore.memory) =>
		cooldowns.run(template, { keyValues: { tagName: 'demo' } }).pipe(Effect.provide(layer));

	test('GIVEN a first use THEN let it through', async () => {
		const response = await run(render('{cd(5):wait}'));

		expect(response.body).toBe('');
	});

	test('GIVEN a second use inside the window THEN fail with OnCooldown', async () => {
		const program = Effect.gen(function* () {
			yield* cooldowns.run('{cd(5):wait}', { keyValues: { tagName: 'demo' } });
			return yield* cooldowns.run('{cd(5):wait}', { keyValues: { tagName: 'demo' } });
		}).pipe(
			Effect.map(() => null),
			Effect.catchTag('OnCooldown', (error) => Effect.succeed(error)),
			Effect.provide(CooldownStore.memory),
		);

		const error = await run(program as Effect.Effect<OnCooldown | null, never, never>);

		expect(error).toBeInstanceOf(OnCooldown);
		expect(error!.retryAfter).toBeGreaterThan(0);
		expect(error!.name).toBe('demo');
	});

	test('GIVEN a payload THEN fill in retryAfter and name', async () => {
		const program = Effect.gen(function* () {
			yield* cooldowns.run('{cd(5):{name} is on cooldown for {retryAfter}s}', {
				keyValues: { tagName: 'demo' },
			});
			return yield* cooldowns.run('{cd(5):{name} is on cooldown for {retryAfter}s}', {
				keyValues: { tagName: 'demo' },
			});
		}).pipe(
			Effect.map(() => null),
			Effect.catchTag('OnCooldown', (error) => Effect.succeed(error.message)),
			Effect.provide(CooldownStore.memory),
		);

		expect(await run(program as Effect.Effect<string | null, never, never>)).toBe('demo is on cooldown for 5s');
	});

	test('GIVEN different tag names THEN they do not share a cooldown', async () => {
		const program = Effect.gen(function* () {
			yield* cooldowns.run('{cd(5)}', { keyValues: { tagName: 'one' } });
			return yield* cooldowns.run('{cd(5)}', { keyValues: { tagName: 'two' } });
		}).pipe(Effect.provide(CooldownStore.memory));

		expect((await run(program as Effect.Effect<Response, never, never>)).body).toBe('');
	});

	test('GIVEN a parameter that is not a number THEN raise a TemplateError', async () => {
		const response = await run(render('{cd(soon):wait}') as Effect.Effect<Response, never, never>);

		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect(response.body).toBe('cooldown needs a number of seconds');
	});

	test('GIVEN no parameter THEN leave the tag untouched', async () => {
		expect((await run(render('{cd}') as Effect.Effect<Response, never, never>)).body).toBe('{cd}');
	});

	test('GIVEN a store that never blocks THEN every use passes', async () => {
		const open = Layer.sync(CooldownStore)(() => CooldownStore.of({ hit: () => Effect.succeed(null) }));
		const program = Effect.gen(function* () {
			yield* cooldowns.run('{cd(5)}');
			return yield* cooldowns.run('{cd(5)}');
		}).pipe(Effect.provide(open));

		expect((await run(program as Effect.Effect<Response, never, never>)).body).toBe('');
	});
});

describe('CooldownStore.memory', () => {
	const hit = (key: string, seconds: number) =>
		Effect.gen(function* () {
			const store = yield* CooldownStore;
			return yield* store.hit(key, seconds);
		});

	test('GIVEN a first hit THEN report no cooldown', async () => {
		expect(await run(hit('a', 5).pipe(Effect.provide(CooldownStore.memory)))).toBeNull();
	});

	test('GIVEN a second hit THEN report the seconds left', async () => {
		const program = Effect.gen(function* () {
			yield* hit('a', 5);
			return yield* hit('a', 5);
		}).pipe(Effect.provide(CooldownStore.memory));

		expect(await run(program)).toBe(5);
	});

	test('GIVEN separate keys THEN they do not interfere', async () => {
		const program = Effect.gen(function* () {
			yield* hit('a', 5);
			return yield* hit('b', 5);
		}).pipe(Effect.provide(CooldownStore.memory));

		expect(await run(program)).toBeNull();
	});
});
