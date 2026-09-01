import { describe, expect, test } from 'bun:test';

import {
	Interpreter,
	IfStatementParser,
	StringFormatParser,
	StringTransformer,
	StopParser,
	StrictVarsParser,
} from '../../src';

import type { Response } from '../../src';

const ts = new Interpreter(new StrictVarsParser(), new StringFormatParser(), new IfStatementParser());
const seedVariables = { name: new StringTransformer('Ada'), city: new StringTransformer('Paris') };

const render = async (template: string) => {
	const response = await ts.run(template, { seedVariables, spans: true });
	return { response, body: response.body! };
};

/**
 *
 * Reads every recorded range back out of the body it describes.
 *
 * A range that does not slice out the text its tag produced is worse than no range at all, since
 * anything acting on one would be acting on the wrong characters.
 *
 * @param body - The rendered body.
 * @param response - The response the ranges came from.
 * @returns
 */
const sliceSpans = (body: string, response: Response) =>
	response.spans!.map((span) => body.slice(span.start, span.end));

describe('Response#spans', () => {
	test('GIVEN spans are off THEN record nothing, and say so with null rather than an empty list', async () => {
		const response = await ts.run('Hi {name}', { seedVariables });
		expect(response.spans).toBeNull();
	});

	test('GIVEN a template with no tags THEN record nothing', async () => {
		const { response } = await render('plain text, no tags at all');
		expect(response.spans).toStrictEqual([]);
	});

	test('GIVEN two tags THEN each range slices out its own output', async () => {
		const { response, body } = await render('Welcome **{name}** to {city}!');
		expect(body).toBe('Welcome **Ada** to Paris!');
		expect(sliceSpans(body, response)).toStrictEqual(['Ada', 'Paris']);
		expect(response.spans!.map((span) => span.tags)).toStrictEqual([['name'], ['city']]);
	});

	test('GIVEN adjacent tags THEN ranges do not overlap', async () => {
		const { response, body } = await render('{name}{city}');
		expect(body).toBe('AdaParis');
		expect(response.spans).toStrictEqual([
			{ start: 0, end: 3, tags: ['name'] },
			{ start: 3, end: 8, tags: ['city'] },
		]);
	});

	test('GIVEN a tag nested in a payload THEN one range carries both tags, outermost first', async () => {
		const { response, body } = await render('Thanks {upper:{name}}, bye.');
		expect(body).toBe('Thanks ADA, bye.');
		expect(sliceSpans(body, response)).toStrictEqual(['ADA']);
		expect(response.spans![0].tags).toStrictEqual(['upper', 'name']);
	});

	test('GIVEN a tag nested in a parameter THEN it is not carried, because it was read and not written', async () => {
		const { response, body } = await render('{if({name}==Ada):you match|you do not}');
		expect(body).toBe('you match');
		expect(response.spans![0].tags).toStrictEqual(['if']);
	});

	test('GIVEN leading whitespace that the trim removes THEN ranges still line up', async () => {
		const { response, body } = await render('   {name} trailing   ');
		expect(body).toBe('Ada trailing');
		expect(sliceSpans(body, response)).toStrictEqual(['Ada']);
		expect(response.spans![0].start).toBe(0);
	});

	test('GIVEN a tag that renders nothing THEN record no range for it', async () => {
		const { response } = await render('{if(1==2):shown}');
		expect(response.spans).toStrictEqual([]);
	});

	test('GIVEN a tag nothing handles THEN record no range, since the braces are the author text', async () => {
		const { response, body } = await render('Hi {naem}');
		expect(body).toBe('Hi {naem}');
		expect(response.spans).toStrictEqual([]);
	});

	test('GIVEN a stop tag THEN drop ranges the stop cut away', async () => {
		const stopping = new Interpreter(new StrictVarsParser(), new StopParser());
		const response = await stopping.run('{name} {stop(1==1):halted} {city}', { seedVariables, spans: true });
		expect(response.body).toBe('Ada  halted');
		expect(response.spans!.every((span) => span.end <= response.body!.length)).toBe(true);
	});
});
