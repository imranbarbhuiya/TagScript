import { defineConfig, type UserConfig } from 'tsdown';

export const createTsdownConfig = (options: UserConfig = {}) =>
	defineConfig({
		clean: true,
		dts: true,
		treeshake: true,
		entry: ['src/index.ts'],
		format: ['esm', 'cjs', 'iife'],
		minify: false,
		sourcemap: true,
		target: 'esnext',
		tsconfig: 'src/tsconfig.json',
		outputOptions: {
			keepNames: true
		},
		deps: {
			skipNodeModulesBundle: true
		},
		...options
	});
