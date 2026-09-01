import { describe, expect, test } from 'bun:test';

import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	IfStatementParser,
	IncludesParser,
	IntersectionStatementParser,
	JSONVarParser,
	OrdinalFormatParser,
	RandomParser,
	RangeParser,
	ReplaceParser,
	SliceParser,
	StopParser,
	StringFormatParser,
	UnionStatementParser,
	UrlDecodeParser,
	UrlEncodeParser,
	builtinTags,
	describeParser,
	findTag,
	validateTags,
} from '../src';

import type { BaseParser } from '../src';

const parsers: BaseParser[] = [
	new BreakParser(),
	new FiftyFiftyParser(),
	new StringFormatParser(),
	new OrdinalFormatParser(),
	new SliceParser(),
	new RandomParser(),
	new DefineParser(),
	new IfStatementParser(),
	new UnionStatementParser(),
	new IntersectionStatementParser(),
	new JSONVarParser(),
	new RangeParser(),
	new ReplaceParser(),
	new IncludesParser(),
	new StopParser(),
	new UrlEncodeParser(),
	new UrlDecodeParser(),
];

describe('builtinTags', () => {
	test('GIVEN the built-in parsers THEN the manifest lists exactly the names they accept', () => {
		const fromParsers = parsers.flatMap((parser) => parser.toJSON().acceptedNames).sort((a, b) => a.localeCompare(b));
		expect(builtinTags.map((tag) => tag.name).sort((a, b) => a.localeCompare(b))).toStrictEqual(fromParsers);
	});

	test('GIVEN the built-in parsers THEN the manifest agrees on what each tag requires', () => {
		const expected = new Map<string, [boolean, boolean]>();
		for (const parser of parsers) {
			const { acceptedNames, requiredParameter, requiredPayload } = parser.toJSON();
			for (const name of acceptedNames) expected.set(name, [requiredParameter, requiredPayload]);
		}

		for (const tag of builtinTags) {
			expect([tag.parameter?.required, tag.payload?.required]).toStrictEqual(expected.get(tag.name)!);
		}
	});

	test('GIVEN a manifest entry THEN it carries a label and a description', () => {
		for (const tag of builtinTags) {
			expect(tag.label.length).toBeGreaterThan(0);
			expect(tag.description?.length ?? 0).toBeGreaterThan(0);
		}
	});
});

describe('describeParser', () => {
	test('GIVEN a parser THEN read its names and requirements off it', () => {
		expect(describeParser(new SliceParser())).toStrictEqual([
			{ name: 'slice', label: 'slice', parameter: { required: true }, payload: { required: true } },
			{ name: 'substr', label: 'substr', aliasOf: 'slice', parameter: { required: true }, payload: { required: true } },
			{
				name: 'substring',
				label: 'substring',
				aliasOf: 'slice',
				parameter: { required: true },
				payload: { required: true },
			},
		]);
	});

	test('GIVEN details THEN they override the derived fields', () => {
		const [tag] = describeParser(new IfStatementParser(), { if: { label: 'If', insertable: false } });
		expect(tag.label).toBe('If');
		expect(tag.insertable).toBe(false);
	});
});

describe('findTag', () => {
	test('GIVEN a declaration in any case THEN match it, as willAccept does', () => {
		expect(findTag(builtinTags, 'UPPER')?.name).toBe('upper');
		expect(findTag(builtinTags, 'upper')?.name).toBe('upper');
	});

	test('GIVEN an unknown or absent declaration THEN match nothing', () => {
		expect(findTag(builtinTags, 'naem')).toBeUndefined();
		expect(findTag(builtinTags, null)).toBeUndefined();
	});
});

describe('validateTags', () => {
	const tags = [{ name: 'name', label: 'Name' }];

	test('GIVEN a template using only known tags THEN report nothing', () => {
		expect(validateTags('Hi {name}, welcome.', tags)).toStrictEqual([]);
	});

	test('GIVEN a mistyped tag THEN report it with the range it sits at', () => {
		const template = 'Hi {naem}';
		const [unknown] = validateTags(template, tags);
		expect(unknown).toStrictEqual({ declaration: 'naem', start: 3, end: 8 });
		expect(template.slice(unknown.start, unknown.end + 1)).toBe('{naem}');
	});

	test('GIVEN an escaped brace THEN do not report it, since it is not a tag', () => {
		expect(validateTags('Costs \\{100\\}', tags)).toStrictEqual([]);
	});

	test('GIVEN a nested unknown tag THEN report it too', () => {
		expect(validateTags('{name} and {upper:{naem}}', tags).map((tag) => tag.declaration)).toStrictEqual([
			'upper',
			'naem',
		]);
	});
});
