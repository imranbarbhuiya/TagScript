import { Interpreter } from 'tagscript';

import { PARSERS, TRANSFORMERS } from './playground/registry';
import { encodeState, INITIAL } from './playground/state';

import type { Variable } from './playground/state';
import type { ITransformer } from 'tagscript';

/**
 * Every parser an example runs with. The loose variable parser answers to any name at all, which
 * would hide the point of examples showing an unknown tag left alone.
 */
export const EXAMPLE_PARSERS = PARSERS.filter((parser) => parser.id !== 'loose').map((parser) => parser.id);

/**
 *
 * Links to the playground with the example loaded and seeded.
 *
 * @param template - The template.
 * @param variables - What to seed.
 * @returns The link.
 */
export const playgroundLink = (template: string, variables: Variable[]) =>
	`/playground#${encodeState({ ...INITIAL, template, variables, parsers: EXAMPLE_PARSERS })}`;

/**
 *
 * Renders an example the way the playground would.
 *
 * @param template - The template.
 * @param variables - What to seed.
 * @returns The body.
 */
export const renderExample = async (template: string, variables: readonly Variable[]) => {
	const seedVariables: Record<string, ITransformer> = {};
	for (const variable of variables) seedVariables[variable.name] = TRANSFORMERS[variable.kind].build(variable.value);

	const parsers = PARSERS.filter((parser) => EXAMPLE_PARSERS.includes(parser.id)).map((parser) => parser.create());
	return (await new Interpreter(...parsers).run(template, { seedVariables })).body;
};
