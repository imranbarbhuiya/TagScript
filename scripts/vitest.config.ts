import { defineConfig } from 'vitest/config';

export const createVitestConfig = () =>
	defineConfig({
		test: {
			globals: true,
			coverage: {
				enabled: true,
				reporter: ['text', 'lcov', 'cobertura'],
				provider: 'c8'
			}
		},
		esbuild: {
			target: 'esnext'
		}
	});
