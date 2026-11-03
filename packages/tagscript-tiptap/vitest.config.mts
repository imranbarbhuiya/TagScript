import { playwright } from '@vitest/browser-playwright';

import { createVitestConfig } from '../../scripts/vitest.config.ts';

export default createVitestConfig({
	test: {
		browser: {
			enabled: true,
			provider: playwright({ launchOptions: { channel: 'chrome', chromiumSandbox: true } }),
			headless: true,
			instances: [{ browser: 'chromium' }],
		},
	},
});
