import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const packages = ['packages/tagscript', 'packages/tagscript-plugin-discord'];

const scratch = mkdtempSync(join(tmpdir(), 'tagscript-bench-'));
const results = [];

// Benchmarks are run one package at a time rather than through turbo. Two suites racing on the same
// runner contend for CPU and produce numbers that drift against the stored baseline for no reason
// other than scheduling.
for (const directory of packages) {
	const out = join(scratch, `${directory.replaceAll('/', '-')}.json`);

	const { status } = spawnSync('bun', ['bench/index.ts', '--out', out], {
		cwd: directory,
		stdio: 'inherit',
	});

	if (status !== 0) {
		console.error(`\nBenchmarks failed in ${directory}`);
		process.exit(status ?? 1);
	}

	results.push(...JSON.parse(readFileSync(out, 'utf8')));
}

const index = process.argv.indexOf('--out');
const destination = index === -1 ? 'bench-results.json' : process.argv[index + 1];

writeFileSync(destination, `${JSON.stringify(results, null, 2)}\n`);
console.log(`\n${results.length} benchmarks written to ${destination}`);
