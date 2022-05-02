import type { IParser } from '../interfaces';
import type { Context } from '../Interpreter';
import { BaseParser } from './Base';
import type { Awaitable, MessageEmbedOptions } from 'discord.js';
import { split } from '../Utils/Util';

/**
 *  An embed tag will send an embed in the tag response.
 *  There are two ways to use the embed block, either by using properly
 *  formatted embed JSON or manually inputting
 *  the accepted embed properties.
 * 
 *  Using JSON
 *  @usage
 *  ```yaml
 *     {embed:json}
 *  ```
 *  @example
 *  ```yaml
 *     {embed:{"title":"Hello!", "description":"This is a test embed."}}
        {embed:{
            "title":"Here's a random duck!",
            "image":{"url":"https://random-d.uk/api/randomimg"},
            "color":15194415
        }}
 * 	```
 *
 *  Using properties
 *  @usage
 * ```yaml
 *      {embed(property):value}
 * ```
 * 
 * @example
 * ```yaml
 *      {embed(color):0x37b2cb}
 *      {embed(title):Rules}
 *      {embed(description):Follow these rules to ensure a good experience in our server!}
 *      {embed(field):Rule 1|Respect everyone you speak to.|false}
 * ```
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
		return this.returnEmbed(ctx, { [ctx.tag.parameter]: ctx.tag.payload });
	}

	/**
	 * This method is protected so that anyone can extend the embed json parser to allow urls
	 * @param payload
	 * @returns
	 */
	protected parseEmbedJSON(payload: string): Awaitable<MessageEmbedOptions> {
		return JSON.parse(payload);
	}

	private returnEmbed(ctx: Context, data: MessageEmbedOptions): string {
		ctx.response.actions.embed ??= {};
		const { fields, ...rest } = data;
		if (fields) {
			ctx.response.actions.embed.fields = [...(ctx.response.actions.embed.fields ?? []), ...fields];
		}
		ctx.response.actions.embed = { ...ctx.response.actions.embed, ...rest };
		return '';
	}
}
