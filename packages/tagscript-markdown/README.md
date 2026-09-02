# @tagscript/markdown

Escape TagScript output for markdown, so a value someone else supplied cannot plant formatting in a
template you wrote.

## The problem

An admin writes a thank-you message. Your application fills in a name.

```ts showLineNumbers
await ts.run('Thanks **{name}**, see you soon.', { seedVariables });
```

Someone submits `# Ada\n---\n[click](https://evil.tld)` as their name, and the rendered page gets a
heading, a horizontal rule and a working link that the admin never wrote.

Sanitising the HTML afterwards does not help. By the time the body reaches a markdown renderer this
is all legitimate markdown, and no renderer can tell which characters the author typed and which
came from a form field. Only the render knows that.

## Usage

```sh
npm install @tagscript/markdown
```

Render with `spans: true`, then escape:

```ts showLineNumbers
import { Flavour, markdownSafe } from '@tagscript/markdown';

const response = await ts.run('Thanks **{name}**, see you soon.', { seedVariables, spans: true });
const body = markdownSafe(response, Flavour.GFM);
// 'Thanks **\\# Ada\n\\---\n\\[click\\](https://evil.tld)**, see you soon.'
```

The author's `**` still works. Everything the tag produced is now literal text.

Leave `spans: true` off and this throws. A response without ranges looks exactly like a response
where nothing was generated, and returning the body unescaped would be the wrong way to be wrong.

## It gives you markdown, not HTML

Whatever you already render with keeps rendering, whether that is `react-markdown`, `react-email`,
or a Discord message. Pick the flavour your reader uses:

| Flavour              | Adds                                        |
| -------------------- | ------------------------------------------- |
| `Flavour.CommonMark` | the base                                    |
| `Flavour.GFM`        | tables and strikethrough, so `\|` and `~`   |
| `Flavour.Discord`    | spoilers and strikethrough, and no raw HTML |

This is not a substitute for sanitising HTML. If your renderer passes raw HTML through, keep doing
whatever you already do about that.

## What counts as the author's text

Every built-in parser passes its own payload through, and the author typed that payload, so
`{if(x):**yes**}` keeps its emphasis. A variable is not a built-in, so whatever your application
seeded is escaped.

```ts showLineNumbers
markdownSafe(response, Flavour.GFM, { trust: [...builtinTags, ...myTemplateTags] });
```

Add your own tags to `trust` when they return template text. A tag that returns anything fetched,
submitted or configured elsewhere belongs nowhere near that list.

`untrust` goes the other way, for a variable an author defined with `{=(name):value}` that you
nevertheless do not want to be able to format.

A tag nested in a **payload** is carried, and one nested in a **parameter** is not, because a
parameter is read rather than written. So `{upper:{user}}` is escaped, and
`{if({user}==yes):**sure**}` keeps its emphasis, since the branch is the author's text and the user
value never reached the output.

## Escaping a value on its own

When you have a value rather than a render, and you want the same rules:

```ts showLineNumbers
import { escapeMarkdown } from '@tagscript/markdown';

escapeMarkdown(displayName, Flavour.CommonMark);
```

Characters that only mean something at the start of a line are escaped only there, so a phone
number keeps its hyphens and a sentence keeps its full stops.

## Discord mentions

Escaping stops formatting, not mentions. `<@123>` still renders as a mention because that is not
markdown. Use `allowed_mentions` on the message payload, which is what decides whether it pings.
