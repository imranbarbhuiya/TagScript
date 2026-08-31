import * as Effect from 'effect/Effect';
import * as Random from 'effect/Random';

import { StopSignal, TemplateError } from './Errors';
import { definePlugin } from './Parser';

import { SafeObjectTransformer, StringTransformer } from '../lib/Transformer';
import { escapeContent, parseIf, parseListIf, split } from '../lib/Utils/Util';

import type { Parser } from './Parser';

/**
 *
 * Splits a payload on the pipe and returns the first half or the rest, matching the classic
 * control-flow parsers.
 *
 * @param payload - The payload to split.
 * @param result - Which side the expression chose.
 * @returns
 */
const parseIntoOutput = (payload: string, result: boolean) => {
	const [first, ...rest] = split(payload, false);
	return result ? first : rest.join('|');
};

/**
 * Variables are useful for choosing a value and referencing it later in a tag.
 *
 * Aliases: `=`, `assign`, `let`, `var`
 *
 * @example
 * ```yaml
 * {=(prefix):!}
 * The prefix here is `{prefix}`.
 * ```
 */
export const defineParser: Parser = definePlugin({
	names: ['=', 'assign', 'let', 'var'],
	requiredParameter: true,
	parse: (ctx) =>
		Effect.sync(() => {
			ctx.response.variables[ctx.tag.parameter!] = new StringTransformer(ctx.tag.payload!);
			return '';
		}),
});

/**
 * Reads a seeded or defined variable, deciding during `willAccept` so an unknown name falls through
 * to another parser.
 */
export const strictVarsParser: Parser = {
	willAccept: (ctx) => Effect.succeed(Object.hasOwn(ctx.response.variables, ctx.tag.declaration!)),
	parse: (ctx) => Effect.sync(() => ctx.response.variables[ctx.tag.declaration!].transform(ctx.tag)),
};

/**
 * Reads a seeded or defined variable, deciding during `parse`, so it accepts every tag and returns
 * `null` for names it does not know.
 */
export const looseVarsParser: Parser = {
	willAccept: () => Effect.succeed(true),
	parse: (ctx) =>
		Effect.sync(() => {
			const { variables } = ctx.response;
			const declaration = ctx.tag.declaration!;
			if (!Object.hasOwn(variables, declaration)) return null;
			return variables[declaration].transform(ctx.tag);
		}),
};

/**
 * Returns one of two messages based on the expression in the parameter.
 *
 * @example
 * ```yaml
 * {if({args}==63):You guessed it!|Try again.}
 * ```
 */
export const ifStatementParser: Parser = definePlugin({
	names: ['if'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) => Effect.succeed(parseIntoOutput(ctx.tag.payload!, parseIf(ctx.tag.parameter!))),
});

/**
 * Checks that any of the pipe separated expressions are true.
 *
 * Aliases: `union`, `any`, `or`
 */
export const unionStatementParser: Parser = definePlugin({
	names: ['union', 'any', 'or'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) => Effect.succeed(parseIntoOutput(ctx.tag.payload!, parseListIf(ctx.tag.parameter!).includes(true))),
});

/**
 * Checks that all of the pipe separated expressions are true.
 *
 * Aliases: `intersection`, `all`, `and`
 */
export const intersectionStatementParser: Parser = definePlugin({
	names: ['intersection', 'all', 'and'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) => Effect.succeed(parseIntoOutput(ctx.tag.payload!, !parseListIf(ctx.tag.parameter!).includes(false))),
});

/**
 * Forces the tag output to be this tag's payload when the expression is true, while letting the
 * remaining tags run.
 */
export const breakParser: Parser = definePlugin({
	names: ['break'],
	requiredParameter: true,
	parse: (ctx) =>
		Effect.sync(() => {
			if (parseIf(ctx.tag.parameter!)) ctx.response.body = ctx.tag.payload ?? '';
			return '';
		}),
});

/**
 * Ends the render when the expression is true, keeping what was rendered so far and appending the
 * payload.
 *
 * Aliases: `stop`, `halt`, `error`
 */
