<div align="center">

# @tagscript/plugin-discord

**A tagscript plugin to work with discord.js**

</div>

## Description

A Plugin for [TagScript](https://www.npmjs.com/package/tagscript) to work with discord.js related structures.

## Features

- Written In Typescript
- Offers CJS, and ESM builds
- Full TypeScript & JavaScript support

## Installation

`@tagscript/plugin-discord` depends on the following packages. Be sure to install these along with this package!

- [tagscript](https://www.npmjs.com/package/tagscript)
- [discord.js](https://www.npmjs.com/package/discord.js)

You can use the following command to install this package, or replace npm install with your package manager of choice.

```bash
npm install @tagscript/plugin-discord tagscript discord.js

```

## Usage

```ts showLineNumbers
import { Interpreter, StrictVarsParser } from 'tagscript';
import { MemberTransformer } from '@tagscript/plugin-discord';

const ts = new Interpreter(new StrictVarsParser());

await ts.run('Hi {member.username}', { member: new MemberTransformer(GuildMember) });
// Hi P<z,x>
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
