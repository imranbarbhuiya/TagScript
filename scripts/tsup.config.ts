import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Options } from 'tsup';

export const createTsupConfig = ({
	globalName = undefined,
	format = ['esm', 'cjs', 'iife'],
	target = 'es2021',
	sourcemap = true
}: ConfigOptions = {}) =>
	defineConfig({
		clean: true,
		dts: true,
		entry: ['src/index.ts'],
		format,
		minify: false,
		skipNodeModulesBundle: true,
		sourcemap,
		target,
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'src', 'tsconfig.json')),
		keepNames: true,
		globalName
	});

type ConfigOptions = Pick<Options, 'sourcemap' | 'target' | 'format' | 'globalName'>;