export const stopParser: Parser<StopSignal> = definePlugin<StopSignal>({
	names: ['stop', 'halt', 'error'],
	requiredParameter: true,
	parse: Effect.fnUntraced(function* (ctx) {
		if (parseIf(ctx.tag.parameter!)) return yield* new StopSignal({ message: ctx.tag.payload ?? '' });
		return '';
	}),
});

/**
 * Picks a random item from a list split by `~` or `,`.
 *
 * Unlike the classic parser this draws from Effect's `Random`, so a test can seed it and a render
 * becomes reproducible. `nextIntBetween` includes both bounds, so the top index is `length - 1`.
 *
 * Aliases: `random`, `rand`
 */
export const randomParser: Parser = definePlugin({
	names: ['random', 'rand'],
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		const options = split(ctx.tag.payload!, true);
		return options[yield* Random.nextIntBetween(0, options.length - 1)];
	}),
});

/**
 * Returns the payload half the time and nothing the other half.
 *
 * Draws from Effect's `Random`, so a test can seed it.
 *
 * Aliases: `5050`, `50`, `?`
 */
export const fiftyFiftyParser: Parser = definePlugin({
	names: ['5050', '50', '?'],
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		return (yield* Random.nextBoolean) ? ctx.tag.payload! : '';
	}),
});

/**
 * Picks a random number in a range, as an integer for `range` or to one decimal place for `rangef`.
 *
 * Draws from Effect's `Random`, so a test can seed it.
 */
export const rangeParser: Parser<TemplateError> = definePlugin<TemplateError>({
	names: ['rangef', 'range'],
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		const payload = ctx.tag.payload!;
		const spl = payload.includes('-') ? payload.split('-') : payload.split(',');
		const float = ctx.tag.declaration!.toLowerCase() === 'rangef';

		const lower = float ? Number.parseFloat(spl[0]) : Number.parseInt(spl[0], 10);
		const upper = float ? Number.parseFloat(spl[1]) : Number.parseInt(spl[1], 10);

		if (Number.isNaN(lower) || Number.isNaN(upper)) {
			return yield* new TemplateError({
				message: `${ctx.tag.declaration} needs two numbers, such as {${ctx.tag.declaration}:1-10}`,
				tag: ctx.tag.declaration,
			});
		}

		if (float) return `${(yield* Random.nextIntBetween(lower * 10, upper * 10)) / 10}`;
		return `${yield* Random.nextIntBetween(lower, upper)}`;
	}),
});

/**
 * Reports whether the payload contains the parameter, or where.
 *
 * Aliases: `includes`, `in`, `contain`, `index`, `lindex`
 */
export const includesParser: Parser = definePlugin({
	names: ['includes', 'in', 'contain', 'index', 'lindex'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const declaration = ctx.tag.declaration!.toLowerCase();
			const { parameter, payload } = ctx.tag as { parameter: string; payload: string };

			if (declaration === 'includes' || declaration === 'in') return `${payload.includes(parameter)}`;
			if (declaration === 'contain') return `${payload.split(/\s+/).includes(parameter)}`;
			if (declaration === 'index') return `${payload.split(/\s+/).indexOf(parameter)}`;
			return `${payload.indexOf(parameter)}`;
		}),
});

/**
 * Replaces every occurrence of the first comma separated value with the second.
 */
export const replaceParser: Parser = definePlugin({
	names: ['replace'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const [before, ...rest] = ctx.tag.parameter!.split(',');
			return ctx.tag.payload!.replaceAll(before, rest.join(','));
		}),
});

/**
 * Slices the payload.
 *
 * Aliases: `slice`, `substr`, `substring`
 */
export const sliceParser: Parser = definePlugin({
	names: ['slice', 'substr', 'substring'],
	requiredParameter: true,
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const parameter = ctx.tag.parameter!;
			const payload = ctx.tag.payload!;
			const separator = parameter.includes('-') ? '-' : parameter.includes(',') ? ',' : null;
			if (separator === null) return payload.slice(Number.parseInt(parameter, 10));

			const [start, end] = parameter.split(separator);
			return payload.slice(Number.parseInt(start, 10), Number.parseInt(end, 10));
		}),
});

