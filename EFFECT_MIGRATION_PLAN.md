# Effect v4 migration plan for TagScript

Research date: 2026-08-30. Verified against `effect@4.0.0-rc.112` installed in a scratch dir,
not from memory. Every size and timing number below was measured, not quoted from marketing.

## 1. State of Effect v4

| fact          | value                                                                                  |
| ------------- | -------------------------------------------------------------------------------------- |
| npm `latest`  | `3.22.1` (still v3)                                                                    |
| npm `rc`      | `4.0.0-rc.112`                                                                         |
| npm `beta`    | `4.0.0-beta.107`                                                                       |
| stable target | Q3/Q4 2026 (per the RC announcement)                                                   |
| TypeScript    | 5.9+ required, 7 recommended. We're on `^6.0.3`, fine                                  |
| module format | ESM only, with no `require` condition and no `.cjs` in `dist`. Not a blocker, see §2.3 |
| runtime deps  | `fast-check`, `msgpackr`                                                               |

Structural changes that matter to us:

- **One version across the ecosystem.** `@effect/platform`, `@effect/rpc`, `@effect/cluster` etc.
  are folded into core `effect`; what stays separate (`@effect/platform-*`, `@effect/sql-*`,
  `@effect/ai-*`, `@effect/vitest`) shares the same version number.
- **`effect/unstable/*`** subpaths (ai, cli, http, rpc, schema, sql, …) may break in minors.
  Anything we depend on must come from the stable top level.
- `Context.Tag` / `Effect.Tag` / `Effect.Service` → **`Context.Service`**. Static accessor proxies
  are gone; use `yield*` (preferred) or `Service.use`.
- `FiberRef` → `Context.Reference`.
- `Effect.catchAll` → `Effect.catch`; `catchAllCause` → `catchCause`; `catchSome` → `catchFilter`.
  `catchTag`/`catchTags`/`catchIf` unchanged. New: `catchReason`, `catchReasons`, `catchEager`.
- `Either` → `Result`. `Cause` flattened from a recursive tree to a wrapper over an array of reasons.
- **Yieldable trait** replaces Effect subtyping. `Option`, `Result`, `Config`, `Context.Service` are
  `yield*`-able but are no longer assignable to `Effect`; use `.asEffect()` for combinators.
- `Effect.gen(this, fn)` → `Effect.gen({ self: this }, fn)`.
- `Runtime<R>` removed from the public API; `ManagedRuntime` is the bridge to non-Effect code.
- House style: `Effect.gen` inline, `Effect.fn("name")` for reusable traced functions,
  **`Effect.fnUntraced` for library hot paths**, that's us.

