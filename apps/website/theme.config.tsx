import Link from 'next/link';
import { useRouter } from 'next/router';
import { useConfig, type DocsThemeConfig } from 'nextra-theme-docs';
import React from 'react';

const Vercel = ({ height = 20 }) => (
	<svg fill="none" height={height} viewBox="0 0 283 64">
		<path
			d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
			fill="currentColor"
		/>
	</svg>
);

const config: DocsThemeConfig = {
	logo: (
		<Link className="flex justify-center items-center" href="https://tagscript.js.org">
			Tagscript Documentation
		</Link>
	),
	project: {
		link: 'https://github.com/imranbarbhuiya/tagscript'
	},
	docsRepositoryBase: 'https://github.com/imranbarbhuiya/tagscript/blob/main/apps/website/',
	head: () => {
		/* eslint-disable react-hooks/rules-of-hooks */
		const { asPath } = useRouter();
		const { frontMatter } = useConfig();
		/* eslint-enable react-hooks/rules-of-hooks */
		return (
			<>
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<meta
					content={frontMatter.description || 'Tagscript is a simple, lightweight, and easy to use templating language.'}
					name="description"
				/>
				<meta content={frontMatter.title || 'TagScript'} property="og:title" />
				<meta
					content={frontMatter.description || 'Tagscript is a simple, lightweight, and easy to use templating language.'}
					property="og:description"
				/>
				<meta content="summary_large_image" name="twitter:card" />
				<meta content={frontMatter.title || 'TagScript'} name="twitter:title" />
				<meta
					content={frontMatter.description || 'Tagscript is a simple, lightweight, and easy to use templating language.'}
					name="twitter:description"
				/>
				<meta content="https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png" name="twitter:image" />
				<meta content="https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png" property="og:image" />
				<link href="https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png" rel="icon" />
				<meta content={`https://tag-script.vercel.com${asPath}`} property="og:url" />
			</>
		);
	},
	feedback: { labels: 'apps:website' },
	editLink: { text: 'Edit this page on GitHub' },
	footer: {
		text: (
			<a
				className="inline-flex items-center no-underline text-current font-semibold"
				href="https://vercel.com/?utm_source=swr"
				rel="noopener noreferrer"
				target="_blank"
			>
				<span className="mr-1">Powered by</span>
				<span>
					<Vercel />
				</span>
			</a>
		)
	},
	useNextSeoProps() {
		return {
			titleTemplate: '%s – Tagscript'
			// useAppDir: true
		};
	},
	chat: {
		link: 'https://discord.com/users/758880890159235083'
	},
	banner: {
		key: 'beta-docs',
		text: (
			<a href="https://tagscript.js.org" rel="noreferrer" target="_blank">
				🚧 This site is still in beta state. Please read current typedoc generated docs here →
			</a>
		)
	}
};

export default config;
