<div align="center">

# @tagscript/plugin-discord

**discord.js parsers and transformers for [TagScript](https://www.npmjs.com/package/tagscript).**

[![npm](https://img.shields.io/npm/v/@tagscript/plugin-discord?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@tagscript/plugin-discord)
[![npm downloads](https://img.shields.io/npm/dw/@tagscript/plugin-discord?style=flat-square)](https://www.npmjs.com/package/@tagscript/plugin-discord)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=plugin-discord)](https://codecov.io/gh/imranbarbhuiya/tagscript)

</div>

## What this is for

[TagScript](https://www.npmjs.com/package/tagscript) lets your users write templates without letting them touch your runtime. This plugin is the piece that makes that useful for a Discord bot: it adds tags for embeds, cooldowns, permissions and mentions, and transformers that expose discord.js structures to a template safely.

Two rules make it work:

- **Templates ask, your bot decides.** No parser here sends a message, deletes a message or applies a cooldown. Each one records a request on `response.actions` and returns an empty string. Your code reads that object and chooses what to honour.
- **Structures are never handed over.** A `GuildMember` reaches a template through `MemberTransformer`, which exposes a fixed list of keys. `{member.username}` works; there is no path to the client, the token or any method.

## Installation

`@tagscript/plugin-discord` needs `tagscript` and `discord.js` alongside it:

```sh
npm install @tagscript/plugin-discord tagscript discord.js
```

Requires discord.js v14 and Node 16.9+. Ships ESM and CJS.

## Actions

Register the parsers you want, run the user's template, then act on what came back.

```ts
import { CooldownParser, DeleteParser, EmbedParser, RequiredParser } from '@tagscript/plugin-discord';
import { Interpreter } from 'tagscript';

const ts = new Interpreter(new EmbedParser(), new CooldownParser(), new RequiredParser(), new DeleteParser());

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

`response.actions` is now:

```jsonc
{
	"embed": {
		"title": "Server Rules",
		"color": 3650251,
		"fields": [{ "name": "Rule 1", "value": "Be nice.", "inline": false }],
	},
	"cooldown": { "cooldown": 30, "message": "Slow down, try again in {retryAfter}." },
	"require": { "ids": ["Moderator"], "message": null },
	"deleteMessage": true,
}
```

Nothing has happened yet. Your handler decides:

```ts
if (response.actions.require && !hasAnyOf(member, response.actions.require.ids)) {
	return interaction.reply(response.actions.require.message ?? 'You cannot use this tag.');
}

// Clamp what the template asked for to what this user is actually allowed
const cooldown = Math.max(response.actions.cooldown?.cooldown ?? 0, minimumCooldownFor(member));

await interaction.reply({
	content: response.actions.silentResponse ? undefined : response.body!,
	embeds: response.actions.embed ? [new EmbedBuilder(response.actions.embed)] : [],
	files: response.actions.files,
});

if (response.actions.deleteMessage) await message.delete();
```

### Parsers

| Parser             | Aliases                             | Example                                       | Sets on `actions`                          |
| ------------------ | ----------------------------------- | --------------------------------------------- | ------------------------------------------ |
| `EmbedParser`      | `embed`                             | `{embed(title):Rules}` or `{embed:{...json}}` | `embed`                                    |
| `CooldownParser`   | `cooldown`, `cd`                    | `{cooldown(30):Try again in {retryAfter}.}`   | `cooldown`                                 |
| `RequiredParser`   | `require`, `allowlist`, `whitelist` | `{require(Moderator):Mods only.}`             | `require`, first tag wins                  |
| `DenyParser`       | `deny`, `denylist`, `blacklist`     | `{deny(#general):Not here.}`                  | `deny`, first tag wins                     |
| `DeleteParser`     | `delete`, `del`                     | `{delete}`                                    | `deleteMessage: true`                      |
| `SilentParser`     | `silent`                            | `{silent}`                                    | `silentResponse: true`                     |
| `FilesParser`      | `files`                             | `{files:https://a.png,https://b.png}`         | `files`, a list of URLs                    |
| `DateFormatParser` | `date`, `unix`, `currenttime`       | `{date:2020-01-01}`                           | Nothing; renders `<t:1577836800:f>` inline |

Notes:

- `require` and `deny` collect whatever strings the user wrote: role names, channel names or IDs. Resolving them and enforcing the check is your job; the plugin deliberately does not guess.
- `EmbedParser` accepts either a full JSON payload or one property per tag, and merges repeated tags. Colours go through `resolveColor`, which accepts `0x37b2cb`, `#ed4245`, `Red` or a raw number, and returns the input unchanged rather than throwing if it cannot resolve.
- The output of `EmbedParser` is user-controlled, so validate it before handing it to `EmbedBuilder`.
- `{date}` takes one of Discord's timestamp styles as the parameter, one of `f`, `F`, `t`, `T` or `R`, and renders a real Discord timestamp. `{unix}` and `{currenttime}` render the current time in milliseconds.

## Transformers

Every transformer here exposes `id`, `mention` and `name`, plus its own keys. Use the bare name for the mention (`{user}` → `<@758880890159235083>`) or a parameter for a specific value (`{user(username)}`, or `{user.username}`).

```ts
import { MemberTransformer, UserTransformer } from '@tagscript/plugin-discord';
import { Interpreter, StrictVarsParser } from 'tagscript';

const ts = new Interpreter(new StrictVarsParser());

const response = await ts.run('Hi {member.displayName}, welcome to {guild}!', {
	member: new MemberTransformer(interaction.member),
	guild: new GuildTransformer(interaction.guild),
});
```

`StrictVarsParser` (or `LooseVarsParser`) must be registered for these to resolve.

| Transformer              | Wraps                | Notable keys                                                                           |
| ------------------------ | -------------------- | -------------------------------------------------------------------------------------- |
| `UserTransformer`        | `User`               | `username`, `globalName`, `tag`, `displayAvatar`, `createdAt`, `bot`                   |
| `MemberTransformer`      | `GuildMember`        | `displayName`, `nickname`, `joinedAt`, `topRole`, `roleNames`, `color`, `timeoutUntil` |
| `RoleTransformer`        | `Role`               | `color`, `hoist`, `mentionable`, `position`, `permissions`, `memberCount`              |
| `ChannelTransformer`     | Guild channels       | `topic`, `type`, `nsfw`, `parentName`, `slowmode`, `position`                          |
| `GuildTransformer`       | `Guild`              | `memberCount`, `ownerId`, `roleNames`, `channelCount`, `verificationLevel`, `random`   |
| `InteractionTransformer` | `CommandInteraction` | `commandName`, `commandId`, `channelId`, `guildId`, `locale`                           |

To expose extra values, pass a second argument. A function is called with the underlying structure at render time:

```ts
new MemberTransformer(member, {
	warnings: () => warningCountFor(member.id),
	isStaff: (base) => base.roles.cache.has(STAFF_ROLE_ID),
});
```

Subclass `BaseTransformer` and override `updateSafeValues()` if you need a reusable one.

## Slash command options

`resolveCommandOptions` turns an interaction's options into ready-to-seed transformers, so a template can reference whatever the user passed to the command:

```ts
import { resolveCommandOptions } from '@tagscript/plugin-discord';

const response = await ts.run(template, resolveCommandOptions(interaction.options));
// {subCommand}, {member}, {some-option} ... are now available
```

Subcommand and subcommand-group options are flattened with a `-` separated prefix, so an option `channel` inside `sub-command` is reachable as `{sub-command-channel}`.

## Related

- [`tagscript`](https://www.npmjs.com/package/tagscript) for the interpreter and its built-in tags.
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
