import { describe, expect, test } from 'bun:test';

import { Interpreter, TemplateError } from 'tagscript';

import { EmbedParser } from '../../src';

const ts = new Interpreter(new EmbedParser());
describe('EmbedParser', () => {
	test('GIVEN a JSON in embed tag THEN parse the JSON correctly', async () => {
		const text = '{embed:{"title":"Hello!", "description":"This is a test embed."}}';

		expect((await ts.run(text)).actions.embed).toStrictEqual({
			title: 'Hello!',
			description: 'This is a test embed.',
		});
	});

	test('GIVEN any property in embed tag parameter THEN give embed with that property', async () => {
		const tText = '{embed(title):Rules}';

		expect((await ts.run(tText)).actions.embed).toStrictEqual({
			title: 'Rules',
		});

		const dText = '{embed(description):Follow these rules to ensure a good experience in our server!}';

		expect((await ts.run(dText)).actions.embed).toStrictEqual({
			description: 'Follow these rules to ensure a good experience in our server!',
		});

		const fText = '{embed(field):Rule 1|Respect everyone you speak to.|false}';

		expect((await ts.run(fText)).actions.embed).toStrictEqual({
			fields: [
				{
					name: 'Rule 1',
					value: 'Respect everyone you speak to.',
					inline: false,
				},
			],
		});

		const f2Text = '{embed(field):Rule 1}';

		expect((await ts.run(f2Text)).actions.embed).toBeUndefined();

		const f3Text = "{embed(field):Rule 2|Don't spam.|true}";

		expect((await ts.run(fText + f3Text)).actions.embed).toStrictEqual({
			fields: [
				{
					name: 'Rule 1',
					value: 'Respect everyone you speak to.',
					inline: false,
				},
				{
					name: 'Rule 2',
					value: "Don't spam.",
					inline: true,
				},
			],
		});

		expect((await ts.run(tText + f3Text)).actions.embed).toStrictEqual({
			title: 'Rules',
			fields: [
				{
					name: 'Rule 2',
					value: "Don't spam.",
					inline: true,
				},
			],
		});
	});

	test('GIVEN image or thumbnail in object form in embed tag parameter THEN give embed with that property', async () => {
		const iText = '{embed(image):{"url":"https://example.com/image.png"}}';

		expect((await ts.run(iText)).actions.embed).toStrictEqual({
			image: {
				url: 'https://example.com/image.png',
			},
		});

		const tText = '{embed(thumbnail):{"url":"https://example.com/image.png"}}';

		expect((await ts.run(tText)).actions.embed).toStrictEqual({
			thumbnail: {
				url: 'https://example.com/image.png',
			},
		});

		const aText = '{embed(author):{"name":"Mahir", "icon_url":"https://example.com/image.png"}}';

		expect((await ts.run(aText)).actions.embed).toStrictEqual({
			author: { name: 'Mahir', icon_url: 'https://example.com/image.png' },
		});
	});

	test('GIVEN image or thumbnail as a bare url THEN wrap it in an object', async () => {
		const iText = '{embed(image):https://example.com/image.png}';

		expect((await ts.run(iText)).actions.embed).toStrictEqual({
			image: {
				url: 'https://example.com/image.png',
			},
		});

		const tText = '{embed(thumbnail):https://example.com/image.png}';

		expect((await ts.run(tText)).actions.embed).toStrictEqual({
			thumbnail: {
				url: 'https://example.com/image.png',
			},
		});
	});

	test('GIVEN author or footer as text THEN build the object Discord expects', async () => {
		const aText = '{embed(author):Mahir}';

		expect((await ts.run(aText)).actions.embed).toStrictEqual({
			author: { name: 'Mahir' },
		});

		const aFullText = '{embed(author):Mahir|https://example.com|https://example.com/icon.png}';

		expect((await ts.run(aFullText)).actions.embed).toStrictEqual({
			author: { name: 'Mahir', url: 'https://example.com', icon_url: 'https://example.com/icon.png' },
		});

		const fText = '{embed(footer):Posted by the mods|https://example.com/icon.png}';

		expect((await ts.run(fText)).actions.embed).toStrictEqual({
			footer: { text: 'Posted by the mods', icon_url: 'https://example.com/icon.png' },
		});
	});

	test('GIVEN an author or footer without the required part THEN set nothing', async () => {
		expect((await ts.run('{embed(author):}')).actions.embed).toBeUndefined();
		expect((await ts.run('{embed(footer):}')).actions.embed).toBeUndefined();
	});

	test('GIVEN color in JSON THEN resolve it to hex color', async () => {
		const text = '{embed:{"color":"0x00ff00"}}';

		expect((await ts.run(text)).actions.embed).toStrictEqual({
			color: 65_280,
		});
	});

	test.each(['Red', '#ed4245', 0xed4245])('GIVEN color %j in property THEN resolve it to hex color', async (color) => {
		expect((await ts.run(`{embed(color):${color}}`)).actions.embed).toStrictEqual({
			color: 0xed4245,
		});
	});

	test('GIVEN malformed JSON THEN report it as a TemplateError instead of leaking the SyntaxError', async () => {
		const response = await ts.run('{embed:{"title": }}');

		expect(response.errors).toHaveLength(1);
		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect(response.errors[0].message).toBe('embed was given something that is not valid JSON');
		expect(response.body).not.toContain('JSON.parse');
		expect(response.body).not.toContain('position');
	});

	test('GIVEN malformed JSON THEN keep rendering the rest of the template', async () => {
		expect((await ts.run('a {embed:{"title": }} b')).body).toBe('a embed was given something that is not valid JSON b');
	});
});
