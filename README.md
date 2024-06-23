<div align="center">

<img alt="TagScript Logo" src="https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png" height="200"/>

# TagScript

**A simple and safe template engine.**

[![Continuous Integration](https://github.com/imranbarbhuiya/TagScript/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/imranbarbhuiya/TagScript/actions/workflows/continuous-integration.yml)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2)](https://codecov.io/gh/imranbarbhuiya/tagscript)

## Packages

[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=tagscript)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm-tagscript](https://img.shields.io/npm/dw/tagscript)](https://www.npmjs.com/package/tagscript)
[![npm](https://img.shields.io/npm/v/@tagscript/plugin-discord?color=crimson&logo=npm&style=flat-square&label=@tagscript/plugin-discord)](https://www.npmjs.com/package/@tagscript/plugin-discord)
[![codecov-tagscript](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=plugin-discord)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm-tagscript-plugin-discord](https://img.shields.io/npm/dw/@tagscript/plugin-discord)](https://www.npmjs.com/package/@tagscript/plugin-discord)

</div>

## Description

TagScript is a drop in easy to use string interpreter that lets you provide users with ways of customizing their profiles or chat rooms with interactive text.

Read Full Documentation [here](https://tagscript.js.org/).

## Features

-   Written In Typescript
-   Offers CJS, ESM and UMD builds
-   Full TypeScript & JavaScript support
-   Blazingly Fast ⚡
-   Simple, expressive and safe template engine.
-   Supports many [plugins](https://github.com/imranbarbhuiya/tagscript/packages/).

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

```ts showLineNumbers
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser } from 'tagscript';
const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());

const result = await ts.run(
	`
    {random: Parbez,Rkn,Priyansh} attempts to pick the lock!,
    I pick {if({5050:.}!=):heads|tails}
    `
); // Parbez attempts to pick the lock!, I pick heads
```

For more usage, check out the documentation [here](https://tagscript.js.org/).

## Buy me some doughnuts

If you want to support me by donating, you can do so by using any of the following methods. Thank you very much in advance!

<a href="https://www.buymeacoffee.com/parbez" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
<a href='https://ko-fi.com/Y8Y1CBIJH' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contributors ✨

Thanks goes to these wonderful people:

<a href="https://github.com/imranbarbhuiya/TagScript/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=imranbarbhuiya/TagScript" />
</a>
