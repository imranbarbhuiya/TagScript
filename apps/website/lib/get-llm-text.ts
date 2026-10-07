import { source } from '@/lib/source';

import type { InferPageType } from 'fumadocs-core/source';

export async function getLLMText(page: InferPageType<typeof source>) {
	// The example wrapper only carries the playground link, which is noise in copied markdown.
	const processed = (await page.data.getText('processed')).replaceAll(
		/^<TagScriptExample\b[^>]*>\n+([\s\S]*?)\n*^<\/TagScriptExample>$/gm,
		(_, children: string) => `${children.replaceAll(/^ {2}/gm, '')}\n`,
	);

	return `# ${page.data.title} (${page.url})

${processed}`;
}
