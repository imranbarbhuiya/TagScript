import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

import { LLMCopyButton, ViewOptions } from '@/components/page-actions';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

import { Edit } from './Edit';

import type { Metadata } from 'next';

export default async function Page(props: { readonly params: Promise<{ slugs?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slugs);

	if (!page) notFound();

	const Mdx = page.data.body;

	const path = `apps/website/content/docs/${page.path}`;
	const footer = path.includes('/api/') ? null : (
		<a
			className="inline-flex items-center justify-center font-medium ring-offset-fd-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80 h-9 rounded-md px-3 text-xs gap-1.5"
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
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<div className="flex flex-row gap-2 items-center border-b pb-6">
				<LLMCopyButton markdownUrl={`${page.url}.mdx`} />
				<ViewOptions githubUrl={`https://github.com/imranbarbhuiya/TagScript/tree/main/${path}`} markdownUrl={`${page.url}.mdx`} />
			</div>
			<DocsBody>
				<Mdx components={getMDXComponents()} />
			</DocsBody>
			{/* <Rate
				onRateAction={async (url, feedback) => {
					'use server';
					console.log('Feedback received:', { url, feedback });
				}}
			/> */}
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slugs?: string[] }> }): Promise<Metadata> {
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
			title: page.data.title,
			description: page.data.description,
			url: `/docs/${page.slugs.join('/')}`,
			images: image
		},
		twitter: {
			card: 'summary_large_image',
			title: page.data.title,
			description: page.data.description,
			images: image,
			site: 'https://tagscript.js.org'
		},
		alternates: {
			canonical: `https://tagscript.js.org/${page.url}`,
			languages: {
				en: `https://tagscript.js.org/${page.url}`
			}
		},
		appleWebApp: {
			capable: true,
			title: 'Tagscript',
			statusBarStyle: 'default'
		}
	};
}
