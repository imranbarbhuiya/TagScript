import common from '@imranbarbhuiya/oxc-config/common';
import edge from '@imranbarbhuiya/oxc-config/edge';
import module from '@imranbarbhuiya/oxc-config/module';
import next from '@imranbarbhuiya/oxc-config/next';
import node from '@imranbarbhuiya/oxc-config/node';
import react from '@imranbarbhuiya/oxc-config/react';
import tailwind from '@imranbarbhuiya/oxc-config/tailwind';
import tsdoc from '@imranbarbhuiya/oxc-config/tsdoc';
import typescript from '@imranbarbhuiya/oxc-config/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [common, node, module, typescript, tsdoc, react, next, edge, tailwind],
	ignorePatterns: [
		'.github/**',
		'.turbo/**',
		'**/dist/**',
		'**/docs/**',
		'**/coverage/**',
		'**/*.d.ts',
		'apps/website/.next/**',
		'apps/website/.source/**',
		'apps/website/content/docs/api/**',
	],
	env: {
		node: true,
	},
	rules: {
		// Bridge until @imranbarbhuiya/oxc-config ships this. The shared config used
		// `multi-or-nest`, which fights oxfmt: the formatter wraps a body longer than
		// `printWidth` in braces and the linter then asks for them back. `multi-line` leaves
		// line breaking to the formatter and still catches a body sitting on its own line
		// without braces. Drop this once the dependency is bumped.
		curly: [2, 'multi-line'],
	},
	options: {
		typeAware: true,
	},
	settings: {
		react: {
			version: '19.0.0',
		},
		next: {
			rootDir: ['apps/*/'],
		},
		tailwindcss: {
			entryPoint: 'apps/website/app/globals.css',
		},
	},
	overrides: [
		{
			files: ['apps/**', 'scripts/**'],
			rules: {
				'tsdoc-js/syntax': 'off',
			},
		},
		{
			// mitata registers a benchmark as `bench('name', function* () { ... })`, so the generator
			// is anonymous by design and the label is the string argument next to it.
			files: ['**/bench/**'],
			rules: {
				'eslint/func-names': 'off',
			},
		},
		{
			// Effect's generator APIs take anonymous generators, and its `Effect.catch` combinator
			// is not a promise `.catch`, which is what the two promise rules think they are seeing.
			files: ['**/src/effect/**', '**/tests/effect/**'],
			rules: {
				'eslint/func-names': 'off',
				'promise/prefer-await-to-callbacks': 'off',
				'promise/prefer-await-to-then': 'off',
			},
		},
	],
});
