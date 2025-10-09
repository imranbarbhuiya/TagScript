/**
 * This script is used to generate the docs for the website.
 *
 * This script might contain some unnecessary fs and replace calls.
 * Feel free to optimize it. I just added new codes whenever I need as I'm busy with other stuff and optimizing this script is not necessary.
 */

/* eslint-disable tsdoc/syntax */
import { exec, execSync } from 'node:child_process';
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

if (process.env.VERCEL_URL) {
	console.log('Vercel detected, setting up git remote...');
	const remote = `https://github.com/imranbarbhuiya/TagScript`;
	execSync(`git remote add origin ${remote}`);
}

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
	// Copy all the `meta.json` files from api to docs folder
	await cp('apps/website/content/docs/api/', 'docs', {
		recursive: true,
		filter: (path) => !path.endsWith('.md') || path.includes('meta.json')
	});
	console.log('Copied meta.json files');
} catch {}

// Delete previous docs files inside the website folder
try {
	await rm('apps/website/content/docs/api', { recursive: true });
	console.log('Removed old api folder');
} catch {}

await mkdir('apps/website/content/docs/api');

await rename('docs/tagscript/README.md', 'docs/tagscript/index.md');
await rename('docs/@tagscript/plugin-discord/README.md', 'docs/@tagscript/plugin-discord/index.md');
await rm('docs/README.md');
await rm('docs/packages.md');

await cp('docs/', 'apps/website/content/docs/api', { recursive: true });

console.log('Organized and copied docs to new api folder');

await rm('docs', { recursive: true });
console.log('Deleted docs folder');

for await (const file of findFilesRecursively('apps/website/content/docs/api')) {
	const content = await readFile(file, 'utf8');

	const newContent = content
		// All the links are url encoded, so we need to replace them with the correct ones (is it a bug? or my setup issue?)
		.replaceAll('%5C', '/')
		.replaceAll('./tagscript/@tagscript/plugin-discord/', `/api/plugins/`)
		.replaceAll('./tagscript/tagscript/', `/api/tagscript/`)
		// There might be an option to do it but for now, lets do it this way
		.replace('[**@tagscript/plugin-discord**](/api/@tagscript/plugin-discord/README.md) • **Docs**\n\n***\n\n', '')
		.replace('[**tagscript**](/api/tagscript/README.md) • **Docs**\n\n***\n\n', '')
		.replaceAll(/\((?<link>[^)]+)\.md\)/g, '($1)');

	let fileHeading = file.split(/[/\\]/).pop();

	if (fileHeading === 'index.md') fileHeading = file.split(/[/\\]/).at(-2);

	const contentWithFrontMatter = file.endsWith('.md')
		? [
				'---',
				`title: ${fileHeading?.replaceAll(/-|_|.md/g, ' ').replaceAll(/\b\w/g, (line) => line.toUpperCase()) ?? 'Tagscript Docs'}`,
				'---',
				'',
				newContent.replace(new RegExp(`^# ${fileHeading}`), '')
			].join('\n')
		: newContent;

	await writeFile(file, contentWithFrontMatter);
}

await mkdir('apps/website/content/docs/api/plugins', { recursive: true });
await cp('apps/website/content/docs/api/@tagscript/plugin-discord', 'apps/website/content/docs/api/plugins', {
	recursive: true
});

console.log('Docs generated successfully!');
