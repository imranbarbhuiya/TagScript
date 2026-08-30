/**
 * Prints the CHANGELOG.md section a release tag belongs to, for use as GitHub release notes.
 * cliff-jumper writes one `# [<tag>](<compare link>) - (<date>)` heading per release, so the
 * pushed tag name is also the heading to look for.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const [packageDir, tag] = process.argv.slice(2);

if (!packageDir || !tag) {
	console.error('Usage: bun scripts/extractChangelog.mjs <package-directory> <tag>');
	process.exit(1);
}

const changelog = await readFile(join(packageDir, 'CHANGELOG.md'), 'utf8');
const lines = changelog.split('\n');
const start = lines.findIndex((line) => line.startsWith(`# [${tag}]`));

if (start === -1) {
	console.error(`No changelog entry for ${tag} in ${packageDir}/CHANGELOG.md`);
	process.exit(1);
}

const rest = lines.slice(start + 1);
const end = rest.findIndex((line) => line.startsWith('# ['));
const notes = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();

if (!notes) {
	console.error(`Changelog entry for ${tag} is empty`);
	process.exit(1);
}

console.log(notes);
