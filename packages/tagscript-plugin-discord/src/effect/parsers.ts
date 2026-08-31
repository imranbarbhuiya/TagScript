import * as DateTime from 'effect/DateTime';
import * as Effect from 'effect/Effect';
import { TemplateError, definePlugin, type ParseContext, type Parser } from 'tagscript/effect';

import { CooldownStore, OnCooldown } from './CooldownStore';

import { resolveColor } from '../lib/Utils/resolveColor';

import type { APIEmbed } from 'discord-api-types/v10';

/**
 *
 * Reads a JSON payload written by a template author.
 *
 * `JSON.parse` reports a character offset, which is a developer's error message. A template author
 * cannot act on it, so this reports a {@link TemplateError} instead.
 *
 * @param payload - The JSON the template author wrote.
 * @param tag - The declaration to attribute the error to.
 * @returns
 */
const parseJSON = (payload: string, tag: string) =>
	Effect.try({
		try: () => JSON.parse(payload) as Record<string, unknown>,
		catch: () => new TemplateError({ message: `${tag} was given something that is not valid JSON`, tag }),
	});

/**
 *
 * Splits a payload the way the classic plugin does, on `~` or `,` or `|`.
 *
 * @param payload - The payload to split.
 * @returns
 */
const splitList = (payload: string) => {
	if (payload.includes('~')) return payload.split('~');
	if (payload.includes(',')) return payload.split(',');
	return payload.split('|');
};

/**
 * Enforces a cooldown on a tag.
 *
 * This is the parser the whole Effect entry point exists for. The classic `CooldownParser` writes to
 * `response.actions.cooldown` and leaves the enforcing to you, because it has no way to reach a
 * store. This one asks for {@link CooldownStore}, so the compiler makes the application provide one,
 * and a second use inside the window fails with {@link OnCooldown}.
 *
 * The tag name comes from `keyValues.tagName`, so a bot that renders many tags keys them apart. It
 * falls back to the template itself when you do not set one.
 *
 * Aliases: `cooldown`, `cd`
 *
 * @example
 * ```yaml
 * {cooldown(5):This tag is on cooldown, try again in {retryAfter}s.}
 * ```
 */
export const cooldownParser: Parser<OnCooldown | TemplateError, CooldownStore> = definePlugin<
	OnCooldown | TemplateError,
	CooldownStore
>({
	names: ['cooldown', 'cd'],
	requiredParameter: true,
	parse: Effect.fnUntraced(function* (ctx) {
		const seconds = Number.parseInt(ctx.tag.parameter!, 10);
		if (Number.isNaN(seconds)) {
			return yield* new TemplateError({
				message: 'cooldown needs a number of seconds',
				tag: ctx.tag.declaration,
			});
		}

		const name = ctx.response.keyValues.tagName ?? ctx.originalMessage;
		const store = yield* CooldownStore;
		const retryAfter = yield* store.hit(name, seconds);
		if (retryAfter === null) return '';

		const message = ctx.tag.payload?.replaceAll('{retryAfter}', `${retryAfter}`).replaceAll('{name}', name);

		return yield* new OnCooldown({ retryAfter, name, message: message ?? null });
	}),
});

/**
 * Renders a Discord timestamp, which the client shows in the reader's own timezone.
 *
 * Reads the current time through Effect's `DateTime`, so a test can freeze the clock. The classic
 * parser calls `Date.now()` and cannot be tested.
 *
 * Aliases: `date`, `unix`, `currenttime`
 *
 * @example
 * ```yaml
 * {date}
 * {date(R):1735689600000}
 * ```
 */
export const dateFormatParser: Parser<TemplateError> = definePlugin<TemplateError>({
	names: ['date', 'unix', 'currenttime'],
	parse: Effect.fnUntraced(function* (ctx) {
		const now = yield* DateTime.now;
		const nowMillis = DateTime.toEpochMillis(now);

		const declaration = ctx.tag.declaration!.toLowerCase();
		if (declaration === 'unix' || declaration === 'currenttime') return `${nowMillis}`;

		const style = ctx.tag.parameter ?? 'f';
		if (!['f', 'F', 't', 'T', 'R'].includes(style)) return null;

		const payload = ctx.tag.payload ?? `${nowMillis}`;
		const millis = /^\d+$/.test(payload) ? Number(payload) : new Date(payload).getTime();
		if (Number.isNaN(millis)) {
			return yield* new TemplateError({ message: `${declaration} was given a date it cannot read`, tag: declaration });
		}

		// Discord takes seconds, and a value long enough to be milliseconds is converted.
		const seconds = `${millis}`.length > 10 ? Math.floor(millis / 1_000) : millis;
		return `<t:${seconds}:${style}>`;
	}),
});

/**
 * Marks the response as one the bot should send quietly.
 */
export const silentParser: Parser = definePlugin({
	names: ['silent'],
	parse: (ctx) =>
		Effect.sync(() => {
			ctx.response.actions.silentResponse = true;
			return '';
		}),
});

/**
 * Marks the invoking message for deletion.
 *
 * Aliases: `delete`, `del`
 */
export const deleteParser: Parser = definePlugin({
	names: ['delete', 'del'],
	parse: (ctx) =>
		Effect.sync(() => {
			ctx.response.actions.deleteMessage = true;
			return '';
		}),
});

/**
 * Attaches files to the response.
 */
export const filesParser: Parser = definePlugin({
	names: ['files'],
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			ctx.response.actions.files = splitList(ctx.tag.payload!);
			return '';
		}),
});

