import { describe, expect, test } from 'bun:test';

import { Flavour, escapeMarkdown } from '../src';

describe('escapeMarkdown', () => {
	test('GIVEN text with no syntax THEN leave it alone', () => {
		expect(escapeMarkdown('Hello there, Ada.')).toBe('Hello there, Ada.');
	});

	test('GIVEN emphasis characters THEN escape them wherever they sit', () => {
		expect(escapeMarkdown('_ _** @everyone')).toBe('\\_ \\_\\*\\* @everyone');
	});

	test('GIVEN a link THEN escape the brackets, which is enough to stop it forming', () => {
		expect(escapeMarkdown('[click](https://evil.tld)')).toBe('\\[click\\](https://evil.tld)');
	});

	test('GIVEN a heading at the start of a line THEN escape it', () => {
		expect(escapeMarkdown('# Heading')).toBe('\\# Heading');
		expect(escapeMarkdown('a\n# Heading')).toBe('a\n\\# Heading');
	});

	test('GIVEN a hash in the middle of a line THEN leave it, since it is not a heading there', () => {
		expect(escapeMarkdown('issue #42')).toBe('issue #42');
	});

	test('GIVEN indented syntax THEN still treat it as the start of a line', () => {
		expect(escapeMarkdown('   - item')).toBe('   \\- item');
	});

	test('GIVEN an ordered list marker THEN escape the punctuation after the digits', () => {
		expect(escapeMarkdown('1. first\n2) second')).toBe('1\\. first\n2\\) second');
	});

	test('GIVEN digits mid-line THEN leave the punctuation, since no list can start there', () => {
		expect(escapeMarkdown('Call 555-1234 on 2024-01-01.')).toBe('Call 555-1234 on 2024-01-01.');
	});

	test('GIVEN a backslash THEN escape it first, so the escaping is not itself escapable', () => {
		expect(escapeMarkdown('a\\*b')).toBe('a\\\\\\*b');
	});

	test('GIVEN GFM syntax THEN escape tables and strikethrough, which CommonMark leaves alone', () => {
		expect(escapeMarkdown('a|b ~c~', Flavour.GFM)).toBe('a\\|b \\~c\\~');
		expect(escapeMarkdown('a|b ~c~', Flavour.CommonMark)).toBe('a|b ~c~');
	});

	test('GIVEN raw HTML THEN escape the opening angle bracket for the web flavours', () => {
		expect(escapeMarkdown('<script>x</script>', Flavour.GFM)).toBe('\\<script>x\\</script>');
	});

	test('GIVEN Discord THEN escape spoilers and strikethrough but not HTML, which it does not render', () => {
		expect(escapeMarkdown('||spoiler|| ~~gone~~', Flavour.Discord)).toBe('\\|\\|spoiler\\|\\| \\~\\~gone\\~\\~');
		expect(escapeMarkdown('<b>x</b>', Flavour.Discord)).toBe('<b>x</b>');
	});
});
