<div align="center">

# tagscript

**A simple and safe template engine.**

[![GitHub](https://img.shields.io/github/license/imranbarbhuiya/tagscript)](https://github.com/imranbarbhuiya/tagscript/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?token=token)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)

</div>

## Description

A description of the package.

<!-- Read Full Documentation [here](https://tagscript.js.org/). -->

## Features

- Written In Typescript
- Offers CJS, ESM and UMD builds
- Full TypeScript & JavaScript support

## Install

```bash
# npm
npm i tagscript

# yarn
yarn add tagscript

```

## Usage

**Note:** While examples uses `import`, it maps 1:1 with CommonJS' require syntax. For example, `import { Interpreter } from 'tagscript'` is the same as `const { Interpreter } = require('tagscript')`.

```ts
import { Interpreter } from 'tagscript';
```

```ts
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser } from 'tagscript';
const interpreter = new Interpreter(
	new SliceParser(),
	new FiftyFiftyParser(),
	new RandomParser(),
	new IfStatementParser(),
);

const result = await interpreter.parse(
	'{random: Parbez,Rkn,Priyansh} attempts to pick the lock!, \nI pick {if({5050:.}!=):heads|tails} \n{slice(1):ok} \n{slice(1-5):Hi RKN}',
);
console.log(result);
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/imranbarbhuiya"><img src="https://avatars.githubusercontent.com/u/74945038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Parbez</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=imranbarbhuiya" title="Code">💻</a> <a href="#maintenance-imranbarbhuiya" title="Maintenance">🚧</a> <a href="#ideas-imranbarbhuiya" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://renovate.whitesourcesoftware.com"><img src="https://avatars.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="#maintenance-renovate-bot" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
