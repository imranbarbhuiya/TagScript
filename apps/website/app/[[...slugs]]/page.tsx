import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getPage, getPages } from '@/app/source';

export default async function Page({ params }: { params: { slugs?: string[] } }) {
	const page = getPage(params.slugs);

	if (!page) notFound();

	const Mdx = page.data.exports.default;

	return (
		<DocsPage full toc={page.data.exports.toc}>
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
