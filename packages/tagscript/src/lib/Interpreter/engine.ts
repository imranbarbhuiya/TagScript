import { Node } from './Node';

import { WorkloadExceededError } from '../Errors';

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
