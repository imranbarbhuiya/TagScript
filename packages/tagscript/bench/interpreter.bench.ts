import { DefineParser, IfStatementParser, Interpreter, LooseVarsParser, RandomParser, StringTransformer } from '../src';

const cases = {
	'plain text, no tags': 'Just some text with no tags in it at all.',
	'single tag': '{if(1<2):yes|no}',
	'typical template': '{=(a):hello} {if({a}==hello):yes|no} {random:1,2,3} {a} {=(b):x}{b}',
	'nested tags': '{if({args}==63):You guessed it!|Too {if({args}<63):low|high}, try again.}',
	'many tags': Array.from({ length: 50 }, (_, index) => `{random:${index},${index + 1}}`).join(' '),
};

const ts = new Interpreter(new DefineParser(), new IfStatementParser(), new RandomParser(), new LooseVarsParser());

const seedVariables = { args: new StringTransformer('60') };

const run = async (template: string, iterations: number) => {
	for (let index = 0; index < iterations; index++) await ts.run(template, { seedVariables });
};

const iterations = Number(process.env.BENCH_ITERATIONS ?? 20_000);

console.log(`${iterations} iterations per case\n`);

for (const [name, template] of Object.entries(cases)) {
	await run(template, Math.min(1_000, iterations));

	const start = performance.now();
	await run(template, iterations);
	const elapsed = performance.now() - start;

	const perRun = (elapsed / iterations) * 1_000;
	console.log(`${perRun.toFixed(2).padStart(8)} µs/run  ${(elapsed / 1_000).toFixed(2).padStart(6)}s  ${name}`);
}
