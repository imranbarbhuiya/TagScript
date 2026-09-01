# Template authoring plan

Covers four pieces of work that share one prerequisite: a tag manifest, a markdown output package,
a TipTap editor extension, and a playground on the website.

Research date: 2026-09-01. Every claim about current behaviour below was probed against the real
interpreter in this repo, not read off the source. The probes are quoted inline.

## 1. Why these four, and why together

The library is good at turning a template into a string. It has nothing to say about the two ends of
that: an admin who is not a programmer writing the template, and a host application dropping the
result into a document that has its own syntax.

Both gaps showed up concretely in `TEC/selfhosted-form`, which lets a non-coder admin write a
thank-you page in a TipTap editor and wants to interpolate form answers into it. That app is the
reference consumer throughout this plan, but nothing here is specific to it. Any host with an admin
UI and a rendered output has the same two gaps.

They share a prerequisite. All three of the escaping package, the editor extension and the
playground need the interpreter to say more about what it did than "here is a string".

## 2. What is broken today

### 2.1 Untrusted values inject formatting

```
template: Thanks **{name}**, see you soon.
answer:   "# Ada\n---\n[click](https://evil.tld)"

output:   Thanks **# Ada
          ---
          [click](https://evil.tld)**, see you soon.
```

A heading, a horizontal rule and a working link, all planted by whoever filled in the form, on a
page the form owner controls. Downstream HTML sanitising does not help, because by the time the
string reaches a markdown renderer this is all legitimate markdown.

The reference consumer already identified this threat and hand-rolled a fix for its email path.
From `lib/services/notifications.ts:181`:

> Any value that originates from a user must go through this first, or it can plant working markup
> (most usefully a link) in an email that legitimately comes from our domain.

The web path has no equivalent. Nobody should be hand-rolling this per application.

### 2.2 A mistyped tag renders raw braces, silently

```
template: Thanks {name}! Typo: {naem}. Price: {100}.
output:   Thanks Ada! Typo: {naem}. Price: {100}.    errors = 0
```

Both `StrictVarsParser` and `LooseVarsParser` behave this way. The braces reach the customer, and
`response.errors` is empty, so the host cannot detect that it happened or warn anyone.

For an admin who cannot read a stack trace this is the most likely failure and the least visible.

### 2.3 Code regions are interpreted

````
template: How to use it:
          ```
          {upper:hello}
          ```
          inline `{upper:world}`

output:   How to use it:
          ```
          HELLO
          ```
          inline `WORLD`
````

Lower priority than the other two, because a thank-you page is prose. It matters for anyone
documenting TagScript in TagScript, or letting an admin paste a snippet.

### 2.4 The interpreter discards everything it knows

`solve` knows the exact range it just spliced and which parser produced it. `Lexer` computes the
offsets of the declaration, parameter and payload and then keeps only the sliced strings. All of it
is thrown away before the caller sees anything.

That single fact blocks all four pieces of work below.

## 3. Shared core additions

Everything in this section is additive and lands in a minor. All four are implemented, on both the
classic and the Effect entry points, which produce identical span shapes.

### 3.1 Lexer spans (done)

`Lexer` already has the offsets. `openParameter` holds `decStart`, `closeParameter` holds the
closing index, and `setPayload` splits on the first colon. It slices with them and drops them.

Record them instead:

```ts
lexer.spans; // { declaration: [start, end], parameter: [start, end] | null, payload: [start, end] | null }
```

Offsets are relative to the tag, so the playground and the editor add the node's own start.

Needed by: playground highlighting, TipTap round trip.

### 3.2 Run instrumentation (done)

Two optional recordings on the `solve` loop, at the point where `output` is already computed and
`start` / `end` are already in hand.

```ts
interface RunOptions {
	spans?: boolean;
	trace?: boolean;
}

interface Response {
	spans: OutputSpan[] | null;
	trace: TraceStep[] | null;
}
```

`spans` are shifted by the same loop that already shifts node coordinates in `translateNodes`, so
they stay accurate as earlier tags resize the string. `trace` is the same data plus the intermediate
body after each splice.

**Both are off by default and `null` rather than `[]` when off**, so a consumer can tell "not
recorded" from "no tags". Span bookkeeping is O(n²) in the tag count and measured at 13% on a single
tag rising to 31% on a fifty-tag template, which a render that only wants the body should not pay.
With them off the default path measures within noise of the previous release.

