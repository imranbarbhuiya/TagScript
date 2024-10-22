import { createPreset } from 'fumadocs-ui/tailwind-plugin';
import animate from 'tailwindcss-animate';

import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	presets: [createPreset()],
	content: [
		'./node_modules/fumadocs-ui/dist/**/*.js',

		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./content/**/*.mdx',
		'./mdx-components.tsx'
	],
	plugins: [animate]
} satisfies Config;
