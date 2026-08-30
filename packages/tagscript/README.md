<div align="center">

# tagscript

**A sandboxed template language for text your users write.**

[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)
[![npm downloads](https://img.shields.io/npm/dw/tagscript?style=flat-square)](https://www.npmjs.com/package/tagscript)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=tagscript)](https://codecov.io/gh/imranbarbhuiya/tagscript)

</div>

## What is TagScript?

TagScript is a template language for the case where **the person writing the template is not the person who wrote the app**. A Discord server admin building a custom command. A user customising their profile. A support team editing an auto-reply.

A template is plain text sprinkled with `{tags}`, and the interpreter knows nothing except the parsers you explicitly register. There is no host object to reach, no prototype to walk, no `require` to find. An unknown tag is not an error and not a crash. It stays in the output as literal text.

```ts
import { Interpreter, RandomParser } from 'tagscript';

const ts = new Interpreter(new RandomParser());

(await ts.run('{random:heads,tails}')).body; // -> 'tails'
(await ts.run('{if(1==1):yes|no}')).body; // -> '{if(1==1):yes|no}', no IfStatementParser registered
```

Ships ESM, CJS and an IIFE build (global `TagScript`). No runtime dependencies.

## Installation

```sh
npm install tagscript
```

## Anatomy of a tag

```yaml
{declaration(parameter):payload}
{declaration.parameter:payload}
```

| Part            | Notes                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| **declaration** | The tag name, e.g. `if`, `random`, `upper`. Matched case-insensitively; most have aliases.  |
| **parameter**   | `(...)` or `.` form. The `.` form ends at the `:` or at the end of the tag. Often optional. |
| **payload**     | Everything after the first un-nested `:`, up to the closing `}`. Often optional.            |

Tags nest, and inner tags resolve first, so `{upper:{lower:ABC}}` renders `lower` before `upper`. Anything outside braces is plain text. Prefix a `{`, `}`, `(`, `)`, `:` or `|` with a backslash to stop it being read as syntax.

`ParenType` decides which parameter forms are legal per render. See [`run()` options](#run-options).

## Running a template

```ts
import { FiftyFiftyParser, IfStatementParser, Interpreter, RandomParser, SliceParser } from 'tagscript';

const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());

const response = await ts.run(
	'{random:Parbez,Rkn,Priyansh} attempts to pick the lock! I pick {if({5050:.}!=):heads|tails}',
);

response.body; // -> 'Parbez attempts to pick the lock! I pick heads'
```

`run()` resolves to a `Response`, not a string:

| Property    | Type                           | Description                                                                     |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `body`      | `string \| null`               | The rendered, trimmed output.                                                   |
| `raw`       | `string`                       | The template exactly as it was passed in.                                       |
| `actions`   | `IActions`                     | Side effects the template _requested_. Your code decides whether to honour any. |
| `variables` | `Record<string, ITransformer>` | Seeded variables plus anything a tag defined during the render.                 |
| `keyValues` | `IKeyValues`                   | Whatever you passed in for parsers to read. Untouched by the interpreter.       |

Parsers can also be swapped after construction with `ts.addParsers(...)` and `ts.setParsers(...)`.

### `run()` options

```ts
ts.run(message, options?);
```

| Option          | Default          | Description                                                                                   |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `message`       | required         | The template to render. Passed positionally.                                                  |
| `seedVariables` | `{}`             | Variables available to `StrictVarsParser` / `LooseVarsParser`, as name → transformer.         |
| `charLimit`     | `null`           | Max characters a render may produce. Exceeding it **rejects** out of `run()`. `null` disables it. |
| `tagLimit`      | `2000`           | Max characters read from inside a single `{...}`; the rest of that tag body is truncated.     |
| `parenType`     | `ParenType.Both` | Which parameter syntaxes are accepted: `Both`, `Parenthesis` or `Dot`.                        |
| `keyValues`     | `{}`             | Arbitrary data for your own parsers, reachable at `ctx.response.keyValues`.                   |

`charLimit` is your defence against a template that expands cheaply into a huge string, so set it whenever the template author is untrusted:

```ts
// rejects with a WorkloadExceededError if the render exceeds 2000 characters
await ts.run(template, { seedVariables: vars, charLimit: 2_000 });
```

The positional form, `run(message, seedVariables, charLimit, tagLimit, parenType, keyValues)`, still works and is deprecated.

### Errors

A parser failing does not reject and does not end the render — the interpreter replaces that one tag and carries on, recording what happened on `response.errors`.

| The parser raises | The body gets                       | `response.errors` gets                          |
| ----------------- | ----------------------------------- | ----------------------------------------------- |
| `TemplateError`   | the error's message, as written     | the `TemplateError`                             |
| anything else     | a generic message                   | a `ParserError`, with the real error on `cause` |
| `StopSignal`      | the render so far, then its message | nothing — this is control flow, not a failure   |

The person who wrote the template usually has no console, so raise a `TemplateError` for a mistake **they** can fix and its message is shown to them. Anything else is a bug in your parser, so the body gets a generic line and the real error is kept on `response.errors` for you.

## Built-in parsers

Nothing below is active until you pass it to the `Interpreter`.

### Logic and control flow

| Parser                        | Aliases                      | Example                                        | Result                                           |
| ----------------------------- | ---------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `IfStatementParser`           | `if`                         | `{if({args}==63):Correct!\|Try again.}`        | The branch before or after the `\|`.             |
| `UnionStatementParser`        | `any`, `or`, `union`         | `{any({a}==hi\|{a}==hey):Hello!\|How rude.}`   | First branch if **any** expression is true.      |
| `IntersectionStatementParser` | `all`, `and`, `intersection` | `{all({n}>=100\|{n}<=999):Ok.\|Out of range.}` | First branch if **all** expressions are true.    |
| `StopParser`                  | `stop`, `halt`, `error`      | `{stop({args}==):You must provide input.}`     | Halts the render; the payload becomes the body.  |
| `BreakParser`                 | `break`                      | `{break({args}==):No input.}`                  | Overrides the body but keeps parsing later tags. |

Comparison operators are `==`, `!=`, `>`, `<`, `>=` and `<=`. A bare `true`/`false` also works, and anything unrecognised evaluates as true.

`stop` and `break` differ in how far they go: `stop` ends the render there, `break` only replaces the final body while remaining tags still execute.

### Variables

| Parser             | Aliases                     | Example                                        | Result                                                   |
| ------------------ | --------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `StrictVarsParser` | none                        | `{user}`, `{user(2)}`                          | Resolves seeded/defined variables. Prefer this one.      |
| `LooseVarsParser`  | none                        | `{user}`                                       | Same, but the name is checked while parsing, not before. |
| `DefineParser`     | `=`, `assign`, `let`, `var` | `{=(prefix):!}` then `{prefix}`                | Defines a variable for the rest of the render.           |
| `JSONVarParser`    | `json`                      | `{json(u):{"name":"Parbez"}}` then `{u(name)}` | Defines a variable from a JSON payload.                  |

You need one of `StrictVarsParser` or `LooseVarsParser` registered for `{variable}` tags to resolve at all.

### Text

| Parser                | Aliases                                        | Example                                | Result                  |
| --------------------- | ---------------------------------------------- | -------------------------------------- | ----------------------- |
| `StringFormatParser`  | `lower`, `upper`, `capitalize`, `escape`       | `{upper:hi}`                           | `HI`                    |
| `OrdinalFormatParser` | `ord`, `ordinal`                               | `{ord:22}`                             | `22nd`                  |
| `ReplaceParser`       | `replace`                                      | `{replace(o,i):welcome to the server}` | `welcime ti the server` |
| `SliceParser`         | `slice`, `substr`, `substring`                 | `{slice(0-5):Hello World}`             | `Hello`                 |
| `IncludesParser`      | `in`, `includes`, `contain`, `index`, `lindex` | `{in(there):Hi there!}`                | `true`                  |
| `UrlEncodeParser`     | `urlencode`, `encodeuri`                       | `{urlencode:Hello World}`              | `Hello%20World`         |
| `UrlDecodeParser`     | `urldecode`                                    | `{urldecode:Hello%20World}`            | `Hello World`           |

`IncludesParser` covers four different questions depending on the alias:

```yaml
{in(there):Hi there!}      # true, substring anywhere
{contain(there):Hi there!} # false, whole word only ("there!" is the word)
{index(there!):Hi there!}  # 1, word index
{lindex(t):Hi there!}      # 3, character index
```

Pass `+` as the parameter to `urlencode`/`urldecode` to use `+` for spaces instead of `%20`.

### Randomness

| Parser             | Aliases           | Example                | Result                                               |
| ------------------ | ----------------- | ---------------------- | ---------------------------------------------------- |
| `RandomParser`     | `random`, `rand`  | `{random:foo,bar,baz}` | One item, split on `~` or `,` (or `\|`).             |
| `RangeParser`      | `range`, `rangef` | `{range:10-30}`        | An integer; `rangef` gives one decimal place.        |
| `FiftyFiftyParser` | `5050`, `50`, `?` | `{5050:heads}`         | The payload half the time, an empty string the rest. |

## Transformers

Transformers back the `{variable}` tags. They expose a fixed set of keys, so a template can never reach the object underneath.

| Transformer             | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `StringTransformer`     | A string, with word/segment indexing through the parameter.              |
| `IntegerTransformer`    | A counter. `{n(++)}` increments, `{n(--)}` decrements.                   |
| `SafeObjectTransformer` | Dotted access into a plain object. Refuses any key starting with `_`.    |
| `FunctionTransformer`   | Runs your function at render time, so the value can be computed per tag. |

```ts
import { Interpreter, StrictVarsParser, StringTransformer } from 'tagscript';

const ts = new Interpreter(new StrictVarsParser());

(await ts.run('Hi {user}, your surname is {user(2)}', { user: new StringTransformer('Parbez Barbhuiya') })).body;
// -> 'Hi Parbez Barbhuiya, your surname is Barbhuiya'
```

`StringTransformer` indexes from 1, splits on whitespace unless the payload gives another separator, and supports `+` for ranges. `{args(2+)}` is "the second word onwards", `{args(+2)}` is "up to and including the second word".

## Writing your own

A parser is anything matching `IParser`. `BaseParser` gives you name matching and the parameter/payload requirement checks for free.

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

Return `null` from `parse` to decline the tag. The interpreter moves on to the next parser that accepted it, and if none produce a value the tag is left in the output verbatim. `parse` and `willAccept` may both be async.

To record a side effect instead of producing text, write to `ctx.response.actions` and return `''`. Declaration-merge `IActions` so your field is typed:

```ts
declare module 'tagscript' {
	interface IActions {
		notify?: { channel: string };
	}
}
```

Transformers are simpler. Implement `transform(tag)` and return a string, or `null` to leave the tag alone:

```ts
import type { ITransformer, Lexer } from 'tagscript';

class UpperTransformer implements ITransformer {
	public constructor(private readonly value: string) {}

	public transform(tag: Lexer) {
		return tag.parameter === 'upper' ? this.value.toUpperCase() : this.value;
	}
}
```

## Related

- [`@tagscript/plugin-discord`](https://www.npmjs.com/package/@tagscript/plugin-discord) for Discord parsers and transformers.
- Full documentation: **[tagscript.js.org](https://tagscript.js.org/)**

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