Core records who produced what and stays out of policy. There is no `trusted` flag, because whether
a tag can be trusted depends on the document the body is going into, so it belongs in the consumer.
`OutputSpan.tags` lists every tag that contributed to a range, outermost first, so
`\{upper:\{user\}\}` reports `['upper', 'user']` and cannot be mistaken for author text.

A tag nested in a **parameter** is not carried, only one nested in a **payload**, since a parameter
is read rather than written. Without that, `\{if(\{user\}==yes):**sure**\}` would report the branch
as user-derived and a markdown pass would escape the author's own formatting.

Needed by: markdown escaping (spans), playground step-through (trace).

### 3.3 extractTags (done)

Parse without running. `buildNodeTree` plus `Lexer` already produce all of it.

```ts
extractTags(template); // [{ declaration, parameter, payload, start, end, spans }]
```

Ships with `validateTags(message, tags)`, which is the save-time check itself rather than the
ingredients for one.

Needed by: save-time validation in a host, TipTap load, playground.

### 3.4 A tag manifest (done)

Framework-free description of which tags exist in a given context. This is the piece that stops the
field list being written three times.

```ts
export interface TagDefinition {
	name: string;
	label: string;
	description?: string;
	parameter?: { required: boolean; label?: string };
	payload?: { required: boolean };
	insertable?: boolean;
}
```

`insertable` marks the ones an editor offers in a picker. A form field is insertable. `{if}` is not,
because its payload holds template text the admin still has to edit by hand.

Built-in parsers ship their own definitions, so a host can compose `[...builtinTags, ...myFields]`
and get validation, an editor picker and a generated cheat sheet from one array.

`describeParser` derives names and requirements from any `BaseParser`, and a conformance test
asserts `builtinTags` still matches what the parsers accept, so the two cannot drift.

Needed by: TipTap picker, host-side validation, playground parser list, docs generation.

## 4. Package A: @tagscript/markdown

Named without `plugin-` because it exports no parsers. It is an output policy.

### 4.1 It emits markdown, never HTML

The three known consumers render with three different things: `react-markdown` and `remark` on the
web, `react-email` for mail, and nothing at all for a Discord bot. Binding this package to a
renderer would be picking a fight with two thirds of them.

So `marked` is out, and so is every other renderer. The package escapes markdown and hands the
markdown back. Whatever the host already renders with keeps rendering. That also keeps the
dependency count at zero, which matters given `tagscript` has none today.

### 4.2 API

```ts
const response = await ts.run(template, { seedVariables });
const message = markdownSafe(response, Flavour.GFM);
```

`markdownSafe` reads `response.spans` and escapes only the untrusted ranges. Flavours: `CommonMark`,
`GFM`, `Discord`, `Text`. The escape table is a few characters per flavour.

### 4.3 Why escaping at input does not work

The obvious shortcut is `new StringTransformer(escapeMarkdown(answer))`, which needs no core change
at all. It is a fine stopgap for a bare `{name}` and a host could ship it this week.

It breaks as soon as a template does anything. `{if(rating==yes):...}` compares against
backslash-escaped text and stops matching. `{slice}` counts the backslashes as characters. Escaping
has to happen after interpretation, which is what `spans` are for.

### 4.4 Nesting

Nodes come out of `buildNodeTree` innermost first, so a naive per-output escape would run twice on
`{upper:{user}}` and escape its own backslashes. Escaping recorded ranges once at the end avoids it,
because the outer range subsumes the inner one.

### 4.5 Code regions

`skipRanges` on `RunOptions`, telling `buildNodeTree` not to open a node inside those ranges.

Backslash escaping cannot be the mechanism here. The docs already record that "the backslash stays
in the rendered output", so escaping and unescaping would leave debris.

Two producers of ranges, one dependency-free scanner for fenced blocks and inline spans, and an
optional `@tagscript/markdown/remark` subpath for full CommonMark accuracy using the remark lexer
the web consumer already has. Not `marked`, since no known consumer uses it.

## 5. Package B: @tagscript/tiptap

### 5.1 What it buys

An atom node instead of text, which gives three things text cannot.

**Atomic deletion.** One backspace removes the whole `{fullName}`. Today an admin backspacing over
the end of a tag leaves `{fullNam`, which by §2.2 renders literal braces to a customer and reports
no error. An atom eliminates the entire class.

**Label shown, id stored.** The chip reads `Full name` while the markdown holds `{fullName}`. A
field rename then updates every template automatically. With raw text a rename breaks all of them
silently.

