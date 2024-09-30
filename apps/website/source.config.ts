import { remarkInstall } from 'fumadocs-docgen';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs();

export default defineConfig({
	lastModifiedTime: 'git',
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: 'catppuccin-latte',
				dark: 'catppuccin-mocha'
			}
		},
		remarkPlugins: [[remarkInstall, { Tabs: 'InstallTabs' }]]
	}
});
