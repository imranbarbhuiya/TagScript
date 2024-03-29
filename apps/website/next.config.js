/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
import nextra from 'nextra';

const withNextra = nextra({ theme: 'nextra-theme-docs', themeConfig: './theme.config.tsx' });

/**
 * @type {import('next').NextConfig}
 */
export default withNextra({
	reactStrictMode: true,
	experimental: {
		mdxRs: true
	}
});
