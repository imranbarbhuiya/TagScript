import { BaseParser, split, type Context, type IParser, type Awaitable } from 'tagscript';

import { resolveColor } from '../Utils';

import type { APIEmbed } from 'discord-api-types/v10';

/**
 *  An embed tag will send an embed in the tag response.
 *  There are two ways to use the embed tag, either by using properly
 *  formatted embed JSON or manually inputting
 *  the accepted embed properties.
 *
 * Embed can be used either by using a json string or by using the embed properties.
 *
 * @example
 *  Using JSON
 * ```yaml
 * {embed: json}
 * ```
 * @example
 * ```yaml
 * {embed: { "title": "Hello!", "description": "This is a test embed." } }
 * {embed: {
 *     "title": "Here's a random duck!",
 *     "image": { "url": "https://random-d.uk/api/randomimg" },
 *     "color": 15194415
 * } }
 * ```
 *  @example
 *  Using properties
 * ```yaml
 * {embed(property):value}
 * ```
 * @example
 * ```yaml
 * {embed(color): 0x37b2cb}
 * {embed(title): Rules}
 * {embed(description): Follow these rules to ensure a good experience in our server!}
 * {embed(field): Rule 1|Respect everyone you speak to.|false}
 * {embed(image): https://random-d.uk/api/randomimg}
 * {embed(footer): Posted by the mods|https://random-d.uk/api/randomimg}
 * ```
 *
 * The result is an {@link APIEmbed}, the shape Discord's API takes and the shape discord.js
 * {@link https://discord.js.org/docs/packages/discord.js/main/EmbedBuilder:Class#from | EmbedBuilder.from} reads.
 * @example
 * ```ts showLineNumbers
 * import { EmbedBuilder } from 'discord.js';
 * import { EmbedParser } from '@tagscript/plugin-discord';
 * import { Interpreter } from 'tagscript';
 *
 * const ts = new Interpreter(new EmbedParser());
 * const result = await ts.run('{embed: { "title": "Hello!", "description": "This is a test embed." }}');
 *
 * const embed = EmbedBuilder.from(result.actions.embed);
 * ```
 * @remarks
 * A template author picks both the property names and the values, so the result is typed `APIEmbed` for
 * convenience and is not validated. Check it before you send it.
 */
export class EmbedParser extends BaseParser implements IParser {
	public constructor() {
		super(['embed'], false, true);
	}

	public async parse(ctx: Context) {
		if (!ctx.tag.parameter) return this.returnEmbed(ctx, await this.parseEmbedJSON(ctx.tag.payload!));

		const payload = ctx.tag.payload!;

		if (payload.startsWith('{') && payload.endsWith('}'))
			return this.returnEmbed(ctx, { [ctx.tag.parameter]: JSON.parse(payload) as unknown });

		switch (ctx.tag.parameter) {
			case 'field': {
				const [name, value, inline] = split(payload);
				if (!name || !value) return '';
				return this.returnEmbed(ctx, { fields: [{ name, value, inline: inline === 'true' }] });
			}

			case 'color': {
				// This can return a string but it should be handled by the dev
				return this.returnEmbed(ctx, { color: resolveColor(payload) as number });
			}

			case 'image':
			case 'thumbnail': {
				return this.returnEmbed(ctx, { [ctx.tag.parameter]: { url: payload } });
			}

			case 'author': {
				const [name, url, iconUrl] = split(payload);
				if (!name) return '';
				return this.returnEmbed(ctx, {
					author: { name, ...(url && { url }), ...(iconUrl && { icon_url: iconUrl }) },
				});
			}

			case 'footer': {
				const [text, iconUrl] = split(payload);
				if (!text) return '';
				return this.returnEmbed(ctx, { footer: { text, ...(iconUrl && { icon_url: iconUrl }) } });
			}

			default:
				return this.returnEmbed(ctx, { [ctx.tag.parameter]: payload });
		}
	}

	/**
	 * This method is protected so that anyone can extend the embed json parser to allow urls
	 *
	 * @param payload - The payload to parse
	 * @returns
	 */
	protected parseEmbedJSON(payload: string): Awaitable<APIEmbed> {
		const parsedResult = JSON.parse(payload);
		if (parsedResult.color) parsedResult.color = resolveColor(parsedResult.color);
		return parsedResult;
	}

	private returnEmbed(ctx: Context, data: APIEmbed): string {
		ctx.response.actions.embed ??= {};
		const { fields, ...rest } = data;
		if (fields) ctx.response.actions.embed.fields = [...(ctx.response.actions.embed.fields ?? []), ...fields];

		ctx.response.actions.embed = { ...ctx.response.actions.embed, ...rest };
		return '';
	}
}
