import common from 'eslint-config-mahir/common';
import module from 'eslint-config-mahir/module';
import node from 'eslint-config-mahir/node';
import tsdoc from 'eslint-config-mahir/tsdoc';
import typescript from 'eslint-config-mahir/typescript';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
export default [
	...common,
	...node,
	...module,
	...typescript,
	...tsdoc,
	{
		settings: {
			next: {
				rootDir: ['apps/*/']
			}
		},
		ignores: ['node_modules/', '**/dist/', '**/docs/', '**/build/', '**/*.d.ts'],
		languageOptions: {
			parserOptions: {
				projectService: false,
				tsconfigRootDir: import.meta.dirname,
				project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.typecheck.json']
			}
		}
	}
];
