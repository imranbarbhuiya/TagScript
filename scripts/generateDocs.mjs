/* eslint-disable no-console, tsdoc/syntax */
import { exec } from 'node:child_process';
import { cp, rm, mkdir, rename, opendir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
/**
 *
 * @param {string} path - The path to the directory to search
 * @returns {AsyncIterableIterator<string>}
 */
async function* findFilesRecursively(path) {
	const dir = await opendir(path);

	for await (const item of dir) {
		if (item.isFile()) yield join(dir.path, item.name);
		else if (item.isDirectory()) yield* findFilesRecursively(join(dir.path, item.name));
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
			if (code === 0) resolve(true);
			else reject(new Error(`Typedoc exited with code ${code}`));
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

await rename('docs/tagscript/README.md', 'docs/tagscript/index.md');
await rename('docs/@tagscript/plugin-discord/README.md', 'docs/@tagscript/plugin-discord/index.md');
await rm('docs/README.md');

await cp('docs/', 'apps/website/src/pages/typedoc-api', { recursive: true });

console.log('Organized and copied docs to new typedoc-api folder');

await rm('docs', { recursive: true });
console.log('Deleted docs folder');

for await (const file of findFilesRecursively('apps/website/src/pages/typedoc-api')) {
	const content = await readFile(file, 'utf8');

	const newContent = content
		// All the links are url encoded, so we need to replace them with the correct ones (is it a bug? or my setup issue?)
		.replaceAll('%5C', '/')
		.replaceAll('tagscript/@tagscript/plugin-discord/', `/typedoc-api/@tagscript/plugin-discord/`)
		.replaceAll('tagscript/tagscript/', `/typedoc-api/tagscript/`)
		// There might be an option to do it but for now, lets do it this way
		.replace('[**@tagscript/plugin-discord**](/typedoc-api/@tagscript/plugin-discord/README.md) • **Docs**\n\n***\n\n', '')
		.replace('[**tagscript**](/typedoc-api/tagscript/README.md) • **Docs**\n\n***\n\n', '');

	await writeFile(file, newContent);
}

console.log('Docs generated successfully!');
