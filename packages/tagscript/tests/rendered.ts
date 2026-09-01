import type { Response } from '../src';

/**
 *
 * Narrows a response to what a render produced, leaving out the diagnostic fields.
 *
 * Tests here compare whole responses. `spans` and `trace` describe how a render happened rather
 * than what it produced, and asserting them by accident would mean every test that renders a tag
 * has to restate the offsets of its own output.
 *
 * @param response - The response to narrow.
 * @returns
 */
export const rendered = (response: Response) => ({
	body: response.body,
	raw: response.raw,
	actions: response.actions,
	variables: response.variables,
	keyValues: response.keyValues,
	errors: response.errors,
});
