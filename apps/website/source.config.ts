import { remarkNpm } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import grammar from 'tagscript/language/tagscript.tmLanguage.json' with { type: 'json' };

export const docs = defineDocs({
	dir: 'content/docs',
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
			extractLinkReferences: true,
		},
	},
});

export default defineConfig({
	plugins: [lastModified()],
	mdxOptions: {
		rehypeCodeOptions: {
			themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
			// The grammar ships with the library, so a fence here and an editor read the same rules.
			langs: [grammar],
		},
		remarkPlugins: [[remarkNpm, { Tabs: 'InstallTabs' }]],
	},
});
