import { BaseParser, split, type Context, type IParser, type Awaitable } from 'tagscript';

import { resolveColor } from '../Utils';

import type { EmbedData, APIEmbed } from 'discord.js';

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
 * ```
 * Developers need to construct the embed builder themselves with the output of the tag.
 * @example
 * ```ts
 * const { Interpreter } = require("tagscript")
 * const { EmbedParser } = require("tagscript-plugin-discord")
 *
 * const ts = new Interpreter(new EmbedParser())
 * const result = await ts.run('{embed: { "title": "Hello!", "description": "This is a test embed." }}')
 *
 * // You might need to change the embed object before passing to `EmbedBuilder`. Changes such as change thumbnail and image value from string to object.
 * const embed = new EmbedBuilder(response.actions.embed);
 * ```
 * @remarks
 * The return type depends on user's input. So it might not be `EmbedData | APIEmbed`. So use a typeguard to check.
 */
export class EmbedParser extends BaseParser implements IParser {
	public constructor() {
		super(['embed'], false, true);
	}

	public async parse(ctx: Context) {
		if (!ctx.tag.parameter) return this.returnEmbed(ctx, await this.parseEmbedJSON(ctx.tag.payload!));

		if (ctx.tag.payload!.startsWith('{') && ctx.tag.payload!.endsWith('}'))
			return this.returnEmbed(ctx, { [ctx.tag.parameter]: JSON.parse(ctx.tag.payload!) as unknown });
		if (ctx.tag.parameter === 'field') {
			const [name, value, inline] = split(ctx.tag.payload!);
			if (!name || !value) return '';
			return this.returnEmbed(ctx, {
				fields: [
					{
						name,
						value,
						inline: inline === 'true'
					}
				]
			});
		}

		if (ctx.tag.parameter === 'color') {
			return this.returnEmbed(ctx, {
				// This can return number but it should be handled by the dev
				color: resolveColor(ctx.tag.payload!) as number
			});
		}

		return this.returnEmbed(ctx, { [ctx.tag.parameter]: ctx.tag.payload });
	}

	/**
	 * This method is protected so that anyone can extend the embed json parser to allow urls
	 *
	 * @param payload - The payload to parse
	 * @returns
	 */
	protected parseEmbedJSON(payload: string): Awaitable<APIEmbed | EmbedData> {
		const parsedResult = JSON.parse(payload);
		if (parsedResult.color) parsedResult.color = resolveColor(parsedResult.color);
		return parsedResult;
	}

	private returnEmbed(ctx: Context, data: APIEmbed | EmbedData): string {
		ctx.response.actions.embed ??= {} as EmbedData;
		const { fields, ...rest } = data;
		if (fields) {
			ctx.response.actions.embed.fields = [...(ctx.response.actions.embed.fields ?? []), ...fields];
		}

		// @ts-expect-error - The return type should be unknown
		ctx.response.actions.embed = { ...ctx.response.actions.embed, ...rest };
		return '';
	}
}