Sources: [MIGRATION.md](https://github.com/Effect-TS/effect/blob/main/MIGRATION.md),
[LLMS.md](https://github.com/Effect-TS/effect/blob/main/LLMS.md),
[migration/services.md](https://github.com/Effect-TS/effect/blob/main/migration/services.md),
[migration/error-handling.md](https://github.com/Effect-TS/effect/blob/main/migration/error-handling.md),
[migration/yieldable.md](https://github.com/Effect-TS/effect/blob/main/migration/yieldable.md),
[v4.0 RC announcement](https://www.effect.website/blog/releases/effect/40-rc).

## 2. Measured cost

### Bundle size

Measured with **rolldown 1.2.6**, which is what `tsdown` uses, so these are the numbers this repo's
build actually produces. An earlier pass with esbuild gave badly misleading results, see §2.1.

| what                                                        | gzip        | raw     |
| ----------------------------------------------------------- | ----------- | ------- |
| **tagscript today, whole library, minified**                | **3.7 KB**  | 12.1 KB |
| tagscript today, unminified (what we ship, `minify: false`) | 8.8 KB      | 35.4 KB |
| effect: `effect/Effect` only                                | 7.8 KB      | 22.1 KB |
| effect: + `Data.TaggedError` + `catchTag`                   | 8.3 KB      | 23.9 KB |
| effect: + `Context.Service` + `Layer`                       | 11.4 KB     | 32.8 KB |
| effect: + `Random` + `Context.Reference`                    | **11.6 KB** | 33.2 KB |
| effect: barrel `import { Effect } from "effect"`            | 8.3 KB      | 23.9 KB |
| effect: + `Schema.TaggedError`                              | 19.6 KB     | 59.2 KB |

So an Effect-native core lands around **3.7 + 11.6 ≈ 15 KB gz**, roughly **4x** the current library.
For a Discord bot that is irrelevant. It only matters for the browser and CDN story.

### 2.1 Do not trust esbuild for these measurements

Michael Arnaldi (Effect BDFL) flagged this directly: _"don't use esbuild to minify, it's the worst,
if you want to use esbuild you will need to care about import style a lot."_ He is right, and it
changed two of the three conclusions in the first draft of this plan:

|                                 | esbuild | rolldown | esbuild's error |
| ------------------------------- | ------- | -------- | --------------- |
| `Data.TaggedError` + `catchTag` | 9.5 KB  | 8.3 KB   | +14%            |
| barrel `from "effect"`          | 28.9 KB | 8.3 KB   | **+248%**       |
| `Schema.TaggedError`            | 87.7 KB | 19.6 KB  | **+348%**       |

The "barrel imports cost 3x" and "Schema is 9x our whole library" rules from the first draft were
both esbuild artifacts. Corrected positions:

1. **Still use deep imports** (`effect/Effect`), but for a different reason. They cost nothing under
   rolldown, and they protect _consumers_ who bundle with esbuild, tsup or bun build, which is a
   large share of the JS ecosystem. It is free insurance on our side of the boundary.
2. **`Data.TaggedError` in core, `Schema` allowed in plugins.** `Data` is still the right call for the
   error hierarchy (0.5 KB vs 11.3 KB). But Schema at 19.6 KB is no longer disqualifying, which
   reopens something genuinely attractive: `EmbedParser` could validate against a real `APIEmbed`
   schema instead of casting an unvalidated `JSON.parse` result. That is worth costing out in
   Phase 2 rather than ruling out here.
3. Whatever we do, **benchmark with the tool that will actually bundle it**, and re-measure per
   bundler before quoting a number in the README.

### 2.2 Runtime

| what                                | measured |
| ----------------------------------- | -------- |
| `Effect.runPromise` over 30 yields  | 3.2 µs   |
| `Effect.runSync` over 30 yields     | 3.2 µs   |
| `Effect.runSync(Effect.succeed(1))` | 0.02 µs  |

Current interpreter, median ns/op from `bun run bench` on an M3:

| case                                              | ns/op   |
| ------------------------------------------------- | ------- |
| plain text, no tags                               | 211     |
| single tag                                        | 1,672   |
| escaped braces only                               | 1,590   |
| nested tags                                       | 6,100   |
| deeply nested                                     | 8,090   |
| typical template (6 nodes, 18 parsers registered) | 9,175   |
| fifty tags                                        | 102,880 |

Note these are with all eighteen parsers registered, so they include the `willAccept` fan-out that
`asyncFilter` pays per node. The single-parser numbers in the `parsers` group run 600 to 1,500 ns.

A typical template is ~30 Effect operations, so expect **+3 µs, around +50% on the typical case**.

I guessed there might be an offsetting win here, on the grounds that no parser in either package is
actually async yet every node pays for `asyncFilter`'s `Promise.all` plus an `await` per `parse`.
Phase 1 shipped and the benchmark says no. Measured head to head, same eighteen parsers, same
templates, on an M3:

| Template            | Classic | Effect   | Classic is  |
| ------------------- | ------- | -------- | ----------- |
| plain text, no tags | 228 ns  | 1.22 µs  | 5.4x faster |
| single tag          | 1.85 µs | 2.64 µs  | 1.4x faster |
| nested tags         | 6.58 µs | 8.77 µs  | 1.3x faster |
| typical template    | 9.28 µs | 12.22 µs | 1.3x faster |
| fifty tags          | 91.9 µs | 116.2 µs | 1.3x faster |

The shape is about 1 µs fixed for the fiber each `run` starts, plus roughly 0.5 µs per tag. A
template with no tags pays only the fixed cost, which is why it looks worst in relative terms while
being 1 µs in absolute terms.

`Effect.runSync` completes a render, because every built-in parser is synchronous, and is only 4%
faster than `Effect.runPromise`. So the cost is the fiber, not the promise wrapping, and there is no
sync-first trick left to find. The +3 µs I predicted for the typical case was right; the "+50%" was
pessimistic and the "might be faster" was wrong.

The classic path did not regress from any of this: typical template went 9175 ns to 9327 ns, within
noise.

### 2.3 ESM-only is not a blocker

`effect` ships ESM only. That was the headline risk in the first draft and it does not survive
scrutiny:

- `require(esm)` is unflagged and **stable** on `^20.19.0 || >=22.12.0`, and Bun has always
  supported it. Verified: `require('effect')` and `require('effect/Effect')` both work from CJS on
  Node 24, returning all 143 exports.
- It only breaks if the ESM graph uses top-level await, and `effect`'s `dist` has none. Checked.

So the CJS build keeps working. The README should state a Node floor of `^20.19.0 || >=22.12.0` for
the Effect entry point, and note that older Node needs either an upgrade or a move to ESM. Worth fixing
regardless: `packages/tagscript/package.json` still declares `"node": ">=v14.0.0"`, which has been
wrong for a long time.

### 2.4 The IIFE build can go

Confirmed by resolving `import { Interpreter } from 'tagscript'` through a real bundler at three
platform settings:

| bundler platform | resolves to      |
| ---------------- | ---------------- |
| `browser`        | `dist/index.mjs` |
| `neutral`        | `dist/index.mjs` |
| `node`           | `dist/index.mjs` |

Because `package.json` has an `exports` map, it wins over `browser`, `module` and `main` in every
modern bundler. **A React, Vite, Next or webpack 5 consumer already gets the ESM build and has never
touched the IIFE.** The IIFE is reachable only through:

- `<script src="unpkg.com/tagscript">`, a direct CDN script tag
- webpack 4 and browserify, which predate `exports`

Dropping it removes a third of the build matrix and one of the three artifacts. `esm.sh/tagscript`
and `cdn.jsdelivr.net/npm/tagscript/+esm` both cover the script-tag case with no work on our side.
Recommend dropping it in the same major as the rest, keeping the `unpkg` field pointed at the ESM
build.

### 2.5 Remaining friction

- Every third-party parser needs rewriting for the Effect entry point. Today a parser is ~10 lines of
  plain TypeScript with no dependencies.
- We would ship a stable library against an RC until Effect 4.0 GAs.
- `effect`'s `.d.ts` reference DOM globals (`AbortSignal`, `ReadableStream`, `URL`, `FormData`). The
  root `tsconfig.json` sets no `lib`, so `target: esnext` gives `lib.esnext.full`, which includes
  DOM. Fine today; never pin `lib` without DOM.

## 3. What we actually gain

Ranked by how much it matters for _this_ codebase, not in the abstract.

### 3.1 A requirements channel for plugins, the headline

This is the one thing that is genuinely impossible today. `CooldownParser`
(`packages/tagscript-plugin-discord/src/lib/Parsers/Cooldown.ts:26`) cannot enforce a cooldown. It
writes `ctx.response.actions.cooldown = { cooldown, message }` and hands the problem to the bot
author. A parser that needs a Redis client, a database, or an HTTP call has no typed way to ask for
one, `IKeyValues` module augmentation is the current workaround, and it's a global, app-wide,
untyped-by-construction escape hatch.

With Effect the parser declares its needs in the type and the compiler forces the app to supply them:

```ts
Parser<OnCooldown, CooldownStore>; // needs a CooldownStore, can fail with OnCooldown
```

`Effect.provide(CooldownStore.redis(client))` at the call site, or it doesn't compile.

### 3.2 Typed errors, largely delivered by Phase 0 without Effect

This was the second headline in the first draft. Phase 0 has now shipped most of the value with no
dependency at all, so it is no longer an argument _for_ Effect, but it does set the shape the
Effect entry point should mirror.

What was wrong: `Interpreter.solve` caught everything a parser threw and returned
`` `${final.slice(0, start)} ${error.message}` ``, splicing the raw message into user-visible text
and **dropping every tag after it**. `EmbedParser` called bare `JSON.parse` on template input, so
malformed embed JSON produced a body like `Hello Unexpected token } in JSON at position 14` with the
rest of the template gone.

The catch is that this was _also_ how `{stop}` worked, deliberately. `StopParser` threw an `Error`
to halt the render. So one mechanism was doing two unrelated jobs: intentional halt, and accidental
crash.

Phase 0 separates them along the line you drew: whose mistake is it?

| The parser raises       | The body gets                       | `response.errors` gets                 |
| ----------------------- | ----------------------------------- | -------------------------------------- |
| `TemplateError`         | the error's message, as written     | the `TemplateError`                    |
| anything else           | `GENERIC_PARSER_ERROR_MESSAGE`      | a `ParserError`, real error on `cause` |
| `StopSignal`            | the render so far, then its message | nothing, this is control flow          |
| `WorkloadExceededError` | ,                                   | rejects out of `run`                   |

A template author has no console and no stack trace, so a mistake **they** can fix is worth putting
in front of them. A bug in a parser is not theirs to fix, tells them nothing, and can leak internals
into a public channel, so it gets a generic line and the real error is kept on `response.errors`
for the developer.

Rendering now also **continues past a failed tag** instead of truncating, so one bad `{embed}` no
longer eats the rest of the message.

The Effect entry point should keep exactly this split, as
`TemplateError | ParserError | WorkloadExceededError` in the `E` channel, with `StopSignal` staying
control flow rather than an error.

### 3.3 Testable randomness and time

`RandomParser` and `FiftyFiftyParser` call `Math.random()`; the Discord plugin's `DateFormatParser`
reads `Date`. You currently cannot snapshot-test `{random:a,b,c}`. `effect/Random` +
`TestClock`/`DateTime` make both deterministic and seedable. For a _template engine_ that is a real,
user-visible quality win, not architecture astronomy.

### 3.4 Timeouts and interruption

`charLimit` and `tagLimit` bound _work_, not _time_. A user-supplied async parser that hangs hangs
the bot forever with no recourse. `Effect.timeout("1 second")` over the whole run, with proper
interruption propagating into the parser, closes that hole. For a library whose pitch is
"a sandboxed template language for text **your users** write", this is on-mission.

### 3.5 A stronger sandbox story

`Effect.provide` with a restricted layer set is a materially better sandbox claim than "we don't hand
parsers a client object". Capability-by-construction rather than by convention.

### 3.6 Smaller wins

- `getAcceptors` can run predicates with real structured concurrency and cancellation instead of
  `Promise.all`, which can't cancel.
- `Effect.fn("Interpreter.processTags")` gives bot authors tracing spans for slow templates for free.
- `Context.Reference` replaces `run()`'s six positional parameters
  (`message, seedVariables, charLimit, tagLimit, parenType, keyValues`) with defaulted, overridable
  config. That signature is bad today regardless.

## 4. Recommended approach: two entry points, not a rewrite

**Do not force Effect on every consumer.** The classic API is small, dependency-free and works in
both CJS and ESM, and that is a large part of the package's value. A hard migration trades it away
for benefits only Effect users can collect, and quadruples the bundle (§2) for everyone else.

Instead:

- Keep the classic `tagscript` entry dependency-free. CJS + ESM.
- Add `tagscript/effect`, with `effect` as an **optional peer dependency**.
- Both entry points are thin wrappers over one engine, the split Phase 0 already made.

CJS consumers keep the classic entry either way, and per §2.3 `require(esm)` means even they could
reach the Effect entry point on a current Node.

### 4.1 Package layout

```
packages/tagscript/
  src/index.ts          -> classic entry point, no effect import  (esm + cjs)
  src/effect/index.ts   -> Effect entry point                     (esm only)
  src/core/             -> shared pure engine (node tree, text deform, lexer, workload)
```

```jsonc
// packages/tagscript/package.json
"exports": {
  ".": {
    "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
  },
  "./effect": {
    "types": "./dist/effect/index.d.mts",
    "default": "./dist/effect/index.mjs"
  }
},
"peerDependencies": { "effect": "^4.0.0-rc || ^4.0.0" },
"peerDependenciesMeta": { "effect": { "optional": true } }
```

`scripts/tsdown.config.ts` gains a second entry and `external: ['effect', /^effect\//]` so `effect`
is never inlined.

### 4.2 The Effect-native plugin contract

Verified to typecheck and run against `effect@4.0.0-rc.112`:

```ts
import * as Context from 'effect/Context';
import * as Data from 'effect/Data';
import * as Effect from 'effect/Effect';

export class TagParseError extends Data.TaggedError('TagParseError')<{
	readonly tag: string;
	readonly reason: string;
}> {}

export interface Parser<E = never, R = never> {
	readonly willAccept: (ctx: Context_) => Effect.Effect<boolean, E, R>;
	readonly parse: (ctx: Context_) => Effect.Effect<string | null, E, R>;
}

export const TagLimit = Context.Reference<number>('tagscript/TagLimit', {
	defaultValue: () => 2_000,
});

export class Interpreter<E = never, R = never> {
	constructor(...parsers: Parser<E, R>[]);
	run(message: string, seed?: Record<string, ITransformer>): Effect.Effect<Response, E | WorkloadExceeded, R>;
}
```

Note `Data.TaggedError`, not `Schema.TaggedError`, 0.5 KB against 11.3 KB for the same `catchTag`
behaviour. That is a core-package call, not a blanket ban: see §2.1 and Phase 2 item 21.

These mirror the `TemplateError` / `ParserError` / `WorkloadExceededError` / `StopSignal` split that
Phase 0 already landed on the classic entry point.

### 4.3 What a plugin author writes

**Today:**

```ts
export class CooldownParser extends BaseParser implements IParser {
	public constructor() {
		super(['cooldown', 'cd'], true);
	}
	public parse(ctx: Context) {
		ctx.response.actions.cooldown = { cooldown: Number.parseInt(ctx.tag.parameter!, 10), message: ctx.tag.payload };
		return '';
	}
}
```

**On the Effect entry point**, the parser can now actually enforce the cooldown:

```ts
export class CooldownStore extends Context.Service<
	CooldownStore,
	{
		readonly check: (key: string, seconds: number) => Effect.Effect<number | null>;
	}
>()('@tagscript/plugin-discord/CooldownStore') {
	static readonly memory = Layer.sync(CooldownStore)(() => {
		/* ... */
	});
}

export class OnCooldown extends Data.TaggedError('OnCooldown')<{ readonly retryAfter: number }> {}

export const cooldownParser: Parser<OnCooldown, CooldownStore> = {
	willAccept: (ctx) => Effect.succeed(['cooldown', 'cd'].includes(ctx.tag.declaration!)),
	parse: Effect.fnUntraced(function* (ctx) {
		const store = yield* CooldownStore;
		const retryAfter = yield* store.check(ctx.keyValues.tagName, Number(ctx.tag.parameter));
		if (retryAfter !== null) return yield* new OnCooldown({ retryAfter });
		return '';
	}),
};
```

**Call site:**

```ts
const response = await Effect.runPromise(
	ts.run(template, seed).pipe(
		Effect.provide(CooldownStore.redis(redis)),
		Effect.timeout('1 second'),
		Effect.catchTag('OnCooldown', (e) => Effect.succeed(`Try again in ${e.retryAfter}s`)),
	),
);
```

Migration shape for plugin authors, in one line each:

| classic                                         | effect                                                       |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `class X extends BaseParser implements IParser` | plain object literal satisfying `Parser<E, R>`               |
| `super(names, reqParam, reqPayload)`            | `willAccept` helper, or `definePlugin({ names, ... })` sugar |
| `parse(ctx): string \| null`                    | `parse: Effect.fnUntraced(function* (ctx) { ... })`          |
| `async parse` / `await`                         | `yield*`                                                     |
| `throw new TemplateError(msg)`                  | `return yield* new TemplateError({ ... })`                   |
| `throw new StopSignal(msg)`                     | `return yield* new StopSignal({ ... })`                      |
| needs a client → `IKeyValues` augmentation      | `yield* MyService`, declared in `R`                          |
| `ctx.response.actions.foo = x`                  | keep as-is, or a `Ref`/service                               |
| `Math.random()`                                 | `yield* Random.nextIntBetween(0, n)`                         |
| `Date.now()`                                    | `yield* DateTime.now`                                        |

### 4.4 Interop both ways

```ts
// classic parser -> effect parser. Always possible.
export const fromClassic = (p: IParser): Parser<UnknownParserError> => ({/* Effect.tryPromise */});

// effect parser -> classic parser. Only when R = never.
export const toClassic = <E>(p: Parser<E, never>): IParser => ({/* Effect.runPromise */});
```

The `R = never` constraint is the type-level statement of "this plugin needs services, so it cannot
be used from the classic API". That is exactly the right boundary and it's enforced by the compiler,
not by documentation.

## 5. Phases

### Phase 0: prep, no Effect dependency (done)

Landed on this branch, 157 tests passing, typecheck and lint clean.

1. **Error model split** (`src/lib/Errors/index.ts`, new): `TagScriptError` base, plus
   `TemplateError`, `ParserError`, `WorkloadExceededError` and `StopSignal`. All exported.
2. **`Interpreter.solve` reworked**: a failed tag is replaced in place and the render continues,
   instead of truncating the template. Errors collect on the new `Response.errors`.
3. **`StopParser` now throws `StopSignal`** rather than `Error`, so halt is a first-class signal
   instead of an accident of the catch-all.
4. **Pure engine extracted** to `src/lib/Interpreter/engine.ts`: `buildNodeTree`, `checkWorkload`,
   `textDeform`, `translateNodes`. This is the shared core both entry points will sit on, and it is what
   makes Phase 1 a wrapper rather than a fork.
5. **Options object for `run`**: `run(message, options?)` with `RunOptions`. The six-positional
   overload still works and is marked `@deprecated`. Discrimination is by key name, so a seed
   variable named `charLimit` is the one ambiguous case, documented, and the reason the positional
   overload survives.
6. **Template-author errors fixed at the source**: `EmbedParser` (both `JSON.parse` sites),
   `JSONVarParser` and `UrlDecodeParser` now raise `TemplateError` instead of leaking a `SyntaxError`
   or `URIError`. These were the three parsers that could put a developer's error message in front
   of a template author.
7. **Benchmark suite added**: 76 benchmarks across both packages on
   [mitata](https://github.com/evanwashere/mitata), the tool Bun's own docs recommend since Bun has
   no built-in runner. Covers the lexer, node tree, all nineteen core parsers, all four core
   transformers, all seven Discord parsers, all six Discord transformers, and end-to-end renders.
   `bun run bench` at the root runs both packages serially and merges the JSON. CI runs it on every
   push to main and every PR, comparing against a baseline stored on `gh-pages` via
   `benchmark-action/github-action-benchmark`. Reports always, alerts at 150%, never fails the
   build. See `packages/tagscript/bench/README.md`.
8. **Docs updated**: `interpreter.mdx` gained an Errors section and the options-object signature;
   `stop.mdx`, `json.mdx` and `url-encoding.mdx` corrected; package README updated.

**This is a breaking behaviour change**, so it belongs in a major, not a 2.1 as the first draft said:
a third-party parser that threw a plain `Error` to halt the render now gets the generic message and
continues instead. `StopSignal` is the documented replacement and the migration is one line.

### Phase 1: the Effect entry point (done)

Shipped in `409d13d` and `314ba71`, as the subpath `tagscript/effect` rather than a separate package.

9. `effect` as an optional peer dep, second tsdown entry, external so it is never bundled. Done.
10. Error types with `Data.TaggedError`, mirroring the Phase 0 split. Done.
11. `Parser<E, R>`, `definePlugin` and the `Interpreter`, over the Phase 0 engine. Done.
12. `fromClassic`, `toClassic` and `toPromise`. `toClassic` pins `R` to `never`. Done.
13. All 18 built-ins ported. `random`, `5050`, `range` and `rangef` draw from `effect/Random`. Done.
14. `CharLimit`, `TagLimit` and `ParameterSyntax` as `Context.Reference`. Done.
15. Lint rule preferring deep `effect/*` imports. **Not done.** Per §2.1 this costs nothing under
    rolldown and only protects consumers who bundle with esbuild, so it is insurance rather than a
    fix. Still worth adding.
16. IIFE build dropped, `unpkg` points at ESM. Done.
17. `engines.node` is `^20.19.0 || >=22.12.0` on both packages. Done.

104 tests cover it. Writing them turned up a real bug: Effect's `Random.nextIntBetween` includes
both bounds, unlike the `Math.floor(Math.random() * n)` idiom the classic parsers use, so `{range:5-7}`
could return 8 and `{random:a,b}` could index past the end and render nothing.

Two things came out differently from the plan. `@effect/vitest` is not used, because `it.effect` is
all it adds over `bun:test` and a second runner means a second config and coverage report. And the
performance guess in §2.2 was wrong, see the table there.

### Phase 2: the Discord plugin

18. `@tagscript/plugin-discord@5`, with the same two entry points.
19. `CooldownStore` service so `CooldownParser` actually enforces cooldowns; in-memory layer shipped,
    Redis layer documented.
20. `DateFormatParser` on `DateTime`/`Clock`.
21. **Cost out `Schema` for embed validation.** At 19.6 KB gz in a plugin that already depends on
    `discord-api-types`, validating `APIEmbed` properly instead of casting a `JSON.parse` result may
    well be worth it. This was ruled out on bad data in the first draft.

### Phase 3: docs and adoption

22. Website: an Effect section alongside the interpreter docs; §4.3's table as the plugin-author
    migration guide.
23. Decide `bun test` + `Effect.runPromise` vs adding `@effect/vitest` for `it.effect`.

### Phase 4: GA

24. When `effect@4.0.0` hits npm `latest`, widen the peer range and drop the `next` tag.

## 6. Open decisions

1. **Two entry points, decided, go.** Keep the classic entry dependency-free, and add `tagscript/effect`
   with `effect` as an optional peer.
2. **Ship on RC or wait for GA?** Publishing the Effect entry point under a `next` tag now gets feedback
   without putting an RC into anyone's `latest`. Recommended.
3. **Subpath vs a separate `@tagscript/effect` package.** A subpath keeps versions in lockstep and
   shares the engine with no duplication. Recommended; revisit if optional-peer warnings become a
   support burden.
4. **`bun test` vs `@effect/vitest`.** Adding vitest solely for `it.effect` is a real cost against a
   clean single-runner setup.
5. **Schema in the Discord plugin** (§2.1 item 2, Phase 2 item 21), genuinely open now that the
   number is 19.6 KB rather than 87.7 KB.
6. **Does anything actually consume the IIFE?** §2.4 says no bundler does. Worth a look at unpkg's
   download stats for `dist/index.iife.js` before dropping it, if that data is reachable.
