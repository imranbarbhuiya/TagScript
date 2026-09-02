'use client';

import { TokenKind, tokenize } from 'tagscript/language';

import { cn } from '@/lib/cn';

import type { TagDefinition, ParenType } from 'tagscript';

/**
 * How each part of a tag is coloured. These follow the same names the grammar uses for a static
 * code block in the docs, so a template reads the same in both places.
 */
const COLOURS: Record<TokenKind, string> = {
	[TokenKind.Text]: '',
	[TokenKind.TagStart]: 'text-teal-600 dark:text-teal-300',
	[TokenKind.TagEnd]: 'text-teal-600 dark:text-teal-300',
	[TokenKind.Declaration]: 'text-blue-600 italic dark:text-blue-300',
	[TokenKind.ParameterStart]: 'text-fd-muted-foreground',
	[TokenKind.ParameterEnd]: 'text-fd-muted-foreground',
	[TokenKind.Parameter]: 'text-red-600 italic dark:text-red-300',
	[TokenKind.Colon]: 'text-teal-600 dark:text-teal-300',
	[TokenKind.Payload]: 'text-green-700 dark:text-green-300',
	[TokenKind.Escape]: 'text-fd-muted-foreground',
};

/**
 * The range to mark as picked, so choosing a row in the structure shows which text it means.
 */
interface Selection {
	readonly end: number;
	readonly start: number;
}

interface HighlightProps {
	readonly onSelect?: (offset: number) => void;
	readonly parenType: ParenType;
	readonly selection: Selection | null;
	readonly tagLimit: number;
	readonly tags: TagDefinition[] | null;
	readonly template: string;
}

/**
 *
 * Colours a template using the same lexer a render uses.
 *
 * This is not a grammar approximating the language. It is the language, so a tag that will not be
 * handled shows as one while it is being typed rather than as braces in someone's output later.
 */
export function Highlight({ template, tags, parenType, tagLimit, selection, onSelect }: HighlightProps) {
	const tokens = tokenize(template, { tags: tags ?? undefined, parenType, tagLimit });

	return (
		<>
			{tokens.map((token) => {
				const text = template.slice(token.start, token.end);
				const unknown = token.known === false;
				const selected = selection !== null && token.start >= selection.start && token.end <= selection.end;

				return (
					<span
						className={cn(
							COLOURS[token.kind],
							unknown && 'text-fd-muted-foreground underline decoration-fd-muted-foreground/60 decoration-wavy',
							selected && 'rounded-xs bg-fd-primary/20',
							onSelect && 'cursor-pointer',
						)}
						key={`${token.start}-${token.kind}`}
						onClick={onSelect && (() => onSelect(token.start))}
						title={unknown ? 'No registered parser answers to this name' : undefined}
					>
						{text}
					</span>
				);
			})}
			{'\n'}
		</>
	);
}
