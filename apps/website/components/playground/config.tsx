'use client';

import { Trash2 } from 'lucide-react';
import { ParenType } from 'tagscript';

import { cn } from '@/lib/cn';
import { PARSERS, TRANSFORMERS } from '@/lib/playground/registry';

import type { TransformerKind } from '@/lib/playground/registry';
import type { PlaygroundState, Variable } from '@/lib/playground/state';

const field =
	'border-fd-border bg-fd-background focus-visible:ring-fd-ring rounded border px-2 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none';

/**
 *
 * Every knob a render takes, in one column.
 *
 * Turning a parser off and watching its tag go grey is the quickest way to see that parsers are
 * registered rather than built in, which the docs otherwise have to assert.
 *
 * @param props - The current state and how to change it.
 * @returns
 */
interface ConfigProps {
	readonly onChange: (next: Partial<PlaygroundState>) => void;
	readonly state: PlaygroundState;
}

export function Config({ state, onChange }: ConfigProps) {
	const toggle = (id: string) =>
		onChange({
			parsers: state.parsers.includes(id) ? state.parsers.filter((entry) => entry !== id) : [...state.parsers, id],
		});

	const setVariable = (index: number, next: Partial<Variable>) =>
		onChange({
			variables: state.variables.map((variable, at) => (at === index ? { ...variable, ...next } : variable)),
		});

	return (
		<div className="flex flex-col gap-5 text-xs">
			<div className="flex flex-col gap-2">
				<h3 className="font-medium text-fd-muted-foreground">Seeded variables</h3>
				{state.variables.map((variable, index) => (
					<div className="flex flex-col gap-1" key={index}>
						<div className="flex gap-1">
							<input
								aria-label="Variable name"
								className={cn(field, 'w-24 font-mono')}
								onChange={(event) => setVariable(index, { name: event.target.value })}
								placeholder="name"
								value={variable.name}
							/>
							<select
								aria-label="Variable kind"
								className={cn(field, 'w-20')}
								onChange={(event) => setVariable(index, { kind: event.target.value as TransformerKind })}
								value={variable.kind}
							>
								{Object.entries(TRANSFORMERS).map(([kind, entry]) => (
									<option key={kind} value={kind}>
										{entry.label}
									</option>
								))}
							</select>
							<input
								aria-label="Variable value"
								className={cn(field, 'min-w-0 flex-1 font-mono')}
								onChange={(event) => setVariable(index, { value: event.target.value })}
								placeholder="value"
								value={variable.value}
							/>
							<button
								aria-label={`Remove ${variable.name || 'variable'}`}
								className="shrink-0 px-1 text-fd-muted-foreground hover:text-fd-foreground"
								onClick={() => onChange({ variables: state.variables.filter((_, at) => at !== index) })}
								type="button"
							>
								<Trash2 className="size-3.5" />
							</button>
						</div>
						<p className="pl-1 text-fd-muted-foreground">{TRANSFORMERS[variable.kind].hint}</p>
					</div>
				))}
				<button
					className="self-start rounded border border-fd-border px-2 py-1 hover:bg-fd-accent"
					onClick={() => onChange({ variables: [...state.variables, { name: '', kind: 'string', value: '' }] })}
					type="button"
				>
					Add a variable
				</button>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="font-medium text-fd-muted-foreground">Limits</h3>
				<label className="flex items-center justify-between gap-2">
					<span>Character limit</span>
					<input
						className={cn(field, 'w-24')}
						inputMode="numeric"
						onChange={(event) => onChange({ charLimit: event.target.value })}
						placeholder="none"
						value={state.charLimit}
					/>
				</label>
				<label className="flex items-center justify-between gap-2">
					<span>Tag limit</span>
					<input
						className={cn(field, 'w-24')}
						inputMode="numeric"
						onChange={(event) => onChange({ tagLimit: event.target.value })}
						value={state.tagLimit}
					/>
				</label>
				<label className="flex items-center justify-between gap-2">
					<span>Parameter syntax</span>
					<select
						className={cn(field, 'w-24')}
						onChange={(event) => onChange({ parenType: Number(event.target.value) })}
						value={state.parenType}
					>
						<option value={ParenType.Both}>Both</option>
						<option value={ParenType.Parenthesis}>(x)</option>
						<option value={ParenType.Dot}>.x</option>
					</select>
				</label>
			</div>
			{(['core', 'discord'] as const).map((group) => (
				<div className="flex flex-col gap-1" key={group}>
					<h3 className="font-medium text-fd-muted-foreground">{group === 'core' ? 'Parsers' : 'Discord plugin'}</h3>
					{PARSERS.filter((parser) => parser.group === group).map((parser) => (
						<label
							className="flex cursor-pointer items-baseline gap-2 rounded px-1 py-0.5 hover:bg-fd-accent"
							key={parser.id}
						>
							<input
								checked={state.parsers.includes(parser.id)}
								className="accent-fd-primary"
								onChange={() => toggle(parser.id)}
								type="checkbox"
							/>
							<span>{parser.label}</span>
							<span className="ml-auto truncate font-mono text-fd-muted-foreground">
								{parser.tags.slice(0, 2).join(', ')}
							</span>
						</label>
					))}
				</div>
			))}
		</div>
	);
}
