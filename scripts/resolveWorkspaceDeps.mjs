/**
 * Rewrites `workspace:` dependency ranges in a workspace package to the concrete versions
 * of the packages they point at, so the published manifest is installable outside the repo.
 * npm has no equivalent of `yarn npm publish`'s substitution when the install was done by bun.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

const target = process.argv[2];

if (!target) {
	console.error('Usage: bun scripts/resolveWorkspaceDeps.mjs <package-directory>');
	process.exit(1);
}

const readManifest = async (dir) => JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));

const versions = new Map();

for (const workspaceDir of ['packages', 'apps']) {
	let entries;

	try {
		entries = await readdir(workspaceDir, { withFileTypes: true });
	} catch {
		continue;
	}

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		try {
			const manifest = await readManifest(join(workspaceDir, entry.name));
			versions.set(manifest.name, manifest.version);
		} catch {}
	}
}

const manifest = await readManifest(target);

for (const field of DEPENDENCY_FIELDS) {
	const deps = manifest[field];

	if (!deps) continue;

	for (const [name, range] of Object.entries(deps)) {
		if (!range.startsWith('workspace:')) continue;

		const version = versions.get(name);

		if (!version) throw new Error(`Cannot resolve workspace dependency ${name} of ${manifest.name}`);

		const specifier = range.slice('workspace:'.length);

		deps[name] = specifier === '*' || specifier === '' ? version : `${specifier.replace(/[\d.]+$/, '')}${version}`;
		console.log(`${manifest.name}: ${field}.${name} ${range} -> ${deps[name]}`);
	}
}

await writeFile(join(target, 'package.json'), `${JSON.stringify(manifest, null, '\t')}\n`);
