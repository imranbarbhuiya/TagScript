import { remarkNpm } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';

export const docs = defineDocs({
	dir: 'content/docs',
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
			extractLinkReferences: true
		}
	}
});

export default defineConfig({
	plugins: [lastModified()],
	mdxOptions: {
		rehypeCodeOptions: { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } },
		remarkPlugins: [[remarkNpm, { Tabs: 'InstallTabs' }]]
	}
});
