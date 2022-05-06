<div align="center">

# tagscript-plugin-discord

**A tagscript plugin to work with discord.js**

[![npm](https://img.shields.io/npm/dw/tagscript)](https://www.npmjs.com/package/tagscript)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg)](https://codecov.io/gh/imranbarbhuiya/tagscript)
[![npm](https://img.shields.io/npm/v/tagscript?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/tagscript)

</div>

## Description

A Plugin for [TagScript](https://www.npmjs.com/package/tagscript) to work with discord.js related structures.

## Features

-   Written In Typescript
-   Offers CJS, ESM and UMD builds
-   Full TypeScript & JavaScript support

## Installation

`tagscript-plugin-discord` depends on the following packages. Be sure to install these along with this package!

-   [tagscript](https://www.npmjs.com/package/tagscript)
-   [discord.js](https://www.npmjs.com/package/discord.js)

You can use the following command to install this package, or replace npm install with your package manager of choice.

```bash
npm install tagscript-plugin-discord tagscript discord.js

```

## Usage

```ts
import { Interpreter } from 'tagscript';
import { MemberTransformer } from 'tagscript-plugin-discord';

const ts = new Interpreter();

await ts.run(str, { member: new MemberTransformer(GuildMember) });
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
  <tr>
    <td align="center"><a href="https://github.com/imranbarbhuiya"><img src="https://avatars.githubusercontent.com/u/74945038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Parbez</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/TagScript/commits?author=imranbarbhuiya" title="Code">💻</a> <a href="#maintenance-imranbarbhuiya" title="Maintenance">🚧</a> <a href="#ideas-imranbarbhuiya" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://renovate.whitesourcesoftware.com"><img src="https://avatars.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="#maintenance-renovate-bot" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
