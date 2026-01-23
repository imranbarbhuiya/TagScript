import { notFound } from 'next/navigation';

import { getLLMText } from '@/lib/get-llm-text';
import { source } from '@/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/[[...slugs]]'>) {
	const { slugs } = await params;
	const page = source.getPage(slugs);
	if (!page) notFound();

	return new Response(await getLLMText(page), {
		headers: {
			'Content-Type': 'text/markdown'
		}
	});
}

export function generateStaticParams() {
	return source.generateParams();
}
