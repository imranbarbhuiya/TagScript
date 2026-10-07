import { playwright } from '@vitest/browser-playwright';

import { createVitestConfig } from '../../scripts/vitest.config';

export default createVitestConfig({
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			headless: true,
			instances: [{ browser: 'chromium' }],
		},
	},
});
