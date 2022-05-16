import { Interpreter } from 'tagscript';
import { FilesParser } from '../../src';

describe('Files', () => {
	test('GIVEN file url WHEN parse THEN return empty string and url in actions', async () => {
		const ts = new Interpreter(new FilesParser());
		const text = '{files:https://example.com/file.txt,https://example.com/file2.txt}';

		expect((await ts.run(text)).actions.files).toStrictEqual(['https://example.com/file.txt', 'https://example.com/file2.txt']);
	});
});
