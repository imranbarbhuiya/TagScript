'use client';

import { GENERIC_PARSER_ERROR_MESSAGE, extractTags } from 'tagscript';

import { cn } from '@/lib/cn';

import type { ExtractedTag, ParenType, Response } from 'tagscript';

/**
 * A titled box, so the four views read as one instrument rather than four widgets.
 */
interface PanelProps {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly hint?: string;
	readonly title: string;
}

export function Panel({ title, hint, children, className }: PanelProps) {
	return (
		<section className={cn('flex min-h-0 flex-col rounded-lg border border-fd-border bg-fd-card', className)}>
			<header className="flex shrink-0 items-baseline gap-2 border-b border-fd-border px-3 py-2">
				<h2 className="text-sm font-medium text-fd-foreground">{title}</h2>
				{hint && <p className="truncate text-xs text-fd-muted-foreground">{hint}</p>}
			</header>
			<div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
		</section>
	);
}

/**
 *
 * Shows what the interpreter read, one tag per row.
 *
 * @param props - The template, and what to do when a row is picked.
 * @returns
 */
interface StructureProps {
	readonly onSelect: (tag: ExtractedTag | null) => void;
	readonly parenType: ParenType;
	readonly selected: ExtractedTag | null;
	readonly tagLimit: number;
	readonly template: string;
}

export function Structure({ template, parenType, tagLimit, onSelect, selected }: StructureProps) {
	const tags = extractTags(template, { parenType, tagLimit });
	if (!tags.length) return <p className="text-sm text-fd-muted-foreground">No tags in this template.</p>;

	return (
		<ul className="flex flex-col gap-0.5 font-mono text-xs">
			{tags.map((tag) => (
				<li key={`${tag.start}-${tag.end}`}>
					<button
						className={cn(
							'flex w-full items-baseline gap-2 rounded px-1.5 py-1 text-left hover:bg-fd-accent',
							selected?.start === tag.start && 'bg-fd-primary/15',
						)}
						onClick={() => onSelect(selected?.start === tag.start ? null : tag)}
						style={{ paddingLeft: `${tag.depth * 0.85 + 0.375}rem` }}
						type="button"
					>
						<span className="text-blue-600 italic dark:text-blue-300">{tag.tag.declaration ?? '?'}</span>
						{tag.tag.parameter !== null && (
							<span className="text-red-600 dark:text-red-300">({tag.tag.parameter})</span>
						)}
						{tag.tag.payload !== null && <span className="truncate text-fd-muted-foreground">: {tag.tag.payload}</span>}
						<span className="ml-auto shrink-0 text-fd-muted-foreground tabular-nums">#{tag.order + 1}</span>
					</button>
				</li>
			))}
		</ul>
	);
}

/**
 *
 * Replays the render one tag at a time.
 *
 * Tags are evaluated innermost first, which surprises nearly everyone. Watching the body change a
 * step at a time explains it better than a paragraph can.
 *
 * @param props - The trace to replay and which step is showing.
 * @returns
 */
interface EvaluationProps {
	readonly onStep: (step: number) => void;
	readonly response: Response | null;
	readonly step: number;
}

export function Evaluation({ response, step, onStep }: EvaluationProps) {
	const trace = response?.trace ?? [];
	if (!trace.length) return <p className="text-sm text-fd-muted-foreground">Nothing to evaluate.</p>;

	const current = trace[Math.min(step, trace.length - 1)];

	return (
		<div className="flex flex-col gap-3">
			<ol className="flex flex-col gap-0.5 font-mono text-xs">
				{trace.map((entry, index) => (
					<li key={`${entry.start}-${index}`}>
						<button
							className={cn(
								'flex w-full items-baseline gap-2 rounded px-1.5 py-1 text-left hover:bg-fd-accent',
								index === Math.min(step, trace.length - 1) && 'bg-fd-primary/15',
							)}
							onClick={() => onStep(index)}
							type="button"
						>
							<span className="w-5 shrink-0 text-fd-muted-foreground tabular-nums">{index + 1}</span>
							<span className="truncate text-teal-600 dark:text-teal-300">{entry.tag}</span>
							<span className="shrink-0 text-fd-muted-foreground">→</span>
							<span className={cn('truncate', entry.output === null && 'text-fd-muted-foreground italic')}>
								{entry.output === null ? 'not handled' : JSON.stringify(entry.output)}
							</span>
						</button>
					</li>
				))}
			</ol>
			<pre className="overflow-auto rounded border border-fd-border bg-fd-secondary/40 p-2 font-mono text-xs whitespace-pre-wrap">
				{current.body}
			</pre>
		</div>
	);
}

/**
 *
 * Shows what the render produced, and what it recorded on the way.
 *
 * @param props - The finished response.
 * @returns
 */
interface OutputProps {
	readonly error: string | null;
	readonly response: Response | null;
}

export function Output({ response, error }: OutputProps) {
	if (error) {
		return (
			<pre className="overflow-auto rounded border border-red-500/40 bg-red-500/10 p-2 font-mono text-xs whitespace-pre-wrap text-red-700 dark:text-red-300">
				{error}
			</pre>
		);
	}

	if (!response) return <p className="text-sm text-fd-muted-foreground">Nothing rendered yet.</p>;

	const actions = Object.keys(response.actions).length ? response.actions : null;
	const variables = Object.keys(response.variables);

	return (
		<div className="flex flex-col gap-3 text-xs">
			<pre className="overflow-auto rounded border border-fd-border bg-fd-secondary/40 p-2 font-mono whitespace-pre-wrap">
				{response.body}
			</pre>
			{response.errors.length > 0 && (
				<div className="flex flex-col gap-1">
					<h3 className="font-medium text-fd-muted-foreground">Errors</h3>
					<ul className="flex flex-col gap-1">
						{response.errors.map((entry, index) => (
							<li
								className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 font-mono"
								key={`${entry.name}-${index}`}
							>
								<span className="font-medium">{entry.name}</span>
								{': '}
								{entry.message}
								{entry.message === GENERIC_PARSER_ERROR_MESSAGE && (
									<span className="text-fd-muted-foreground">
										{' '}
										(a parser threw, so the template author is shown a generic line)
									</span>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
			{actions && (
				<div className="flex flex-col gap-1">
					<h3 className="font-medium text-fd-muted-foreground">Actions</h3>
					<pre className="overflow-auto rounded border border-fd-border p-2 font-mono">
						{JSON.stringify(actions, null, 2)}
					</pre>
				</div>
			)}
			{variables.length > 0 && (
				<div className="flex flex-col gap-1">
					<h3 className="font-medium text-fd-muted-foreground">Variables</h3>
					<p className="font-mono">{variables.join(', ')}</p>
				</div>
			)}
		</div>
	);
}
