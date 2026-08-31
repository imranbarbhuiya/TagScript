<div align="center">

# @tagscript/plugin-discord

**Discord parsers and transformers for [TagScript](https://www.npmjs.com/package/tagscript).**

[![npm](https://img.shields.io/npm/v/@tagscript/plugin-discord?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@tagscript/plugin-discord)
[![npm downloads](https://img.shields.io/npm/dw/@tagscript/plugin-discord?style=flat-square)](https://www.npmjs.com/package/@tagscript/plugin-discord)
[![codecov](https://codecov.io/gh/imranbarbhuiya/tagscript/branch/main/graph/badge.svg?precision=2&flag=plugin-discord)](https://codecov.io/gh/imranbarbhuiya/tagscript)

</div>

## What this is for

[TagScript](https://www.npmjs.com/package/tagscript) lets your users write templates without letting them touch your runtime. This plugin is the piece that makes that useful for a Discord bot: it adds tags for embeds, cooldowns, permissions and mentions, and transformers that expose Discord objects to a template safely.

Three rules make it work:

- **Templates ask, your bot decides.** No parser here sends a message, deletes a message or applies a cooldown. Each one records a request on `response.actions` and returns an empty string. Your code reads that object and chooses what to honour.
- **Structures are never handed over.** A member reaches a template through `MemberTransformer`, which exposes a fixed list of keys. `{member.username}` works; there is no path to the client, the token or any method.
- **Payloads in, payloads out.** The only Discord dependency is [`discord-api-types`](https://discord-api-types.dev). Transformers read the raw objects Discord sends, and `EmbedParser` writes an `APIEmbed`. Any library that hands you those objects works, discord.js included.

## Installation

`@tagscript/plugin-discord` needs `tagscript` alongside it:

```sh
npm install @tagscript/plugin-discord tagscript
```

Requires Node 18+. Ships ESM and CJS.

## Working with discord.js

Nothing in this package imports discord.js, so the two meet at the API payload.

On the way in, transformers want the raw object, not the wrapper class. discord.js `toJSON()` will not do it: it returns a flattened camelCase blob and turns collections into ID arrays. Reach for the payload you already have instead. A raw gateway or REST response, `@discordjs/core`, or a `client.rest.get(Routes.user(id))` call all give you one:

```ts
import { Routes, type APIUser } from 'discord-api-types/v10';
import { UserTransformer } from '@tagscript/plugin-discord';

const payload = (await client.rest.get(Routes.user(id))) as APIUser;

await ts.run('Hi {user}!', { user: new UserTransformer(payload) });
```

On the way out, `response.actions.embed` is an `APIEmbed`, the same object [`EmbedBuilder.toJSON()`](https://discord.js.org/docs/packages/discord.js/main/EmbedBuilder:Class#toJSON) produces, so hand it straight to [`EmbedBuilder.from()`](https://discord.js.org/docs/packages/discord.js/main/EmbedBuilder:Class#from):

```ts
const embed = EmbedBuilder.from(response.actions.embed);
```

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
	embeds: response.actions.embed ? [EmbedBuilder.from(response.actions.embed)] : [],
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
- `EmbedParser` accepts either a full JSON payload or one property per tag, and merges repeated tags. `image` and `thumbnail` become `{ "url": ... }`, `author` and `footer` take pipe separated parts, and colours go through `resolveColor`, which accepts `0x37b2cb`, `#ed4245`, `Red` or a raw number and returns the input unchanged rather than throwing if it cannot resolve.
- The output of `EmbedParser` is user-controlled, so validate it before sending it.
- `{date}` takes one of Discord's timestamp styles as the parameter, one of `f`, `F`, `t`, `T` or `R`, and renders a real Discord timestamp. `{unix}` and `{currenttime}` render the current time in milliseconds.

## Transformers

Every transformer here exposes `id`, `mention` and `name`, plus its own keys. Use the bare name for the mention (`{user}` → `<@758880890159235083>`) or a parameter for a specific value (`{user(username)}`, or `{user.username}`).

```ts
import { MemberTransformer, UserTransformer } from '@tagscript/plugin-discord';
import { Interpreter, StrictVarsParser } from 'tagscript';

const ts = new Interpreter(new StrictVarsParser());

const response = await ts.run('Hi {member.displayName}, welcome to {guild}!', {
	member: new MemberTransformer(interaction.member),
	guild: new GuildTransformer(guildPayload),
});
```

`StrictVarsParser` (or `LooseVarsParser`) must be registered for these to resolve.

| Transformer              | Reads                              | Notable keys                                                           |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------------------- |
| `UserTransformer`        | `APIUser`                          | `username`, `globalName`, `tag`, `displayAvatar`, `createdAt`, `bot`   |
| `MemberTransformer`      | `APIGuildMember`                   | `displayName`, `nickname`, `joinedAt`, `roleIds`, `timeoutUntil`       |
| `RoleTransformer`        | `APIRole`                          | `color`, `hoist`, `mentionable`, `position`, `permissions`             |
| `ChannelTransformer`     | `APIGuildChannel`                  | `topic`, `type`, `nsfw`, `parentId`, `slowmode`, `position`            |
| `GuildTransformer`       | `APIGuild`                         | `ownerId`, `roleNames`, `roleCount`, `emojiCount`, `verificationLevel` |
| `InteractionTransformer` | `APIApplicationCommandInteraction` | `commandName`, `commandId`, `channelId`, `guildId`, `locale`           |

A payload only carries what Discord put in it. A member has role IDs but no role objects, a role does not know who holds it, and a guild payload has no channel list. Anything that needs a second object is yours to pass, through the same second argument you use for your own keys. A function is called with the payload at render time:

```ts
new MemberTransformer(member, {
	warnings: () => warningCountFor(member.user.id),
	topRole: roles.reduce((highest, role) => (role.position > highest.position ? role : highest)).name,
	isStaff: (base) => base.roles.includes(STAFF_ROLE_ID),
});
```

Subclass `BaseTransformer` and implement `resolveId()`, `resolveMention()` and `updateSafeValues()` if you need a reusable one.

## Slash command options

`resolveCommandOptions` turns an interaction's command data into ready-to-seed transformers, so a template can reference whatever the user passed to the command:

```ts
import { resolveCommandOptions } from '@tagscript/plugin-discord';

const response = await ts.run(template, resolveCommandOptions(interaction.data));
// {subCommand}, {member}, {some-option} ... are now available
```

Options are matched against `data.resolved`, which is where Discord puts the full user, member, role, channel and attachment objects. An option Discord did not resolve is skipped rather than guessed at.

Subcommand and subcommand-group options are flattened with a `-` separated prefix, so an option `channel` inside `sub-command` is reachable as `{sub-command-channel}`.

## Effect

`@tagscript/plugin-discord/effect` is the same plugin on the [Effect entry point](https://tagscript.js.org/tagscript/effect),
where `cooldownParser` enforces the cooldown itself instead of writing to `response.actions` and
leaving it to you.

```ts
import { CooldownStore, cooldownParser } from '@tagscript/plugin-discord/effect';

const body = await Effect.runPromise(
	ts.run(template, { keyValues: { tagName: 'rules' } }).pipe(
		Effect.map((response) => response.body),
		Effect.catchTag('OnCooldown', (error) => Effect.succeed(error.message ?? 'Slow down.')),
		Effect.provide(CooldownStore.memory),
	),
);
```

`dateFormatParser` reads the clock through `DateTime`, so a test can pin it, and `embedParser`
checks Discord's length limits and reports a malformed embed as a `TemplateError` rather than
letting the API reject it later.

`effect` is an optional peer dependency, so nothing changes if you do not use it. Full details:
**[tagscript.js.org/plugins/plugin-discord/effect](https://tagscript.js.org/plugins/plugin-discord/effect)**

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
