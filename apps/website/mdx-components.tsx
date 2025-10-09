import { Callout } from 'fumadocs-ui/components/callout';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';

import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		img: (props) => <ImageZoom {...(props as any)} />,
		Image: (props) => <ImageZoom {...(props as any)} />,
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
		...components
	};
}
