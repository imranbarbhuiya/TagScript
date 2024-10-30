import common from 'eslint-config-mahir/common';
import edge from 'eslint-config-mahir/edge';
import mdx from 'eslint-config-mahir/mdx';
import module from 'eslint-config-mahir/module';
import next from 'eslint-config-mahir/next';
import node from 'eslint-config-mahir/node';
import react from 'eslint-config-mahir/react';
import typescript from 'eslint-config-mahir/typescript';

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

	...mdx.map((config) => ({
		files: ['**/*.mdx'],
		...config
	})),
	...typescript.map((config) => ({
		files: ['**/*.tsx', '**/*.ts', '**/*.cjs', '**/*.jsx', '**/*.js'],
		...config
	})),
	{
		ignores: ['next-env.d.ts', '**/*.md', '.source', '.next']
	}
];
