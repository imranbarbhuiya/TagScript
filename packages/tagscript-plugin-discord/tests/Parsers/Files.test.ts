import { describe, expect, test } from 'bun:test';

import { Interpreter } from 'tagscript';

import { FilesParser } from '../../src';

const ts = new Interpreter(new FilesParser());

describe('FilesParser', () => {
	test('GIVEN comma separated urls THEN record each of them', async () => {
		const text = '{files:https://example.com/file.txt,https://example.com/file2.txt}';

		expect((await ts.run(text)).actions.files).toStrictEqual([
			'https://example.com/file.txt',
			'https://example.com/file2.txt',
		]);
	});

	test('GIVEN a single url THEN record it as a one item list', async () => {
		expect((await ts.run('{files:https://example.com/a.png}')).actions.files).toStrictEqual([
			'https://example.com/a.png',
		]);
	});

	test('GIVEN tilde separated urls THEN split on the tilde', async () => {
		expect((await ts.run('{files:a.png~b.png}')).actions.files).toStrictEqual(['a.png', 'b.png']);
	});

	test('GIVEN pipe separated urls THEN split on the pipe', async () => {
		expect((await ts.run('{files:a.png|b.png}')).actions.files).toStrictEqual(['a.png', 'b.png']);
	});

	test('GIVEN a files tag THEN render nothing in its place', async () => {
		expect((await ts.run('before {files:a.png} after')).body).toBe('before  after');
	});

	test('GIVEN no payload THEN leave the tag untouched, since the payload is required', async () => {
		expect((await ts.run('{files}')).body).toBe('{files}');
		expect((await ts.run('{files}')).actions.files).toBeUndefined();
	});

	test('GIVEN two files tags THEN the last one wins', async () => {
		expect((await ts.run('{files:a.png}{files:b.png}')).actions.files).toStrictEqual(['b.png']);
	});

	test('GIVEN the parser THEN record nothing when no tag is present', async () => {
		expect((await ts.run('nothing here')).actions).toStrictEqual({});
	});
});
