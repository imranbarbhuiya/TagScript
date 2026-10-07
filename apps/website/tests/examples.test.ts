import { globSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, test } from 'vitest';

import { eachParent, findExamples, renderExample } from '../lib/examples';

import type { Example } from '../lib/examples';

const files = globSync('content/docs/**/*.mdx', { cwd: import.meta.dirname + '/..' }).filter(
	(file) => !file.includes('/api/'),
);

const sources = new Map(
	await Promise.all(
		files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), 'utf8')] as const),
	),
);

const examplesIn = (file: string) => {
	const examples: Example[] = [];
	eachParent(fromMarkdown(sources.get(file)!), (children) => examples.push(...findExamples(children)));
	return examples;
};

const cases = files.flatMap((file) =>
	examplesIn(file).flatMap((example) =>
		example.outputs
			.filter((output) => !output.illustrative)
			.map((output) => ({ name: `${file}:${output.line}`, template: example.template, output })),
	),
);

describe('docs examples', () => {
	test('GIVEN the docs THEN there are examples to check', () => {
		expect(cases.length).toBeGreaterThan(40);
	});

	test.each(cases)('$name renders the output it shows', async ({ template, output }) => {
		expect(await renderExample(template, output.variables)).toBe(output.value);
	});

	test.each(files)('%s keeps output out of its templates', (file) => {
		const fences = [...sources.get(file)!.matchAll(/^```tagscript[^\n]*\n([\s\S]*?)^```/gm)];
		const lines = fences.flatMap(([, body]) => body.split('\n')).filter((line) => line.startsWith('# '));
		expect(lines, 'put expected output in an ```output fence after the template').toStrictEqual([]);
	});
});
