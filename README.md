<div align="center">

<img alt="TagScript Logo" src="https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png" height="200"/>

# TagScript

**A sandboxed template language for text your users write.**

[![Continuous Integration](https://github.com/imranbarbhuiya/TagScript/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/imranbarbhuiya/TagScript/actions/workflows/continuous-integration.yml)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)
[![npm](https://img.shields.io/npm/v/@tagscript/plugin-discord?color=crimson&logo=npm&style=flat-square&label=@tagscript/plugin-discord)](https://www.npmjs.com/package/@tagscript/plugin-discord)

</div>

## What is TagScript?

TagScript is a template language for the case where **the person writing the template is not the person who wrote the app**. A Discord server admin building a custom command. A user customising their profile. A support team editing an auto-reply.

You cannot hand those people a JavaScript template literal, Handlebars or EJS: those languages assume the template author is trusted. TagScript assumes the opposite. A template is plain text sprinkled with `{tags}`, and the interpreter knows **nothing** except the parsers you explicitly register.

```ts
import { Interpreter, RandomParser } from 'tagscript';

const ts = new Interpreter(new RandomParser());

(await ts.run('{random:heads,tails}')).body; // -> 'tails'
(await ts.run('{if(1==1):yes|no}')).body; // -> '{if(1==1):yes|no}', no IfStatementParser registered
```

There is no host object to reach, no prototype to walk, no `require` to find. An unknown tag is not an error and not a crash. It stays in the output as literal text. The blast radius of a bad template is the template itself.

### What that buys you

- **A capability allowlist, not a sandbox-escape hunt.** The interpreter has no built-in tags at all. `new Interpreter()` renders plain text and nothing else. Every capability is a parser you passed in.
- **Templates ask, they never do.** A template cannot send a message, delete a message or set a cooldown. It can only record a _request_ on `response.actions`, which your code reads and decides on. See [Actions](#actions-templates-ask-your-code-decides).
- **Bounded work.** `charLimit` and `tagLimit` cap how much output a single render may produce and how much of a tag body is read, so nobody hands you a template that expands forever.
- **Data you choose to expose.** Values reach a template through transformers, which expose a fixed set of keys and never the object underneath.

## Anatomy of a tag

```yaml
{declaration(parameter):payload}
{declaration.parameter:payload}
```

| Part            | Required | Notes                                                                                      |
| --------------- | -------- | ------------------------------------------------------------------------------------------ |
| **declaration** | yes      | The tag name, e.g. `if`, `random`, `upper`. Matched case-insensitively; most have aliases. |
| **parameter**   | varies   | `(...)` or `.` form. The `.` form ends at the `:` or at the end of the tag.                |
| **payload**     | varies   | Everything after the first un-nested `:`, up to the closing `}`.                           |

Tags nest, and inner tags resolve first, so `{upper:{lower:ABC}}` renders `lower` before `upper`. Anything outside braces is plain text. Prefix a `{`, `}`, `(`, `)`, `:` or `|` with a backslash to stop it being read as syntax.

## Quick start

```sh
npm install tagscript
```

```ts
import { FiftyFiftyParser, IfStatementParser, Interpreter, RandomParser, SliceParser } from 'tagscript';

const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());

const response = await ts.run(
	'{random:Parbez,Rkn,Priyansh} attempts to pick the lock! I pick {if({5050:.}!=):heads|tails}',
);

response.body; // -> 'Parbez attempts to pick the lock! I pick heads'
response.raw; // the original template
response.actions; // what the template asked for
```

`run()` returns a [`Response`](https://tagscript.js.org/api/tagscript/classes/Response), not a string. The rendered text is `response.body`.

## The two extension points

**Parsers** implement tags. A parser declares which tag names it accepts and returns the string that replaces the tag, or `null` to decline, letting the next parser try.

```ts
import { BaseParser, type Context, type IParser } from 'tagscript';

class ShoutParser extends BaseParser implements IParser {
	public constructor() {
		super(['shout'], false, true); // accepted names, requires parameter, requires payload
	}

	public parse(ctx: Context) {
		return `${ctx.tag.payload!.toUpperCase()}!!!`;
	}
}

(await new Interpreter(new ShoutParser()).run('{shout:hello}')).body; // -> 'HELLO!!!'
```

**Transformers** supply the values behind variables. You seed them per render and the template reaches them by name, but only through the keys the transformer chooses to expose.

```ts
import { Interpreter, StrictVarsParser, StringTransformer } from 'tagscript';

const ts = new Interpreter(new StrictVarsParser());

(await ts.run('Hi {user}, your surname is {user(2)}', { user: new StringTransformer('Parbez Barbhuiya') })).body;
// -> 'Hi Parbez Barbhuiya, your surname is Barbhuiya'
```

The full list of built-in parsers and transformers is in the [`tagscript` README](./packages/tagscript#built-in-parsers).

## Actions: templates ask, your code decides

This is the part that makes TagScript usable for untrusted authors. A parser never performs a side effect. It records one on `response.actions` as a plain, inspectable object. Nothing happens until your code chooses to act on it.

```ts
const response = await ts.run(`
  {embed(title):Server Rules}
  {embed(color):0x37b2cb}
  {embed(field):Rule 1|Be nice.|false}
  {cooldown(30):Slow down, try again in {retryAfter}.}
  {require(Moderator)}
  {delete}
  Posted {date:2020-01-01}
`);
```

```jsonc
{
	"body": "Posted <t:1577836800:f>",
	"actions": {
		"embed": {
			"title": "Server Rules",
			"color": 3650251,
			"fields": [{ "name": "Rule 1", "value": "Be nice.", "inline": false }],
		},
		"cooldown": { "cooldown": 30, "message": "Slow down, try again in {retryAfter}." },
		"require": { "ids": ["Moderator"], "message": null },
		"deleteMessage": true,
	},
}
```

The template asked to post an embed, rate-limit itself, restrict itself to moderators and delete the trigger message. Your bot is free to honour all of that, some of it or none of it, and to enforce its own ceilings on top. Cap that 30 second cooldown request at whatever the user is actually allowed.

`IActions` is declaration-merged, so plugins and your own parsers add their own typed fields to it.

## Packages

| Package                                                            | Version                                                                                                                                            | Description                                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`tagscript`](./packages/tagscript)                                | [![npm](https://img.shields.io/npm/v/tagscript?style=flat-square&label=)](https://www.npmjs.com/package/tagscript)                                 | The interpreter, plus the built-in parsers and transformers. No dependencies.     |
| [`@tagscript/plugin-discord`](./packages/tagscript-plugin-discord) | [![npm](https://img.shields.io/npm/v/@tagscript/plugin-discord?style=flat-square&label=)](https://www.npmjs.com/package/@tagscript/plugin-discord) | Discord parsers and transformers for embeds, cooldowns, permissions and mentions. |

`tagscript` ships ESM, CJS and an IIFE build (global `TagScript`), and has no runtime dependencies.

Full documentation, including every built-in tag, is at **[tagscript.js.org](https://tagscript.js.org/)**.

## Development

This repository uses [Bun](https://bun.sh) as its package manager and script runner, [Turborepo](https://turborepo.com) for task orchestration, and [Oxlint](https://oxc.rs/docs/guide/usage/linter) / [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for linting and formatting.

```sh
bun install

bun run build      # build every workspace
bun run test       # run the test suites with `bun test`
bun run typecheck  # typecheck every workspace
bun run lint       # oxlint, autofixing what it can (type-aware, so run `bun run build` first)
bun run format     # oxfmt
```

### Releasing

Versions are bumped locally with `bun run bump`, which asks which packages to release and then runs [cliff-jumper](https://github.com/favware/cliff-jumper) in each of them. cliff-jumper writes the changelog and creates a tag such as `tagscript@1.4.0`. Use `bun run check-update` to see what each package would be bumped to without changing anything.

```sh
bun run bump
git push --follow-tags
```

Pushing that tag triggers the `Continuous Delivery` workflow, which publishes the matching package to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements) and opens a GitHub release using that version's section of the package `CHANGELOG.md` as the release notes.

## Buy me some doughnuts

If you want to support me by donating, you can do so by using any of the following methods. Thank you very much in advance!

<a href="https://www.buymeacoffee.com/parbez" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
<a href='https://ko-fi.com/Y8Y1CBIJH' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contributors

Thanks goes to these wonderful people:

<a href="https://github.com/imranbarbhuiya/TagScript/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=imranbarbhuiya/TagScript" />
</a>

## Special thanks

- [JonSnowbd](https://github.com/JonSnowbd/) for creating [TagScript](https://github.com/JonSnowbd/TagScript) in Python, which this project is a TypeScript reimagining of.
