import { defineConfig, type ViteUserConfig } from 'vitest/config';

export const createVitestConfig = (options: ViteUserConfig = {}) =>
	defineConfig({
		...options,
		test: {
			include: ['tests/**/*.test.ts'],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'lcov'],
				include: ['src/**'],
			},
			...options.test,
		},
	});
