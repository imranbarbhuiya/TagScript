import { remarkNpm } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({ dir: 'content/docs' });

export default defineConfig({
	lastModifiedTime: 'git',
	mdxOptions: {
		rehypeCodeOptions: { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } },
		remarkPlugins: [[remarkNpm, { Tabs: 'InstallTabs' }]]
	}
});
