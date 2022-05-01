import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs', 'iife'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
	keepNames: true,
	globalName: 'TagScript',
	tsconfig: 'src/tsconfig.json',
	esbuildOptions: (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";'
			};
		}
	}
});
