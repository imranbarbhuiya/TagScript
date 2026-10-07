import { Play } from 'lucide-react';

import { playgroundLink } from '../lib/run-example';

import type { Variable } from '../lib/playground/state';
import type { ReactNode } from 'react';

/**
 *
 * A template and what it renders to, with a link to run it in the playground.
 *
 * Built by `remarkExamples` from a `tagscript` fence and the `output` fences after it.
 *
 * @param props - The component's props.
 * @param props.children - The template's code block, then one per output.
 * @param props.example - The template and the first output's variables, URI-encoded JSON.
 * @returns
 */
export function TagScriptExample({ children, example }: { readonly children: ReactNode; readonly example: string }) {
	const { template, variables } = JSON.parse(decodeURIComponent(example)) as {
		template: string;
		variables: Variable[];
	};

	return (
		<div className="tagscript-example my-4 [&_figure]:my-2">
			{children}
			<a
				className="inline-flex items-center gap-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
				href={playgroundLink(template, variables)}
			>
				<Play className="size-3" />
				Open in playground
			</a>
		</div>
	);
}
