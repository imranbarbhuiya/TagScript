import { remarkInstall } from 'fumadocs-docgen';
import createMDX from 'fumadocs-mdx/config';

const withMDX = createMDX({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: 'catppuccin-latte',
				dark: 'catppuccin-mocha'
			}
		},
		remarkPlugins: [[remarkInstall, { Tabs: 'InstallTabs' }]],
		lastModifiedTime: 'git'
	}
});

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true
};

export default withMDX(config);