**Unknown fields render broken in the editor.** A template referencing a deleted field shows as a
red chip when the admin opens it, rather than as stray braces on a live page.

Together these fix §2.2 at authoring time, which is strictly better than validating at save.

### 5.2 API

```tsx
TagScriptNode.configure({
	tags: fields.map((f) => ({ name: f.id, label: f.label, insertable: true })),
	trigger: '{',
});
```

Typing `{` opens the picker from the manifest, selecting inserts an atom, `@tiptap/markdown`
serializes back to `{fullName}`.

### 5.3 Scope

Only `{field}` and `{field(sub)}` become chips. `{if(rating==5):Thanks!|Sorry.}` stays plain text,
because its payload is template content the admin needs to edit.

So the extension reduces the need for save-time `extractTags` validation but does not remove it. A
host wants both.

### 5.4 Why it belongs in this repo

Loading a stored template means scanning markdown for `{...}` and deciding which are tags. That
needs the same `Lexer` and the same manifest the interpreter uses. Put the extension in the host
application and the editor and the runtime will drift on what counts as a tag, which is the worst
possible bug here because it stays invisible until a customer sees the output.

### 5.5 Costs

**A DOM in CI.** This repo has no browser anything today, just bun tests. A ProseMirror node needs
jsdom or a browser runner. This is the real decision, more than the code is.

**TipTap peers, and TipTap moves fast.** Mitigated by using `renderHTML` returning a span with a
class rather than a React node view. A pill needs no framework, and that drops `@tiptap/react` from
peers entirely and works for the Vue and Svelte bindings too. Peers reduce to `@tiptap/core`,
`@tiptap/pm` and `@tiptap/suggestion`.

## 6. Package C: tagscript/language

A subpath rather than a package, for the same reason `tagscript/effect` is one: it depends on
`Lexer` directly and has to version-lock with it. It stays dependency free.

### 6.1 The current highlighting is wrong, not just imprecise

Docs tag TagScript examples as `yaml`, because YAML happens to support `#` comments and the examples
use `# output` lines. Real shiki tokens for that choice:

```
{lower:Hello Parbez!}
  "{"  "lower:Hello Parbez!"  "}"

{upper:{lower:ABC}}
  "{"  "upper"  ":{"  "lower:ABC"  "}}"

{if({args}==):No input given.}
  "{"  "if("  "{"  "args"  "}"  "==):No input given."  "}"
```

Two colours across every example. Declaration, parameter and payload never differ from each other.
Worse, `:{` is one token, gluing a colon to the opening brace of a nested tag, and `}}` merges the
closing braces of two different tags. On the `if` example the parameter and the payload are welded
into one string that also swallows the closing paren.

91 fences across 36 files are affected.

### 6.2 Two artifacts, one place, tested against each other

**A TextMate grammar**, `tagscript.tmLanguage.json`. This is the portable artifact, and it is
exactly what a VS Code extension consumes through `contributes.grammars`. Same file drives shiki for
the docs, Monaco, and eventually linguist.

I argued against a grammar in an earlier draft on the grounds that TextMate handles nesting and
escaping badly. That was wrong. Nesting is the standard recursive `begin`/`end` with
`patterns: [{ include: "$self" }]`, and an escape is a `match` rule ordered ahead of the brace
rules. Both are ordinary.

**A tokenizer**, built on `Lexer`, `extractTags` and the manifest. Returns typed tokens with
absolute offsets plus the things a grammar cannot know.

The real division is syntactic against semantic:

| question                        | grammar | tokenizer |
| ------------------------------- | ------- | --------- |
| is this the declaration         | yes     | yes       |
| where does the payload start    | yes     | yes       |
| is `\{` an escape               | yes     | yes       |
| is `naem` a tag that exists     | no      | yes       |
| which parser would accept this  | no      | yes       |
| is a required parameter missing | no      | yes       |

**A conformance test** over a corpus, asserting the grammar's token boundaries agree with the
tokenizer's. The objection to shipping two implementations is that they drift. The answer is not to
avoid the second one, it is to fail the build when they disagree.

### 6.3 Who consumes which

| consumer                                 | uses      |
| ---------------------------------------- | --------- |
| docs code fences, through shiki          | grammar   |
| playground                               | tokenizer |
| VS Code, syntax highlighting             | grammar   |
| VS Code, diagnostics and semantic tokens | tokenizer |
| Monaco, linguist                         | grammar   |

The grammar is exported as a plain JSON file path as well as an import, so a VS Code extension can
point `contributes.grammars` straight at it without a build step.

