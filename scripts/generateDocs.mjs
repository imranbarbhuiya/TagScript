/* eslint-disable no-console, tsdoc/syntax */
import { exec } from 'node:child_process';
import { cp, rm, mkdir, opendir } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import process from 'node:process';

import replaceInFile from 'replace-in-file';

/**
 *
 * @param {string} path - The path to the directory to search
 * @returns {AsyncIterableIterator<string>}
 */
async function* findFilesRecursively(path) {
	const dir = await opendir(path);

	for await (const item of dir) {
		if (item.isFile()) {
			yield join(dir.path, item.name);
		} else if (item.isDirectory()) {
			yield* findFilesRecursively(join(dir.path, item.name));
		}
	}
}

console.log('Generating docs...');

// Try to remove the docs folder, if it exists
try {
	await rm('docs', { recursive: true });
	console.log('Removed old docs folder');
} catch {}

// Generate the docs
try {
	await new Promise((resolve, reject) => {
		const child = exec('typedoc');
		child.stdout?.pipe(process.stdout);
		child.stderr?.pipe(process.stderr);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve(true);
			} else {
				reject(new Error(`Typedoc exited with code ${code}`));
			}
		});
	});

	console.log('Generated new docs');
} catch {
	process.exit(1);
}

try {
	// Copy all the `_meta.json` files from typedoc-api to docs folder
	await cp('apps/website/src/pages/typedoc-api/', 'docs', {
		recursive: true,
		filter: (path) => !path.endsWith('.md') || path.includes('_meta.json')
	});
	console.log('Copied _meta.json files');
} catch {}

// Delete previous docs files inside the website folder
try {
	await rm('apps/website/src/pages/typedoc-api', { recursive: true });
	console.log('Removed old typedoc-api folder');
} catch {}

await mkdir('apps/website/src/pages/typedoc-api');

try {
	await mkdir('docs/tagscript');
} catch {}

try {
	await mkdir('docs/plugins/plugin-discord');
} catch {}

await cp('docs/modules/tagscript.md', 'docs/tagscript/index.md');
await cp('docs/modules/tagscript_plugin_discord.md', 'docs/plugins/plugin-discord/index.md');
await rm('docs/modules', { recursive: true });
await rm('docs/modules.md');
await rm('docs/README.md');
await rm('docs/.nojekyll');

for await (const file of findFilesRecursively('docs')) {
	const filename = basename(file);
	const dir = dirname(file).replace(/^docs/, '');

	if (file.endsWith('.md')) {
		if (filename.startsWith('tagscript.')) {
			const formattedFilename = filename === 'tagscript.md' ? filename : filename.replace(/^tagscript\./, '');
			await cp(file, `apps/website/src/pages/typedoc-api/tagscript/${dir}/${formattedFilename}`);
		} else if (filename.startsWith('tagscript_plugin_discord.')) {
			const formattedFilename = filename === 'tagscript.md' ? filename : filename.replace(/^tagscript_plugin_discord\./, '');
			await cp(file, `apps/website/src/pages/typedoc-api/plugins/plugin-discord/${dir}/${formattedFilename}`);
		} else {
			await cp(file, `apps/website/src/pages/typedoc-api/${dir}/${filename}`);
		}
	} else {
		await cp(file, `apps/website/src/pages/typedoc-api/${dir}/${filename}`);
	}
}

console.log('Organized and copied docs to new typedoc-api folder');

await rm('docs', { recursive: true });
console.log('Deleted docs folder');

/**
 * @type {import('replace-in-file').ReplaceInFileConfig & {processor: (input: string) => string}}
 */
// @ts-expect-error - Invalid types
const options = {
	files: 'apps/website/src/pages/typedoc-api/**/*.md',
	processor: (input) =>
		input
			.replace(/\n\[tagscript(?:-plugin-discord)?]\(\.\/tagscript\/modules\/tagscript(?:_plugin_discord)?\.md\)\.\w+\n/, '')
			.replaceAll(/\.\/tagscript\/modules\/tagscript(?<plugin>_plugin_discord)?.md/g, (_match, plugin) => {
				return plugin ? '/typedoc-api/plugins/plugin-discord' : '/typedoc-api/tagscript';
			})
			.replaceAll(/\.\/tagscript\/(?<dir>\w+)\/tagscript(?<plugin>_plugin_discord)?\.(?<path>\w+)\.md/g, (_match, dir, plugin, path) => {
				return `${plugin ? '/typedoc-api/plugins/plugin-discord' : '/typedoc-api/tagscript'}/${dir}/${path}`;
			})
			.replaceAll(/#{3} Defined in\n{2}(?<path>.+)/g, (_match, path) => {
				if (path.startsWith('https:')) return `### Defined in\n\n${path}`;
				return `### Defined in\n\nhttps://github.com/imranbarbhuiya/TagScript/packages/${
					path.includes('tagscript-plugin-discord') ? '' : 'tagscript/'
				}${path}`;
			})
};

try {
	const results = await replaceInFile.replaceInFile(options);
	console.log('Replaced urls in ', results.filter((result) => result.hasChanged).length, ' files');
} catch (error) {
	console.error('Error occurred:', error);
}

console.log('Docs generated successfully!');
