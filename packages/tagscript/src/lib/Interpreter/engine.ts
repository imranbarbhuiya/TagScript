import { Node } from './Node';

import { WorkloadExceededError } from '../Errors';

import type { OutputSpan } from './Response';

/**
 *
 * Finds every bracketed tag in a string, innermost first.
 *
 * @param message - The message to parse.
 * @returns A list of all possible text bracket tags.
 */
export const buildNodeTree = (message: string): Node[] => {
	const nodes: Node[] = [];
	let previous = '';
	const starts: number[] = [];

	for (let index = 0; index < message.length; index++) {
		const ch = message[index];
		if (ch === '{' && previous !== '\\') starts.push(index);

		if (ch === '}' && previous !== '\\') {
			if (!starts.length) continue;

			const coords: [number, number] = [starts.pop()!, index];
			const node = new Node(coords, null);
			nodes.push(node);
		}

		previous = ch;
	}

	return nodes;
};

/**
 *
 * Adds `output` to the running total and checks it against the limit.
 *
 * @param charLimit - The maximum number of characters a render may produce, or `null` for no limit.
 * @param totalWork - The number of characters produced so far.
 * @param output - The output about to be spliced in.
 * @returns The new running total.
 * @throws A {@link WorkloadExceededError} when the new total is over `charLimit`.
 */
export const checkWorkload = (charLimit: number | null, totalWork: number, output: string): number => {
	const currentWork = totalWork + output.length;
	if (charLimit !== null && currentWork > charLimit) throw new WorkloadExceededError(charLimit, currentWork);

	return currentWork;
};

/**
 *
 * Replaces the slice between `start` and `end` with `output`.
 *
 * @param start - The index the tag starts at.
 * @param end - The index the tag ends at.
 * @param final - The message as rendered so far.
 * @param output - The text to splice in.
 * @returns The new message, and by how much the text after the tag shifted.
 */
export const textDeform = (start: number, end: number, final: string, output: string): [string, number] => {
	const messageSliceLen = end + 1 - start;
	const replacementLen = output.length;
	const differential = replacementLen - messageSliceLen;
	const currentFinal = final.slice(0, start) + output + final.slice(end + 1);
	return [currentFinal, differential];
};

/**
 *
 * Shifts the coordinates of every node after `index` by `differential`, so they still point at
 * their own text after an earlier tag was replaced with something of a different length.
 *
 * @param nodeOrderedList - Every node in the message.
 * @param index - The index of the node that was just replaced.
 * @param start - The index the replaced tag started at.
 * @param differential - By how much the text after the tag shifted.
 */
export const translateNodes = (nodeOrderedList: Node[], index: number, start: number, differential: number): void => {
	for (const futureN of nodeOrderedList.slice(index + 1)) {
		let newStart: number;
		let newEnd: number;
		const [fStart, fEnd] = futureN.coordinates;
		if (fStart > start) newStart = fStart + differential;
		else newStart = fStart;

		if (fEnd > start) newEnd = fEnd + differential;
		else newEnd = fEnd;

		futureN.coordinates = [newStart, newEnd];
	}
};

/**
 *
 * Records the range a tag's output now occupies, and keeps every range already recorded pointing at
 * its own text.
 *
 * Tags run innermost first, so by the time an outer tag is replaced its inner tags' ranges sit
 * inside the text about to be overwritten. A nested tag in the payload is folded into the new range,
 * because a parser generally passes its payload through and that text is still in there. A nested
 * tag in the parameter is not, because a parameter is read rather than emitted, and treating
 * `\{if(\{user\}==yes):**sure**\}` as though the branch came from the user would be wrong.
 *
 * That is a rule about where the text came from, not proof of what a parser did with it. A parser
 * that writes its own parameter into its output is the case this gets wrong, so anything using
 * these ranges for safety should treat such a parser as untrusted by name.
 *
 * @param spans - The ranges recorded so far, modified in place.
 * @param start - Where the tag started.
 * @param end - Where the tag ended, inclusive.
 * @param output - What replaced it.
 * @param declaration - The tag that produced it.
 * @param payload - Where the tag's payload sat, so nested tags inside it can be told from nested
 * tags in the parameter.
 */
export const recordSpan = (
	spans: OutputSpan[],
	start: number,
	end: number,
	output: string,
	declaration: string | null,
	payload: { start: number; end: number } | null = null,
): void => {
	const differential = output.length - (end + 1 - start);
	const nested: (string | null)[] = [];

	for (let index = spans.length - 1; index >= 0; index--) {
		const span = spans[index];
		if (span.end <= start) continue;
		if (span.start > end) {
			span.start += differential;
			span.end += differential;
			continue;
		}

		if (payload && span.start >= payload.start && span.end <= payload.end) nested.unshift(...span.tags);
		spans.splice(index, 1);
	}

	if (output.length) spans.push({ start, end: start + output.length, tags: [declaration, ...nested] });
};
