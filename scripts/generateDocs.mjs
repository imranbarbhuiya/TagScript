/* eslint-disable no-console, tsdoc/syntax */
import { execSync } from 'node:child_process';
import { cp, rm, mkdir, opendir } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';

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
execSync('typedoc');
console.log('Generated new docs');

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
			await cp(file, `apps/website/src/pages/typedoc-api/tagscript/${dir}/${filename.replace(/^tagscript\./, '')}`);
		} else if (filename.startsWith('tagscript_plugin_discord.')) {
			await cp(file, `apps/website/src/pages/typedoc-api/plugins/plugin-discord/${dir}/${filename.replace(/^tagscript_plugin_discord\./, '')}`);
		} else {
			await cp(file, `apps/website/src/pages/typedoc-api/${dir}/${filename}`);
		}
	} else {
		await cp(file, `apps/website/src/pages/typedoc-api/${dir}/${filename}`);
	}
}

console.log('Organized and copied docs to new typedoc-api folder');

await rm('docs', { recursive: true });
console.log('Docs generated successfully!');
