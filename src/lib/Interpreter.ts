import { Tokenizer } from './Tokenizer';
import { asyncFilter, Awaitable } from './Utils/Util';

class Node {
	public coordinates: [number, number];
	public token: Tokenizer | null;
	public output: string | null;
	public constructor(coordinates: [number, number], token: Tokenizer | null) {
		this.output = null;
		this.token = token;
		this.coordinates = coordinates;
	}

	public toString() {
		const [start, end] = this.coordinates;
		return `${this.token} at ${start}-${end}`;
	}

	public toJSON() {
		return {
			output: this.output,
			token: this.token,
			coordinates: this.coordinates,
		};
	}
}

const buildNodeTree = (message: string): Node[] => {
	const nodes: Node[] = [];
	let previous = '';
	const starts: number[] = [];

	for (let i = 0; i < message.length; i++) {
		const ch = message[i];
		if (ch === '{' && previous !== '\\') {
			starts.push(i);
		}
		if (ch === '}' && previous !== '\\') {
			if (!starts.length) {
				continue;
			}
			const coords: [number, number] = [starts.pop()!, i];
			const n = new Node(coords, null);
			nodes.push(n);
		}
		previous = ch;
	}
	return nodes;
};

class Response {
	public body: string | null;
	public variables: { [key: string]: Adapter };
	private actions: { [key: string]: unknown };
	private keyValues: { [key: string]: unknown };

	public constructor(
		variables: { [key: string]: Adapter } | null = null,
		keyValues: { [key: string]: unknown } | null = null,
	) {
		this.body = null;
		this.actions = {};
		this.variables = variables ?? {};
		this.keyValues = keyValues ?? {};
	}

	public toJSON() {
		return {
			body: this.body,
			actions: this.actions,
			variables: this.variables,
			extraKwargs: this.keyValues,
		};
	}
}

export class Context {
	public token: Tokenizer;
	public response: Response;
	private originalMessage: string;
	private interpreter: Interpreter;

	public constructor(token: Tokenizer, res: Response, interpreter: Interpreter, originalMessage: string) {
		this.token = token;
		this.originalMessage = originalMessage;
		this.interpreter = interpreter;
		this.response = res;
	}

	public toJSON() {
		return {
			token: this.token,
			originalMessage: this.originalMessage,
			interpreter: this.interpreter,
			response: this.response,
		};
	}
}

export class Interpreter {
	protected parsers: Parser[];
	public constructor(...parsers: Parser[]) {
		this.parsers = parsers;
	}

	public async parse(
		message: string,
		seedVariables: { [key: string]: Adapter } = {},
		charlimit: number | null = null,
		tokenLimit = 2000,
		dotParameter = false,
		keyValues: { [key: string]: unknown } = {},
	): Promise<Response> {
		const response = new Response(seedVariables, keyValues);
		const nodeOrderedList = buildNodeTree(message);
		const output = await this.solve(message, nodeOrderedList, response, charlimit, tokenLimit, dotParameter);
		return this.returnResponse(response, output);
	}

	protected getAcceptors(ctx: Context) {
		const acceptors = asyncFilter(this.parsers, (p) => p.willAccept(ctx));
		return acceptors;
	}

	private getContext(
		node: Node,
		final: string,
		response: Response,
		originalMessage: string,
		tokenLimit: number,
		dotParameter: boolean,
	) {
		const [start, end] = node.coordinates;
		node.token = new Tokenizer(final.slice(start, end + 1), tokenLimit, dotParameter);
		return new Context(node.token, response, this, originalMessage);
	}

	private async processTokens(ctx: Context, node: Node) {
		const acceptors = await this.getAcceptors(ctx);
		for (const b of acceptors) {
			const value = await b.process(ctx);
			if (value !== null) {
				node.output = value;
				return value;
			}
		}
		return null;
	}

	private checkWorkload(charlimit: number | null, totalWork: number, output: string) {
		if (!charlimit) {
			return;
		}
		totalWork += output.length;
		if (totalWork > charlimit) {
			throw new Error(
				'The TSE interpreter had its workload exceeded. The total characters ' +
					`attempted were ${totalWork}/${charlimit}`,
			);
		}
		return totalWork;
	}

	private textDeform(start: number, end: number, final: string, output: string): [string, number] {
		const messageSliceLen = end + 1 - start;
		const replacementLen = output.length;
		const differential = replacementLen - messageSliceLen;
		final = final.slice(0, start) + output + final.slice(end + 1);
		return [final, differential];
	}

	private translateNodes(nodeOrderedList: Node[], index: number, start: number, differential: number) {
		for (const futureN of nodeOrderedList.slice(index + 1)) {
			let newStart: number;
			let newEnd: number;
			const [fStart, fEnd] = futureN.coordinates;
			if (fStart > start) {
				newStart = fStart + differential;
			} else {
				newStart = fStart;
			}

			if (fEnd > start) {
				newEnd = fEnd + differential;
			} else {
				newEnd = fEnd;
			}
			futureN.coordinates = [newStart, newEnd];
		}
	}

	private async solve(
		message: string,
		nodeOrderedList: Node[],
		response: Response,
		charlimit: number | null,
		tokenLimit = 2000,
		dotParameter = false,
	) {
		let final = message;
		let totalWork = 0;
		for (let index = 0; index < nodeOrderedList.length; index++) {
			const node = nodeOrderedList[index];
			const [start, end] = node.coordinates;
			const ctx = this.getContext(node, final, response, message, tokenLimit, dotParameter);
			let output;
			try {
				output = await this.processTokens(ctx, node);
			} catch (error) {
				return `${final.slice(start)} ${error}`;
			}
			if (output === null) {
				continue;
			}
			totalWork = this.checkWorkload(charlimit, totalWork, output)!;
			const [fMessage, differential] = this.textDeform(start, end, final, output);
			final = fMessage;
			this.translateNodes(nodeOrderedList, index, start, differential);
		}
		return final;
	}

	private returnResponse(response: Response, output: string): Response {
		if (response.body === null) response.body = output.trim();
		else response.body = response.body.trim();

		return response;
	}
}

export interface Adapter {
	getValue(ctx: Tokenizer): string | null;
}
export interface Parser {
	willAccept(ctx: Context): Awaitable<boolean>;
	process(ctx: Context): Awaitable<string | null>;
}
