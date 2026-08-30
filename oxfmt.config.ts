import config from '@imranbarbhuiya/oxc-config/oxfmt';
import { defineConfig } from 'oxfmt';

export default defineConfig({
	...config,
	ignorePatterns: [
		'.turbo',
		'**/dist/**',
		'**/docs/**',
		'**/coverage/**',
		'**/CHANGELOG.md',
		'apps/website/.next',
		'apps/website/next-env.d.ts',
		'apps/website/.source',
		'apps/website/content/docs/api',
	],
});
