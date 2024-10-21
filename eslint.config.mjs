import common from 'eslint-config-mahir/common';
import node from 'eslint-config-mahir/node';
import module from 'eslint-config-mahir/module';
import typescript from 'eslint-config-mahir/typescript';
import tsdoc from 'eslint-config-mahir/tsdoc';

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
		ignores: ['node_modules/', '**/dist/', '**/docs/', '**/build/', '**/*.d.ts']
	}
];
