import { describe, expect, test } from 'bun:test';

import { BaseParser, Context, Interpreter, Lexer, ParenType, Response } from '../../src';

import type { IParser } from '../../src';

class TestParser extends BaseParser implements IParser {
	public constructor(names: string[], requiredParameter = false, requiredPayload = false) {
		super(names, requiredParameter, requiredPayload);
	}

	public parse() {
		return 'parsed';
	}
}

const contextFor = (tag: string) => {
	const interpreter = new Interpreter();
	const lexer = new Lexer(tag, 2_000, ParenType.Both);
	return new Context(lexer, new Response(), interpreter, tag);
};

describe('BaseParser', () => {
	describe('willAccept, by name', () => {
		const parser = new TestParser(['test', 'alias']);

		test.each(['{test}', '{alias}'])('GIVEN an accepted name in %s THEN accept it', (tag) => {
			expect(parser.willAccept(contextFor(tag))).toBe(true);
		});

		test('GIVEN a name it does not know THEN reject it', () => {
			expect(parser.willAccept(contextFor('{other}'))).toBe(false);
		});

		test('GIVEN an uppercase declaration THEN accept it, since matching is case insensitive', () => {
			expect(parser.willAccept(contextFor('{TEST}'))).toBe(true);
		});

		test('GIVEN a mixed case declaration THEN accept it', () => {
			expect(parser.willAccept(contextFor('{TeSt}'))).toBe(true);
		});
	});

	describe('willAccept, required parameter', () => {
		const parser = new TestParser(['test'], true);

		test('GIVEN a parameter THEN accept it', () => {
			expect(parser.willAccept(contextFor('{test(value)}'))).toBe(true);
		});

		test('GIVEN no parameter THEN reject it', () => {
			expect(parser.willAccept(contextFor('{test}'))).toBe(false);
		});

		test('GIVEN a payload but no parameter THEN reject it', () => {
			expect(parser.willAccept(contextFor('{test:payload}'))).toBe(false);
		});
	});

	describe('willAccept, required payload', () => {
		const parser = new TestParser(['test'], false, true);

		test('GIVEN a payload THEN accept it', () => {
			expect(parser.willAccept(contextFor('{test:payload}'))).toBe(true);
		});

		test('GIVEN no payload THEN reject it', () => {
			expect(parser.willAccept(contextFor('{test}'))).toBe(false);
		});
	});

	describe('willAccept, both required', () => {
		const parser = new TestParser(['test'], true, true);

		test('GIVEN both THEN accept it', () => {
			expect(parser.willAccept(contextFor('{test(param):payload}'))).toBe(true);
		});

		test.each(['{test}', '{test(param)}', '{test:payload}'])('GIVEN only part of it in %s THEN reject it', (tag) => {
			expect(parser.willAccept(contextFor(tag))).toBe(false);
		});
	});

	describe('toJSON', () => {
		test('GIVEN a parser THEN report the names and requirements it was built with', () => {
			expect(new TestParser(['test', 'alias'], true, true).toJSON()).toStrictEqual({
				acceptedNames: ['test', 'alias'],
				requiredParameter: true,
				requiredPayload: true,
			});
		});

		test('GIVEN the defaults THEN report both requirements as false', () => {
			expect(new TestParser(['test']).toJSON()).toStrictEqual({
				acceptedNames: ['test'],
				requiredParameter: false,
				requiredPayload: false,
			});
		});
	});

	describe('through an interpreter', () => {
		test('GIVEN an accepted tag THEN the parser runs', async () => {
			const ts = new Interpreter(new TestParser(['test']));

			expect((await ts.run('{test}')).body).toBe('parsed');
		});

		test('GIVEN a tag missing its required parameter THEN leave it untouched', async () => {
			const ts = new Interpreter(new TestParser(['test'], true));

			expect((await ts.run('{test}')).body).toBe('{test}');
		});
	});
});
