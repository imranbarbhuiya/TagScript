import { Callout } from 'fumadocs-ui/components/callout';
import { CodeBlock, Pre, type CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultComponents from 'fumadocs-ui/mdx';

import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...(defaultComponents as MDXComponents),
		pre: ({ title, className, icon, allowCopy, ...props }: CodeBlockProps) => (
			<CodeBlock allowCopy={allowCopy} icon={icon} title={title}>
				<Pre {...props} />
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
		...components
	};
}
