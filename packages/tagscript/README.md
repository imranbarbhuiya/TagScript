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

```ts
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

Parsers are used to parse a tag and return a value based on the tag. You can use our [builtin parsers](https://github.com/imranbarbhuiya/TagScript/tree/main/src/lib/Parsers) or write your own parsers.
Your own parser should implement [IParser](https://tagscript.js.org/interfaces/IParser.html) interface.

```ts
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser } from 'tagscript';
const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());
```

## Transformers

Transformers are used to transform a value based on the tag at runtime. You can use our [builtin transformers](https://github.com/imranbarbhuiya/TagScript/tree/main/src/lib/Transformer) or write your own transformers.
Your own transformer should implement [ITransformer](https://tagscript.js.org/interfaces/ITransformer.html) interface.

```ts
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

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/imranbarbhuiya"><img src="https://avatars.githubusercontent.com/u/74945038?v=4?s=100" width="100px;" alt="Parbez"/><br /><sub><b>Parbez</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=imranbarbhuiya" title="Code">💻</a> <a href="#maintenance-imranbarbhuiya" title="Maintenance">🚧</a> <a href="#ideas-imranbarbhuiya" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://renovate.whitesourcesoftware.com"><img src="https://avatars.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt="WhiteSource Renovate"/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="#maintenance-renovate-bot" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://favware.tech"><img src="https://avatars.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt="Jeroen Claassens"/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="#maintenance-favna" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://github.com/UndiedGamer"><img src="https://avatars.githubusercontent.com/u/84702365?v=4?s=100" width="100px;" alt="UndiedGamer"/><br /><sub><b>UndiedGamer</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=UndiedGamer" title="Code">💻</a></td>
      <td align="center"><a href="http://discord.gg/sofi"><img src="https://avatars.githubusercontent.com/u/20400149?v=4?s=100" width="100px;" alt="Sourav"/><br /><sub><b>Sourav</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=ShoXcy" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt="allcontributors[bot]"/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
    </tr>
  </tbody>
  <tfoot>
    
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Special Thanks

-   [JonSnowbd](https://github.com/JonSnowbd/) for creating TagScript in python.
