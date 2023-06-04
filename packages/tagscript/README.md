<div align="center">

# TagScript

**A simple and safe template engine.**

[![npm](https://img.shields.io/npm/dw/tagscript)](https://www.npmjs.com/package/tagscript)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=tagscript)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)

</div>

## Description

TagScript is a drop in easy to use string interpreter that lets you provide users with ways of customizing their profiles or chat rooms with interactive text.

Read Full Documentation [here](https://tagscript.js.org/).

---

## Features

-   Written In Typescript
-   Offers CJS, ESM and UMD builds
-   Full TypeScript & JavaScript support
-   Faster than ⚡
-   Simple, expressive and safe template engine.
-   Supports your own parsers and transformers

## Installation

```bash
# npm
npm i tagscript

# yarn
yarn add tagscript

```

## Usage

---

**Note:** While examples uses `import`, it maps 1:1 with CommonJS' require syntax. For example,

```ts
import { Interpreter } from 'tagscript';
```

is the same as

```js
const { Interpreter } = require('tagscript');
```

---

```ts copy showLineNumbers
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser } from 'tagscript';
const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());

const result = await ts.run(
	`
    {random: Parbez,Rkn,Priyansh} attempts to pick the lock!,
    I pick {if({5050:.}!=):heads|tails}
    `
);
```

## Parsers

Parsers are used to parse a tag and return a value based on the tag. You can use our [builtin parsers](https://tagscript.js.org/typedoc-api/tagscript/interfaces/IParser#implemented-by) or write your own parsers.
Your own parser should implement [IParser](https://tagscript.js.org/typedoc-api/tagscript/interfaces/IParser) interface.

```ts copy showLineNumbers
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser } from 'tagscript';
const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());
```

## Transformers

Transformers are used to transform a value based on the tag at runtime. You can use our [builtin transformers](https://tagscript.js.org/typedoc-api/tagscript/interfaces/ITransformer#implimented-by) or write your own transformers.
Your own transformer should implement [ITransformer](https://tagscript.js.org/typedoc-api/tagscript/interfaces/ITransformer) interface.

```ts copy showLineNumbers
import { Interpreter, StringTransformer, StrictVarsParser } from 'tagscript';
const ts = new Interpreter(new StrictVarsParser());

await ts.run('Hi {user}', { user: new StringTransformer(args) });
// Hi Parbez
```

## Buy me some doughnuts

If you want to support me by donating, you can do so by using any of the following methods. Thank you very much in advance!

<a href="https://www.buymeacoffee.com/parbez" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
<a href='https://ko-fi.com/Y8Y1CBIJH' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contributors ✨

Thanks goes to these wonderful people:

<a href="https://github.com/imranbarbhuiya/TagScript/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=imranbarbhuiya/TagScript" />
</a>

## Special Thanks

-   [JonSnowbd](https://github.com/JonSnowbd/) for creating TagScript in python.
