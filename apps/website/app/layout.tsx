import { RootToggle } from 'fumadocs-ui/components/layout/root-toggle';
import { DocsLayout } from 'fumadocs-ui/layout';
import { RootProvider } from 'fumadocs-ui/provider';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Provider } from './provider';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { pageTree } from '@/app/source';

import 'fumadocs-ui/style.css';
import './globals.css';

export default function RootLayout({ children }: { readonly children: ReactNode }) {
	return (
		<html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en" suppressHydrationWarning>
			<body>
				<Provider>
					<DocsLayout
						githubUrl="https://github.com/imranbarbhuiya/tagscript"
						nav={{ title: 'Tagscript' }}
						sidebar={{
							banner: (
								<RootToggle
									options={
										[
											{
												title: 'Tagscript',
												url: '/'
											},
											{
												title: 'Tagscript API Docs',
												description: 'Auto generated api docs for tagscript',
												url: '/api/tagscript'
											},
											{
												title: 'Discord Plugin API Docs',
												description: 'Auto generated api docs for tagscript',
												url: '/api/plugins/plugin-discord'
											}
										] as any
									}
								/>
							)
						}}
						tree={pageTree}
					>
						{children}
					</DocsLayout>
				</Provider>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: 'Tagscript',
	description: 'Tagscript is a simple, lightweight, and easy to use templating language.',
	metadataBase: process.env.NODE_ENV === 'development' ? new URL('http://localhost:3000') : new URL(`https://${process.env.VERCEL_URL!}`),
	openGraph: {
		images: ['https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png']
	},
	twitter: {
		images: ['https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png']
	},
	icons: ['https://raw.githubusercontent.com/imranbarbhuiya/TagScript/main/.github/logo_short.png']
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
		{ media: '(prefers-color-scheme: light)', color: '#fff' }
	]
};
