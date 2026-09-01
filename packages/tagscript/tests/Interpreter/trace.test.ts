import { describe, expect, test } from 'bun:test';

import { Interpreter, StringFormatParser, StringTransformer, StrictVarsParser } from '../../src';

const ts = new Interpreter(new StrictVarsParser(), new StringFormatParser());
const seedVariables = { name: new StringTransformer('ada') };

describe('Response#trace', () => {
	test('GIVEN trace is off THEN record nothing', async () => {
		const response = await ts.run('Hi {upper:x}', { seedVariables });
		expect(response.trace).toBeNull();
	});

	test('GIVEN trace is on THEN record one step per tag, innermost first', async () => {
		const response = await ts.run('Hi {upper:{name}}, {unknown} bye', { seedVariables, trace: true });
		expect(response.trace?.map((step) => [step.tag, step.output])).toStrictEqual([
			['{name}', 'ada'],
			['{upper:ada}', 'ADA'],
			['{unknown}', null],
		]);
	});

	test('GIVEN trace is on THEN each step keeps the body as it stood after it', async () => {
		const response = await ts.run('Hi {upper:{name}}', { seedVariables, trace: true });
		expect(response.trace?.map((step) => step.body)).toStrictEqual(['Hi {upper:ada}', 'Hi ADA']);
		expect(response.body).toBe('Hi ADA');
	});

	test('GIVEN a tag that errors THEN the step carries the error', async () => {
		const throwing = new Interpreter({
			willAccept: () => true,
			parse: () => {
				throw new Error('boom');
			},
		});
		const response = await throwing.run('{bad}', { trace: true });
		expect(response.trace).toHaveLength(1);
		expect(response.trace?.[0].error).toBe(response.errors[0]);
	});
});
