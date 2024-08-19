import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

import { Edit } from './Edit';

import type { Metadata } from 'next';

import { getPage, getPages } from '@/app/source';

export default async function Page({ params }: { readonly params: { slugs?: string[] } }) {
	const page = getPage(params.slugs);

	if (!page) notFound();

	const Mdx = page.data.exports.default;

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
			tableOfContent={{ footer, style: 'clerk', single: true }}
			tableOfContentPopover={{ footer }}
			toc={page.data.exports.toc}
		>
			<DocsBody>
				<Mdx />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return getPages().map((page) => ({
		slug: page.slugs
	}));
}

export function generateMetadata({ params }: { params: { slugs?: string[] } }) {
	const page = getPage(params.slugs);

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
