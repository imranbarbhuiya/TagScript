'use client';

import { Check, Link2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Interpreter } from 'tagscript';

import { PARSERS, TRANSFORMERS, manifestFor } from '@/lib/playground/registry';
import { decodeState, encodeState, INITIAL } from '@/lib/playground/state';

import { Config } from './config';
import { Highlight } from './highlight';
import { Evaluation, Output, Panel, Structure } from './panels';

import type { PlaygroundState } from '@/lib/playground/state';
import type { ExtractedTag, ITransformer, Response } from 'tagscript';

/**
 *
 * Runs a template with whatever is currently switched on.
 *
 * @param state - Everything the render needs.
 * @returns The response, or the message from anything that rejected.
 */
const render = async (state: PlaygroundState): Promise<{ error: string | null; response: Response | null }> => {
	const parsers = PARSERS.filter((parser) => state.parsers.includes(parser.id)).map((parser) => parser.create());
	const seedVariables: Record<string, ITransformer> = {};
	for (const variable of state.variables) {
		if (variable.name) seedVariables[variable.name] = TRANSFORMERS[variable.kind].build(variable.value);
	}

	try {
		const response = await new Interpreter(...parsers).run(state.template, {
			seedVariables,
			charLimit: state.charLimit.trim() === '' ? null : Number(state.charLimit),
			tagLimit: Number(state.tagLimit) || 2_000,
			parenType: state.parenType,
			spans: true,
			trace: true,
		});
		return { response, error: null };
	} catch (error) {
		return { response: null, error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
	}
};

/**
 *
 * The playground.
 *
 * Everything runs here in the browser. The library has no dependencies and touches nothing outside
 * itself, so no template ever leaves the page.
 */
export function Playground() {
	const [state, setState] = useState<PlaygroundState>(INITIAL);
	const [result, setResult] = useState<{ error: string | null; response: Response | null }>({
		response: null,
		error: null,
	});
	const [selected, setSelected] = useState<ExtractedTag | null>(null);
	const [step, setStep] = useState(0);
	const [copied, setCopied] = useState(false);
	const editor = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setState(decodeState(globalThis.location.hash));
	}, []);

	useEffect(() => {
		let live = true;
		const run = async () => {
			const next = await render(state);
			if (live) setResult(next);
		};

		void run();
		return () => {
			live = false;
		};
	}, [state]);

	const tagLimit = Number(state.tagLimit) || 2_000;
	const tags = useMemo(
		() => manifestFor(state.parsers, state.variables.map((variable) => variable.name).filter(Boolean), state.template),
		[state.parsers, state.variables, state.template],
	);

	const change = (next: Partial<PlaygroundState>) => {
		setState((current) => ({ ...current, ...next }));
		setSelected(null);
		setStep(0);
	};

	const share = async () => {
		const url = `${globalThis.location.origin}${globalThis.location.pathname}#${encodeState(state)}`;
		globalThis.history.replaceState(null, '', url);
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2_000);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 p-4 lg:h-[calc(100vh-4rem)]">
			<header className="flex shrink-0 items-baseline gap-3">
				<h1 className="text-xl font-semibold">Playground</h1>
				<p className="text-sm text-fd-muted-foreground">Runs in your browser. Nothing you type is sent anywhere.</p>
				<button
					className="ml-auto flex items-center gap-1.5 rounded border border-fd-border px-2 py-1 text-xs hover:bg-fd-accent"
					onClick={() => void share()}
					type="button"
				>
					{copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
					{copied ? 'Link copied' : 'Copy link'}
				</button>
			</header>
			<div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_16rem]">
				<div className="flex min-h-0 flex-col gap-3">
					<Panel className="min-h-56 flex-1" hint="the same lexer a render uses" title="Template">
						<div className="relative h-full min-h-40 font-mono text-sm">
							<pre
								aria-hidden
								className="pointer-events-none absolute inset-0 overflow-auto break-words whitespace-pre-wrap"
							>
								<Highlight
									parenType={state.parenType}
									selection={selected && { start: selected.start, end: selected.end + 1 }}
									tagLimit={tagLimit}
									tags={tags}
									template={state.template}
								/>
							</pre>
							<textarea
								aria-label="Template"
								className="absolute inset-0 resize-none bg-transparent break-words whitespace-pre-wrap text-transparent caret-current outline-none"
								onChange={(event) => change({ template: event.target.value })}
								ref={editor}
								spellCheck={false}
								value={state.template}
							/>
						</div>
					</Panel>
					<Panel className="min-h-40 flex-1" hint="what the interpreter read" title="Structure">
						<Structure
							onSelect={(tag) => {
								setSelected(tag);
								if (!tag) return;
								// Focus first, or the range is set on an element that is not showing a caret.
								editor.current?.focus();
								editor.current?.setSelectionRange(tag.start, tag.end + 1);
							}}
							parenType={state.parenType}
							selected={selected}
							tagLimit={tagLimit}
							template={state.template}
						/>
					</Panel>
				</div>
				<div className="flex min-h-0 flex-col gap-3">
					<Panel className="min-h-48 flex-1" hint="innermost tags run first" title="Evaluation">
						<Evaluation onStep={setStep} response={result.response} step={step} />
					</Panel>
					<Panel className="min-h-48 flex-1" title="Output">
						<Output error={result.error} response={result.response} />
					</Panel>
				</div>
				<Panel className="min-h-0" title="Setup">
					<Config onChange={change} state={state} />
				</Panel>
			</div>
		</div>
	);
}
