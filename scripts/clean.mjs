import { rm } from 'fs/promises';

const rootDir = new URL('../', import.meta.url);
const packagesDir = new URL('packages/', rootDir);
const options = { recursive: true, force: true };

const paths = [
	// Dist folders
	new URL('tagscript/dist/', packagesDir),
	new URL('tagscript-plugin-discord/dist/', packagesDir),

	// Turbo folders
	new URL('tagscript/.turbo/', packagesDir),
	new URL('tagscript-plugin-discord/.turbo/', packagesDir)
];

await Promise.all(paths.map((path) => rm(path, options)));
