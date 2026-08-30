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
	],
});
