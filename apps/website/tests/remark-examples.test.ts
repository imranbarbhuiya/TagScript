import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, test } from 'vitest';

import { describeVariables, parseOutputMeta } from '../lib/examples';
import { decodeState } from '../lib/playground/state';
import { remarkExamples } from '../lib/remark-examples';

import type { Code } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

describe('parseOutputMeta', () => {
	test('GIVEN no options THEN a checked output with no variables', () => {
		expect(parseOutputMeta(null)).toStrictEqual({ illustrative: false, variables: [] });
	});

	test('GIVEN every way of writing a value THEN read each one', () => {
		expect(
			parseOutputMeta(`example args="Hi, you" empty="" n:integer=5 u:object='{"a":"b c"}' bare=word`),
		).toStrictEqual({
			illustrative: true,
			variables: [
				{ name: 'args', kind: 'string', value: 'Hi, you' },
				{ name: 'empty', kind: 'string', value: '' },
				{ name: 'n', kind: 'integer', value: '5' },
				{ name: 'u', kind: 'object', value: '{"a":"b c"}' },
				{ name: 'bare', kind: 'string', value: 'word' },
			],
		});
	});

	test.each(['exmaple', 'n:number=5'])('GIVEN %s THEN throw rather than ignore it', (meta) => {
		expect(() => parseOutputMeta(meta)).toThrow();
	});
});

describe('describeVariables', () => {
	test('GIVEN values and an empty one THEN describe both', () => {
		expect(
			describeVariables([
				{ name: 'args', kind: 'string', value: '' },
				{ name: 'n', kind: 'integer', value: '5' },
			]),
		).toBe('args is empty, n = 5');
	});
});

describe('remarkExamples', () => {
	const transform = (markdown: string) => {
		const tree = fromMarkdown(markdown);
		remarkExamples()(tree);
		return tree;
	};

	test('GIVEN a template and outputs THEN wrap them in one example with titled outputs', () => {
		const tree = transform(
			'Text\n\n```tagscript\nHi {args}\n```\n\n```output args="Ada"\nHi Ada\n```\n\n```output example\nHi\n```',
		);
		const [, element] = tree.children as [unknown, MdxJsxFlowElement];

		expect(element.name).toBe('TagScriptExample');
		expect((element.children as Code[]).map((code) => [code.lang, code.meta, code.value])).toStrictEqual([
			['tagscript', null, 'Hi {args}'],
			['text', 'title="Output · args = Ada"', 'Hi Ada'],
			['text', 'title="Example output"', 'Hi'],
		]);

		const link = element.attributes[0].value as string;
		const state = decodeState(link.slice(link.indexOf('#')));
		expect([state.template, state.variables]).toStrictEqual([
			'Hi {args}',
			[{ name: 'args', kind: 'string', value: 'Ada' }],
		]);
	});

	test('GIVEN a template with no output THEN leave it as a plain fence', () => {
		expect(transform('```tagscript\n{x}\n```').children[0].type).toBe('code');
	});

	test('GIVEN an example inside a list THEN still find it', () => {
		const tree = transform('- item\n\n  ```tagscript\n  {x}\n  ```\n\n  ```output\n  {x}\n  ```');
		expect(JSON.stringify(tree)).toContain('TagScriptExample');
	});

	test('GIVEN an output with no template before it THEN fail the build', () => {
		expect(() => transform('```output\nx\n```')).toThrow('has no tagscript fence before it');
	});
});
