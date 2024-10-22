import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';

import { docs, meta } from '@/.source';

export const source = loader({
	// baseUrl: '/',
	// rootDir: 'docs',
	source: createMDXSource(docs, meta)
});
