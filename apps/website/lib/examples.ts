import type { TransformerKind } from './playground/registry';
import type { Variable } from './playground/state';
import type { Nodes, RootContent } from 'mdast';

/*
 * This module is loaded by the remark plugin, and so by `fumadocs-mdx` during `bun install`, before
 * any workspace package is built. It must not import `tagscript` at runtime.
 */

/**
 * One rendering of an example template, as an `output` fence after it declares it.
 */
export interface ExampleOutput {
	/**
	 * Whether this is one possible output rather than the output, as for anything random. An
	 * illustrative output is shown but not checked.
	 */
	illustrative: boolean;
	/**
	 * Where the fence starts in its file, for a test failure to point at.
	 */
	line: number | undefined;
	/**
	 * What the template renders to.
	 */
	value: string;
	/**
	 * What the host application seeded for this output.
	 */
	variables: Variable[];
}

/**
 * A `tagscript` fence and the `output` fences straight after it.
 */
export interface Example {
	outputs: ExampleOutput[];
	template: string;
}

const KINDS: Record<TransformerKind, true> = { string: true, integer: true, object: true, function: true };

const OPTION = /[\w:]+=(?:"[^"]*"|'[^']*'|\S*)|\S+/g;

/**
 *
 * Reads an `output` fence's options: `example` for an illustrative output, and `name=value` for
 * each seeded variable, with `name:kind=value` for anything other than text.
 *
 * @param meta - What follows `output` on the fence line.
 * @returns Whether the output is illustrative, and the variables.
 * @throws When an option is not one of those, so a typo fails the build instead of being ignored.
 * @example
 * ```ts
 * parseOutputMeta(`n:integer=5 u:object='{"name":"Parbez"}'`);
 * ```
 */
export const parseOutputMeta = (meta: string | null | undefined): { illustrative: boolean; variables: Variable[] } => {
	let illustrative = false;
	const variables: Variable[] = [];

	for (const [option] of (meta ?? '').matchAll(OPTION)) {
		const assignment = /^(\w+)(?::(\w+))?=(.*)$/s.exec(option);
		if (!assignment) {
			if (option !== 'example') throw new Error(`Unknown output option "${option}"`);
			illustrative = true;
			continue;
		}

		const [, name, kind = 'string', raw] = assignment;
		if (!(kind in KINDS)) throw new Error(`Unknown variable kind "${kind}" in "${option}"`);
		variables.push({ name, kind: kind as TransformerKind, value: raw.replace(/^(["'])(.*)\1$/s, '$2') });
	}

	return { illustrative, variables };
};

/**
 *
 * Describes an output's inputs for its title.
 *
 * @param variables - The seeded variables.
 * @returns Something like `args = Parbez`, or `args is empty`.
 */
export const describeVariables = (variables: readonly Variable[]): string =>
	variables.map(({ name, value }) => (value === '' ? `${name} is empty` : `${name} = ${value}`)).join(', ');

/**
 *
 * Finds the examples among a parent's children: each `tagscript` fence with the `output` fences
 * directly after it.
 *
 * @param children - The children to read.
 * @returns Each example, with where it starts and how many nodes it spans.
 * @throws When an `output` fence has no template before it.
 */
export const findExamples = (children: readonly RootContent[]): (Example & { count: number; index: number })[] => {
	const found: (Example & { count: number; index: number })[] = [];

	for (let index = 0; index < children.length; index++) {
		const node = children[index];
		if (node.type !== 'code') continue;
		if (node.lang === 'output') {
			throw new Error(`An output fence on line ${node.position?.start.line} has no tagscript fence before it`);
		}
		if (node.lang !== 'tagscript') continue;

		let end = index + 1;
		const outputs: ExampleOutput[] = [];
		for (; end < children.length; end++) {
			const next = children[end];
			if (next.type !== 'code' || next.lang !== 'output') break;
			outputs.push({ ...parseOutputMeta(next.meta), value: next.value, line: next.position?.start.line });
		}

		if (outputs.length) found.push({ template: node.value, outputs, index, count: end - index });
		index = end - 1;
	}

	return found;
};

/**
 *
 * Calls `visit` with the children of every node that has them, deepest first, so an example inside
 * a list or a tab is found too.
 *
 * @param node - Where to start.
 * @param visit - What to call.
 */
export const eachParent = (node: Nodes, visit: (children: RootContent[]) => void) => {
	if (!('children' in node)) return;
	for (const child of node.children) eachParent(child, visit);
	visit(node.children as RootContent[]);
};
