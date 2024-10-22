import common from 'eslint-config-mahir/common';
import edge from 'eslint-config-mahir/edge';
import mdx from 'eslint-config-mahir/mdx';
import module from 'eslint-config-mahir/module';
import next from 'eslint-config-mahir/next';
import node from 'eslint-config-mahir/node';
import react from 'eslint-config-mahir/react';

// export default [
// 	[{ files: ['*.mdx'] }, ...common, ...node, ...module, ...react, ...next, ...edge, ...mdx],
// 	[...common, ...node, ...module, ...typescript, ...react, ...next, ...edge],
// 	{
// 		ignores: ['next-env.d.ts', '**/*.md']
// 	}
// ];

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
export default [
	...common,
	...node,
	...module,
	...react,
	...next,
	...edge,
	...mdx,
	{
		ignores: ['next-env.d.ts', '**/*.md', '.source']
	}
];
