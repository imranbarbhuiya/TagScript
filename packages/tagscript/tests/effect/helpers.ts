import * as Effect from 'effect/Effect';

import type { Response } from '../../src/effect';

/**
 *
 * Runs an effect and returns its value.
 *
 * These three helpers are what `@effect/vitest` would have given us. An `it.effect` wrapper was
 * tried too and dropped, because every test here reads better as `await body(...)` than as one
 * effect with the assertions piped through it.
 *
 * The effect may declare errors. A failure rejects, which fails the test, and that is what you want
 * for a render that was not supposed to fail. Use {@link outcome} when the failure is the point.
 *
 * @param effect - The effect to run. It must need no services, so a test provides its own layers.
 * @returns
 */
export const run = async <A, E>(effect: Effect.Effect<A, E, never>) =>
	Effect.runPromise(effect as Effect.Effect<A, never, never>);

/**
 *
 * Runs a render and returns its body, which is what most assertions want.
 *
 * @param effect - The render to run.
 * @returns
 */
export const body = async <E>(effect: Effect.Effect<Response, E, never>) => (await run(effect)).body;

/**
 *
 * Runs an effect and reports how it ended, so a test can assert on a failure without the promise
 * rejecting.
 *
 * @param effect - The effect to run.
 * @returns The value under `value`, or the error under `failure`.
 */
export const outcome = async <A, E>(effect: Effect.Effect<A, E, never>) =>
	Effect.runPromise(
		effect.pipe(
			Effect.map((value): { failure?: E; value?: A } => ({ value })),
			Effect.catch((error: E) => Effect.succeed({ failure: error })),
		),
	);