### 6.4 Wiring it into the docs

`rehypeCodeOptions` in `apps/website/source.config.ts` takes shiki options, so the grammar goes in
as a custom lang there and the fences change from `yaml` to `tagscript`. Mechanical, 91 fences.

One thing to settle first. TagScript has no comment syntax, so `#` is literal template text. A
grammar rule treating it as a comment would be a lie, though a contained one, and it is the same lie
`yaml` tells today. The alternatives are shiki's own notation or a small fumadocs component for
expected output. Listed in §9.

## 7. Playground on the website

Route `/playground` in `apps/website`. Static routes win over the existing `[[...slugs]]` catch-all,
so no routing change is needed.

The website already has `tagscript` and `@tagscript/plugin-discord` as devDependencies, and the
library has no dependencies and no Node built-ins, so the whole thing runs client side with no API
route. Worth saying on the page itself, since "this never leaves your browser" is the honest answer
to anyone pasting a real template.

### 7.1 Panels

**Input.** Textarea with the §6 tokenizer's output overlaid. Not a bespoke highlighter: the same
tokenizer a VS Code extension would use, which is the point of putting it in `tagscript/language`.

**Structure.** Tree of the parsed nodes. Each shows its declaration, parameter and payload as
separate labelled parts using the §3.1 spans, which parser accepted it, and what it returned.
Clicking a node highlights its range in the input, hovering a range selects the node. A tag no
parser accepts is greyed, which makes §2.2 visible as you type.

**Evaluation.** Step-through of `response.trace` from §3.2. The most educational panel, because
`buildNodeTree` emits nodes in closing-brace order, so evaluation runs innermost first and that
surprises nearly everyone. Watching the string mutate one splice at a time explains it better than a
paragraph can.

**Output.** Final body, plus `response.errors`, `response.actions` and `response.variables`. Errors
distinguish `TemplateError` from `ParserError`, so "the template author made a mistake" and "a
parser has a bug" are visibly different things.

**Configuration.** Checkboxes for the built-in parsers and the Discord plugin's, a seed variable
editor covering `StringTransformer`, `IntegerTransformer`, `SafeObjectTransformer` and
`FunctionTransformer`, and inputs for `charLimit`, `tagLimit` and `parenType`.

Turning a parser off and watching its tag go grey is the fastest way to understand that parsers are
composed rather than built in, which the docs currently have to assert in prose.

### 7.2 Sharing

Template, selected parsers and seed variables compressed into the URL hash. No storage, no backend.
Lets the docs link a live example per page, and lets someone paste a repro into an issue.

### 7.3 Effect entry point

The playground runs the classic interpreter. The Effect one would need `effect` as a website
dependency for no visible difference on templates that use no services, so it is out of scope unless
the cooldown example proves worth demonstrating live.

## 8. Order

1. **Core additions.** §3.1 spans, §3.2 instrumentation, §3.3 `extractTags`, §3.4 manifest. One
   minor, additive, unblocks everything else.
2. **`@tagscript/markdown`.** Fixes §2.1, the only security issue here.
3. **`tagscript/language`** plus the fence migration. Self-contained, fixes a visible bug, and is the
   prerequisite for both the playground and any future editor tooling.
4. **Playground.** Needs nothing beyond §3 and §6, and is the best documentation of both.
5. **`@tagscript/tiptap`.** Biggest admin-facing win, and the only piece needing a new test setup, so
   it goes last where the DOM decision can be made on its own.

Steps 2 and 3 can swap. Take the markdown package first if anyone is actually shipping the
injection path, and the language module first if they are not.

A VS Code extension is deliberately not in this list. §6 is what makes it cheap later; it is not
work to schedule now.

## 9. Open decisions

| question                                                              | leaning                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Does the manifest live in core or its own package?                    | Core. Types plus a const array, no dependency.             |
| Does this repo take on jsdom or a browser runner for §5?              | Unresolved. It is the gate on the TipTap package.          |
| `skipRanges` in core, or preprocessing in `@tagscript/markdown`?      | Core. Every flavour needs it and only the lexer can do it. |
| Ship §3 before or after the pending `tagscript@3.0.0` release?        | After. Additive, so it does not need the major.            |
| Does the playground get its own nav entry or live under docs?         | Own top-level entry. It is a tool, not a page.             |
| How do docs show expected output, now that `#` is not a real comment? | Unresolved. Grammar rule, shiki notation, or a component.  |
