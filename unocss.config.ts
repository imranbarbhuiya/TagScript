import { defineConfig, presetUno, presetTypography } from 'unocss';

export default defineConfig({
	presets: [presetUno(), presetTypography()],
	include: [/.[jt]sx$/, /.mdx?$/]
});
