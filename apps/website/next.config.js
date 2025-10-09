import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const config = {
	rewrites: async () => ({
		beforeFiles: [
			{
				source: '/:path*',
				destination: '/llms.mdx/:path*',
				has: [
					{
						type: 'header',
						key: 'accept',
						value: '(.*)text/markdown(.*)'
					}
				]
			}
		]
	}),
	redirects: async () => [
		{
			source: '/:path*.mdx',
			destination: '/llms.mdx/:path*',
			permanent: true
		},
		{
			source: '/basic-guide/:path*',
			destination: '/general-commands/:path*',
			permanent: true
		}
	]
};

export default withMDX(config);
