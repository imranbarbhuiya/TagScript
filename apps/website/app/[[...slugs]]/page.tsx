/* eslint-disable react/no-unstable-nested-components */
import { Callout } from 'fumadocs-ui/components/callout';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultComponents from 'fumadocs-ui/mdx';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

import { source } from '@/app/source';

import { Edit } from './Edit';

import type { MDXComponents, MDXContent } from 'mdx/types';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export default async function Page(props: { readonly params: Promise<{ slugs?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slugs);

	if (!page) notFound();

	const Mdx = page.data.body as MDXContent;

	const path = `apps/website/content/docs/${page.file.path}`;
	const footer = path.includes('/api/') ? null : (
		<a
			className="inline-flex items-center justify-center font-medium ring-offset-fd-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80 h-9 rounded-md px-3 text-xs gap-1.5"
			href={`https://github.com/imranbarbhuiya/TagScript/tree/main/${path}`}
			rel="noreferrer noopener"
			target="_blank"
		>
			<Edit className="size-3" />
			Edit on Github
		</a>
	);

	return (
		<DocsPage
			full={page.data.full}
			lastUpdate={page.data.lastModified}
			tableOfContent={{ footer, style: 'clerk', single: true }}
			tableOfContentPopover={{ footer }}
			toc={page.data.toc}
		>
			<DocsBody>
				<Mdx
					components={{
						...(defaultComponents as MDXComponents),
						pre: ({ ref: _ref, ...rest }) => (
							<CodeBlock {...rest}>
								<Pre>{rest.children}</Pre>
							</CodeBlock>
						),
						Tab,
						Tabs,
						InstallTabs: ({ items, children }: { readonly children: ReactNode; readonly items: string[] }) => (
							<Tabs id="package-manager" items={items}>
								{children}
							</Tabs>
						),
						blockquote: (props) => <Callout>{props.children}</Callout>,
						img: (props) => <ImageZoom {...props} />
					}}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slugs?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slugs);

	if (!page) notFound();

	const imageParams = new URLSearchParams();
	imageParams.set('title', page.data.title);
	imageParams.set('description', page.data.description ?? 'Tagscript is a simple, lightweight, and easy to use templating language.');

	const image = {
		alt: 'Banner',
		url: `/api/og/?${imageParams.toString()}`,
		width: 1_200,
		height: 630
	};

	return {
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			url: `/docs/${page.slugs.join('/')}`,
			images: image
		},
		twitter: {
			images: image
		}
	} satisfies Metadata;
}
