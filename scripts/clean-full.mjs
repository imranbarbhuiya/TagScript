import { rm } from 'node:fs/promises';
import { URL } from 'node:url';

const rootDir = new URL('../', import.meta.url);
const packagesDir = new URL('packages/', rootDir);
const options = { recursive: true, force: true };

const paths = [
	// Root node_modules
	new URL('node_modules/', rootDir),

	// Nested node_modules folders
	new URL('tagscript/node_modules/', packagesDir),
	new URL('tagscript-plugin-discord/node_modules/', packagesDir),

	// Dist folders
	new URL('tagscript/dist/', packagesDir),
	new URL('tagscript-plugin-discord/dist/', packagesDir)
];

await Promise.all(paths.map((path) => rm(path, options)));
