'use client';

import { RootProvider } from 'fumadocs-ui/provider';

export function Provider({ children }: { readonly children: React.ReactNode }) {
	return <RootProvider>{children}</RootProvider>;
}
