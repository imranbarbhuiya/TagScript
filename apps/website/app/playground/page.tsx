import { Playground } from '@/components/playground/playground';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Playground | Tagscript',
	description: 'Write a template and watch the interpreter read it, tag by tag, in your browser.',
};

export default function PlaygroundPage() {
	return <Playground />;
}