/**
 * Restricts a tag to the given users, roles or channels.
 *
 * Your code still does the checking. The parser records what the template asked for.
 *
 * Aliases: `require`, `allowlist`, `whitelist`
 */
export const requiredParser: Parser = definePlugin({
	names: ['require', 'allowlist', 'whitelist'],
	requiredParameter: true,
	parse: (ctx) =>
		Effect.sync(() => {
			if (ctx.response.actions.require) return null;
			ctx.response.actions.require = {
				ids: ctx.tag.parameter!.split(',').map((id) => id.trim()),
				message: ctx.tag.payload,
			};
			return '';
		}),
});

/**
 * Blocks a tag for the given users, roles or channels.
 *
 * Aliases: `deny`, `denylist`, `blacklist`
 */
export const denyParser: Parser = definePlugin({
	names: ['deny', 'denylist', 'blacklist'],
	requiredParameter: true,
	parse: (ctx) =>
		Effect.sync(() => {
			if (ctx.response.actions.deny) return null;
			ctx.response.actions.deny = {
				ids: ctx.tag.parameter!.split(',').map((id) => id.trim()),
				message: ctx.tag.payload,
			};
			return '';
		}),
});

/**
 * What Discord rejects an embed for, by property.
 *
 * These are checked here rather than left to the API, because Discord answers a bad embed with an
 * error the bot author has to read, long after the template author who caused it has gone. Schema
 * would express this declaratively and costs 12.3 KB gzipped, which is not worth it for a shape
 * this fixed, and its generic messages read worse for a template author than these do.
 *
 * `TagLimit` truncates a tag body before this sees it, so at the default of 2000 only `title` and
 * `author` are reachable. Raise it and the rest come into play.
 */
const EMBED_LIMITS: Record<string, number | undefined> = {
	title: 256,
	description: 4_096,
	footer: 2_048,
	author: 256,
};

/**
 *
 * Checks one embed property against Discord's limit for it.
 *
 * @param parameter - The property the template set.
 * @param value - What it set.
 * @returns A {@link TemplateError} when it is too long, otherwise `null`.
 */
const overLimit = (parameter: string, value: string) => {
	const limit = EMBED_LIMITS[parameter];
	if (limit === undefined || value.length <= limit) return null;

	return new TemplateError({
		message: `embed ${parameter} is ${value.length} characters, and Discord allows ${limit}`,
		tag: 'embed',
	});
};

/**
 *
 * Merges a fragment into the embed being built on the response.
 *
 * @param ctx - The tag being processed.
 * @param data - The fragment to merge.
 * @returns
 */
const mergeEmbed = (ctx: ParseContext, data: APIEmbed) => {
	ctx.response.actions.embed ??= {};
	const { fields, ...rest } = data;
	if (fields) ctx.response.actions.embed.fields = [...(ctx.response.actions.embed.fields ?? []), ...fields];
	ctx.response.actions.embed = { ...ctx.response.actions.embed, ...rest };
	return '';
};

/**
 * Builds an embed, either from JSON or one property at a time.
 *
 * A template author picks both the property names and the values, so the result is typed `APIEmbed`
 * for convenience and is not validated. Check it before you send it.
 *
 * @example
 * ```yaml
 * {embed:{"title": "Hello!", "description": "A test embed."}}
 * {embed(title):Rules}
 * {embed(field):Rule 1|Be nice.|false}
 * ```
 */
export const embedParser: Parser<TemplateError> = definePlugin<TemplateError>({
	names: ['embed'],
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		const payload = ctx.tag.payload!;
		const { parameter } = ctx.tag;

		if (!parameter) {
			const parsed = yield* parseJSON(payload, 'embed');
			if (parsed.color) parsed.color = resolveColor(parsed.color as string);
			return mergeEmbed(ctx, parsed);
		}

		if (payload.startsWith('{') && payload.endsWith('}')) {
			const parsed = yield* parseJSON(payload, `embed(${parameter})`);
			return mergeEmbed(ctx, { [parameter]: parsed });
		}

		const tooLong = overLimit(parameter, payload);
		if (tooLong) return yield* tooLong;

		switch (parameter) {
			case 'field': {
				const [name, value, inline] = payload.split('|');
				if (!name || !value) return '';
				return mergeEmbed(ctx, { fields: [{ name, value, inline: inline === 'true' }] });
			}

			case 'color':
				return mergeEmbed(ctx, { color: resolveColor(payload) as number });

			case 'image':
			case 'thumbnail':
				return mergeEmbed(ctx, { [parameter]: { url: payload } });

			case 'author': {
				const [name, url, iconUrl] = payload.split('|');
				if (!name) return '';
				return mergeEmbed(ctx, { author: { name, ...(url && { url }), ...(iconUrl && { icon_url: iconUrl }) } });
			}

			case 'footer': {
				const [text, iconUrl] = payload.split('|');
				if (!text) return '';
				return mergeEmbed(ctx, { footer: { text, ...(iconUrl && { icon_url: iconUrl }) } });
			}

			default:
				return mergeEmbed(ctx, { [parameter]: payload });
		}
	}),
});

/**
 * Every parser in this plugin except {@link cooldownParser}, which is left out because it needs a
 * {@link CooldownStore} and would put that requirement on anyone spreading this list.
 */
export const builtinParsers: readonly Parser<TemplateError>[] = [
	dateFormatParser,
	silentParser,
	deleteParser,
	filesParser,
	requiredParser,
	denyParser,
	embedParser,
];
