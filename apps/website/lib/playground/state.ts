import { ParenType } from 'tagscript';

import { DEFAULT_PARSERS } from './registry';

import type { TransformerKind } from './registry';

/**
 * One value the host application would have seeded.
 */
export interface Variable {
	kind: TransformerKind;
	name: string;
	value: string;
}

/**
 * Everything a shared link has to carry.
 */
export interface PlaygroundState {
	charLimit: string;
	parenType: ParenType;
	parsers: string[];
	tagLimit: string;
	template: string;
	variables: Variable[];
}

export const INITIAL: PlaygroundState = {
	template: `{=(greeting):Welcome}
{greeting}, {upper:{name}}!

You are the {ord:{visit}} visitor today.
{if({visit}>1):Good to see you again.|Nice to meet you.}

A random pick: {random:tea,coffee,water}`,
	parsers: DEFAULT_PARSERS,
	variables: [
		{ name: 'name', kind: 'string', value: 'ada' },
		{ name: 'visit', kind: 'integer', value: '3' },
	],
	charLimit: '',
	tagLimit: '2000',
	parenType: ParenType.Both,
};

/**
 *
 * Packs the state into something that survives being pasted into a chat window.
 *
 * Base64 of the JSON, which is not small but needs no dependency and no server. Nothing is stored
 * anywhere; the link is the storage.
 *
 * @param state - What to share.
 * @returns
 */
export const encodeState = (state: PlaygroundState): string => {
	try {
		return btoa(String.fromCodePoint(...new TextEncoder().encode(JSON.stringify(state))));
	} catch {
		return '';
	}
};

/**
 *
 * Reads state back out of a link, falling back to the example when it cannot.
 *
 * @param hash - The fragment, with or without its leading `#`.
 * @returns
 */
export const decodeState = (hash: string): PlaygroundState => {
	const raw = hash.startsWith('#') ? hash.slice(1) : hash;
	if (!raw) return INITIAL;

	try {
		const bytes = Uint8Array.from(atob(raw), (char) => char.codePointAt(0)!);
		const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<PlaygroundState>;
		return {
			...INITIAL,
			...parsed,
			parsers: Array.isArray(parsed.parsers) ? parsed.parsers : INITIAL.parsers,
			variables: Array.isArray(parsed.variables) ? parsed.variables : INITIAL.variables,
		};
	} catch {
		return INITIAL;
	}
};
