import { relative, resolve as resolveDir } from 'node:path';
import process from 'node:process';

import { defineConfig, type Options } from 'tsup';

export const createTsupConfig = (options: Options = {}) =>
	defineConfig({
		clean: true,
		dts: true,
		treeshake: true,
		entry: ['src/index.ts'],
		format: ['esm', 'cjs', 'iife'],
		minify: false,
		skipNodeModulesBundle: true,
		sourcemap: true,
		target: 'esnext',
		// eslint-disable-next-line unicorn/prefer-module
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'src', 'tsconfig.json')),
		keepNames: true,
		...options
	});
