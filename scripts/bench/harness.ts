import { run } from 'mitata';

/**
 * One benchmark, in the shape `benchmark-action/github-action-benchmark` reads with
 * `tool: customSmallerIsBetter`.
 */
export interface BenchmarkResult {
	extra?: string;
	name: string;
	range?: string;
	unit: string;
	value: number;
}

interface MitataStats {
	avg: number;
	max: number;
	min: number;
	p50: number;
	p75: number;
	p99: number;
}

interface MitataBenchmark {
	alias: string;
	group: number | null;
	runs: { stats: MitataStats | null }[];
}

interface MitataReport {
	benchmarks: MitataBenchmark[];
	context: { cpu: { name: string }; runtime: string };
	layout: { name: string | null }[];
}

/**
 *
 * Runs every benchmark registered on mitata's global registry and returns them flattened.
 *
 * mitata reports nanoseconds per iteration. The value reported to CI is the median rather than the
 * mean, because a shared CI runner produces occasional very slow samples that drag a mean around
 * far more than they move a median.
 *
 * @param prefix - Prepended to every name, so results from different packages stay distinct.
 * @returns
 */
export const runBenchmarks = async (prefix: string): Promise<BenchmarkResult[]> => {
	// `run` prints its own table and returns the full report either way, so CI logs stay readable
	// while the same call feeds the JSON the benchmark action consumes.
	const report = (await run({ colors: !process.env.CI })) as unknown as MitataReport;

	return report.benchmarks
		.filter((benchmark) => benchmark.runs[0]?.stats)
		.map((benchmark) => {
			const stats = benchmark.runs[0].stats!;
			const group = benchmark.group === null ? null : report.layout[benchmark.group]?.name;

			return {
				name: `${prefix} / ${group ? `${group} / ` : ''}${benchmark.alias}`,
				unit: 'ns/op',
				value: Number(stats.p50.toFixed(3)),
				range: `± ${(stats.p75 - stats.p50).toFixed(3)}`,
				extra: `avg ${stats.avg.toFixed(1)}ns, min ${stats.min.toFixed(1)}ns, p99 ${stats.p99.toFixed(1)}ns`,
			};
		});
};

/**
 *
 * Writes results to the path given by `--out`, or prints them, so the same entrypoint works for a
 * developer reading numbers and for CI feeding the benchmark action.
 *
 * @param results - The benchmarks to emit.
 */
export const emitResults = async (results: BenchmarkResult[]) => {
	const index = process.argv.indexOf('--out');
	if (index === -1) return;

	await Bun.write(process.argv[index + 1], `${JSON.stringify(results, null, 2)}\n`);
};
