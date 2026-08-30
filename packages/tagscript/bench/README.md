# Benchmarks

Bun has no built-in benchmark runner. Its
[own docs](https://bun.com/docs/project/benchmarking) recommend
[mitata](https://github.com/evanwashere/mitata) for microbenchmarks, which is what this uses.

```sh
bun run bench                      # both packages, writes bench-results.json
bun run bench -- --out foo.json    # both packages, custom output path
bun run --cwd packages/tagscript bench   # one package
```

Every run prints mitata's table and, with `--out`, writes the JSON that
`benchmark-action/github-action-benchmark` consumes.

## What is covered

`packages/tagscript/bench/index.ts`

| group          | what                                                |
| -------------- | --------------------------------------------------- |
| `lexer`        | every parameter and payload form `Lexer` accepts    |
| `node tree`    | `buildNodeTree` from no tags up to fifty            |
| `parsers`      | all nineteen built-in parsers, one interpreter each |
| `transformers` | all four transformers                               |
| `interpreter`  | end-to-end renders, all eighteen parsers registered |

`packages/tagscript-plugin-discord/bench/index.ts` covers the seven parsers, `EmbedParser` across
its input forms, all six transformers, the colour and interaction utilities, and realistic
end-to-end tags.

Each parser is benchmarked through an interpreter holding **only** that parser, so the `willAccept`
fan-out stays at one and the number reflects the parser rather than the size of somebody's parser
list. The `interpreter` group is where fan-out cost shows up.

## Reading the numbers

Reported value is the **median** (p50) nanoseconds per iteration, not the mean. A shared CI runner
produces occasional very slow samples, and those move a mean much further than a median.

Treat CI numbers as a trend, not an absolute. GitHub-hosted runners vary by tens of percent between
runs depending on which host you land on, which is why `alert-threshold` is set to 150% and
`fail-on-alert` is off — the workflow reports, it does not gate. For a real before/after comparison,
run both sides locally on the same machine.

## Adding a benchmark

Add it to the relevant `group(...)` block. `do_not_optimize` around the result stops the JIT from
deleting work whose result is unused.

```ts
bench('my parser', function* () {
	yield async () => do_not_optimize(await ts.run('{mytag}'));
});
```

Renaming a benchmark starts its history over, since the name is its identity in the stored baseline.