/**
 * Changes the case of the payload, or escapes TagScript syntax in it.
 *
 * Aliases: `lower`, `upper`, `capitalize`, `escape`
 */
export const stringFormatParser: Parser = definePlugin({
	names: ['lower', 'upper', 'capitalize', 'escape'],
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const payload = ctx.tag.payload!;
			switch (ctx.tag.declaration!.toLowerCase()) {
				case 'lower':
					return payload.toLowerCase();
				case 'upper':
					return payload.toUpperCase();
				case 'capitalize':
					return payload.charAt(0).toUpperCase() + payload.slice(1).toLowerCase();
				default:
					return escapeContent(payload);
			}
		}),
});

/**
 * Adds an ordinal suffix to a number.
 *
 * Aliases: `ordinal`, `ord`
 */
export const ordinalFormatParser: Parser = definePlugin({
	names: ['ordinal', 'ord'],
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const payload = ctx.tag.payload!;
			const value = Number(payload);
			if (Number.isNaN(value)) return payload;

			// 11, 12 and 13 take "th" even though they end in 1, 2 and 3.
			const teens = Math.abs(value) % 100;
			if (teens >= 11 && teens <= 13) return `${payload}th`;

			const lastDigit = Math.abs(value) % 10;
			const suffix = lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th';
			return `${payload}${suffix}`;
		}),
});

/**
 * Encodes the payload into a url. A `+` parameter replaces spaces with `+` rather than `%20`.
 *
 * Aliases: `urlencode`, `encodeuri`
 */
export const urlEncodeParser: Parser = definePlugin({
	names: ['urlencode', 'encodeuri'],
	requiredPayload: true,
	parse: (ctx) =>
		Effect.sync(() => {
			const payload = ctx.tag.payload!;
			return ctx.tag.parameter === '+' ? encodeURI(payload.replaceAll(/ +/g, '+')) : encodeURI(payload);
		}),
});

/**
 * Decodes a url. A `+` parameter turns `+` back into a space.
 *
 * A malformed escape such as `%zz` is the template author's mistake, so it raises a
 * {@link TemplateError} rather than becoming a defect.
 */
export const urlDecodeParser: Parser<TemplateError> = definePlugin<TemplateError>({
	names: ['urldecode'],
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		const payload = ctx.tag.parameter === '+' ? ctx.tag.payload!.replaceAll('+', ' ') : ctx.tag.payload!;

		try {
			return decodeURI(payload);
		} catch {
			return yield* new TemplateError({
				message: 'urldecode was given a url it cannot decode',
				tag: ctx.tag.declaration,
			});
		}
	}),
});

/**
 * Stores a JSON object as a variable, readable with dotted access.
 *
 * @example
 * ```yaml
 * {json(data):{"name": "John Doe", "age": 30}}
 * Your age is `{data.age}`.
 * ```
 */
export const jsonVarParser: Parser<TemplateError> = definePlugin<TemplateError>({
	names: ['json'],
	requiredParameter: true,
	requiredPayload: true,
	parse: Effect.fnUntraced(function* (ctx) {
		try {
			ctx.response.variables[ctx.tag.parameter!] = new SafeObjectTransformer(ctx.tag.payload!);
		} catch {
			return yield* new TemplateError({
				message: 'json was given something that is not valid JSON',
				tag: ctx.tag.declaration,
			});
		}

		return '';
	}),
});

/**
 * Every built-in parser, in the order the classic entry point registers them.
 */
export const builtinParsers: readonly Parser<StopSignal | TemplateError>[] = [
	defineParser,
	ifStatementParser,
	unionStatementParser,
	intersectionStatementParser,
	randomParser,
	fiftyFiftyParser,
	rangeParser,
	replaceParser,
	sliceParser,
	includesParser,
	stringFormatParser,
	ordinalFormatParser,
	urlEncodeParser,
	urlDecodeParser,
	jsonVarParser,
	breakParser,
	stopParser,
	strictVarsParser,
];
