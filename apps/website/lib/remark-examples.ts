import { describeVariables, eachParent, findExamples } from './examples';

import type { Code, Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/**
 *
 * Turns each `tagscript` fence and the `output` fences after it into one `TagScriptExample`, with
 * every output shown as a titled code block. The component adds the playground link, since building
 * it needs the library and this runs before any workspace package is built.
 *
 * Output lives in its own fence rather than in `#` lines inside the template, because `#` is
 * ordinary text in TagScript and a copied example should be exactly a template.
 *
 * @returns The transformer.
 */
export const remarkExamples = () => (tree: Root) => {
	eachParent(tree, (children) => {
		for (const example of findExamples(children).reverse()) {
			const template = children[example.index] as Code;
			const outputs = example.outputs.map((output): Code => ({
				type: 'code',
				lang: 'text',
				meta: `title="${[output.illustrative ? 'Example output' : 'Output', describeVariables(output.variables)].filter(Boolean).join(' · ')}"`,
				value: output.value,
			}));

			const element: MdxJsxFlowElement = {
				type: 'mdxJsxFlowElement',
				name: 'TagScriptExample',
				attributes: [
					{
						type: 'mdxJsxAttribute',
						name: 'example',
						// Encoded so the attribute holds no `>` or newline, which keeps the wrapper on one line
						// for `getLLMText` to unwrap.
						value: encodeURIComponent(
							JSON.stringify({ template: example.template, variables: example.outputs[0].variables }),
						),
					},
				],
				children: [template, ...outputs],
			};

			children.splice(example.index, example.count, element);
		}
	});
};
