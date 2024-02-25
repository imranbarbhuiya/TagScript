import { Context } from './Context';
import { Lexer, ParenType } from './Lexer';
import { Node } from './Node';
import { Response } from './Response';

import { asyncFilter } from '../Utils/Util';

import type { ITransformer, IParser, IKeyValues } from '../interfaces';

/**
 *
 * Function that finds all possible nodes in a string.
 *
 * @param message - The message to parse.
 * @returns A list of all possible text bracket tags.
 */
const buildNodeTree = (message: string): Node[] => {
	const nodes: Node[] = [];
	let previous = '';
	const starts: number[] = [];

	// eslint-disable-next-line unicorn/no-for-loop -- this is a string
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
 * The TagScript interpreter.
 */
export class Interpreter {
	protected parsers: IParser[];

	public constructor(...parsers: IParser[]) {
		this.parsers = parsers;
	}

	/**
	 * Add more parsers
	 *
	 * @param parsers - The parsers to add.
	 */
	public addParsers(...parsers: IParser[]) {
		this.parsers = [...this.parsers, ...parsers];
	}

	/**
	 * Set new parsers
	 *
	 * @param parsers - The parsers to set.
	 */
	public setParsers(...parsers: IParser[]) {
		this.parsers = parsers;
	}

	/**
	 * Processes a given TagScript string.
	 *
	 * @param message - The TagScript string that to be processed.
	 * @param seedVariables - A object containing strings to transformer to provide context variables for processing.
	 * @param charLimit - The maximum characters to process.
	 * @param tagLimit - The maximum tags to process.
	 * @param parenType - Whether the parameter should be followed after a "." or use parenthesis or both.
	 * @param keyValues - Additional key value pairs that may be used by parsers during parsing.
	 * @returns - {@link Response} class containing the raw string, processed body, actions and variables.
	 */
	public async run(
		message: string,
		seedVariables: { [key: string]: ITransformer } = {},
		charLimit: number | null = null,
		tagLimit = 2_000,
		parenType = ParenType.Both,
		keyValues: IKeyValues = {}
	): Promise<Response> {
		const response = new Response(seedVariables, keyValues);
		const nodeOrderedList = buildNodeTree(message);
		const output = await this.solve(message, nodeOrderedList, response, charLimit, tagLimit, parenType);
		return response.setValues(output, message);
	}

	protected getAcceptors(ctx: Context) {
		return asyncFilter(this.parsers, (parser) => parser.willAccept(ctx));
	}

	private getContext(node: Node, final: string, response: Response, originalMessage: string, tagLimit: number, parenType = ParenType.Both) {
		const [start, end] = node.coordinates;
		node.tag = new Lexer(final.slice(start, end + 1), tagLimit, parenType);
		return new Context(node.tag, response, this, originalMessage);
	}

	private async processTags(ctx: Context, node: Node) {
		const acceptors = await this.getAcceptors(ctx);
		for (const b of acceptors) {
			const value = await b.parse(ctx);
			if (value !== null) {
				node.output = value;
				return value;
			}
		}

		return null;
	}

	private checkWorkload(charLimit: number | null, totalWork: number, output: string) {
		if (!charLimit) return;

		const currentWork = totalWork + output.length;
		if (currentWork > charLimit)
			throw new Error(`The TS interpreter had its workload exceeded. The total characters attempted were ${currentWork}/${charLimit}`);

		return currentWork;
	}

	private textDeform(start: number, end: number, final: string, output: string): [string, number] {
		const messageSliceLen = end + 1 - start;
		const replacementLen = output.length;
		const differential = replacementLen - messageSliceLen;
		const currentFinal = final.slice(0, start) + output + final.slice(end + 1);
		return [currentFinal, differential];
	}

	private translateNodes(nodeOrderedList: Node[], index: number, start: number, differential: number) {
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
	}

	private async solve(
		message: string,
		nodeOrderedList: Node[],
		response: Response,
		charLimit: number | null,
		tagLimit = 2_000,
		parenType = ParenType.Both
	) {
		let final = message;
		let totalWork = 0;
		for (let index = 0; index < nodeOrderedList.length; index++) {
			const node = nodeOrderedList[index];
			const [start, end] = node.coordinates;
			const ctx = this.getContext(node, final, response, message, tagLimit, parenType);
			let output;
			try {
				output = await this.processTags(ctx, node);
			} catch (error) {
				return `${final.slice(0, start)} ${(error as Error).message}`;
			}

			if (output === null) continue;

			totalWork = this.checkWorkload(charLimit, totalWork, output)!;
			const [fMessage, differential] = this.textDeform(start, end, final, output);
			final = fMessage;
			this.translateNodes(nodeOrderedList, index, start, differential);
		}

		return final;
	}
}
