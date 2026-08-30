/**
 * Bumps every releasable workspace package from the repository root.
 *
 * cliff-jumper reads its config from the current working directory, so each package is bumped in a
 * separate child process with its own cwd. They run one at a time because every bump creates its own
 * commit and tag.
 */
import { execFile as execFileCallback, spawn } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import prompts from 'prompts';

const execFile = promisify(execFileCallback);

const PACKAGES_DIR = 'packages';

const args = process.argv.slice(2);
const skipPrompt = args.includes('--yes') || args.includes('-y') || Boolean(process.env.CI) || !process.stdin.isTTY;
const cliffJumperArgs = args.filter((arg) => arg !== '--yes' && arg !== '-y');

const exists = async (path) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

const findReleasablePackages = async () => {
	const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
	const packages = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const path = join(PACKAGES_DIR, entry.name);

		if (!(await exists(join(path, '.cliff-jumperrc.yml')))) continue;

		const { name, version } = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));

		packages.push({ name, path, version });
	}

	return packages;
};

const bump = async ({ name, path }) =>
	new Promise((resolve, reject) => {
		const child = spawn('cliff-jumper', cliffJumperArgs, { cwd: path, shell: true, stdio: 'inherit' });

		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`cliff-jumper exited with code ${code} for ${name}`));
		});
	});

const revParseHead = async () => (await execFile('git', ['rev-parse', 'HEAD'])).stdout.trim();

/**
 * cliff-jumper only ever creates lightweight tags, and `git push --follow-tags` pushes annotated tags
 * exclusively, so release tags silently stay local. Re-create them as annotated once the bump commit
 * lands. A HEAD that didn't move means nothing was committed (`--dry-run`, `--skip-tag`, a failure
 * before the commit), and any tag pointing at it predates this run.
 */
const annotateNewTags = async (headBeforeBump) => {
	const head = await revParseHead();

	if (head === headBeforeBump) return;

	const { stdout } = await execFile('git', ['tag', '--points-at', head]);

	for (const tag of stdout.split('\n').filter(Boolean)) {
		const { stdout: objectType } = await execFile('git', ['cat-file', '-t', tag]);

		if (objectType.trim() !== 'commit') continue;

		await execFile('git', ['tag', '--annotate', '--force', '--message', tag, tag, head]);
		console.info(`\u{1F3F7}\uFE0F  Re-created ${tag} as an annotated tag`);
	}
};

const packages = await findReleasablePackages();

if (packages.length === 0) {
	console.error(`No packages with a .cliff-jumperrc.yml found in ${PACKAGES_DIR}/`);
	process.exit(1);
}

let selected = packages;

if (!skipPrompt) {
	const { picked } = await prompts({
		type: 'multiselect',
		name: 'picked',
		message: 'Which packages should be bumped?',
		instructions: false,
		choices: packages.map((pkg) => ({ title: `${pkg.name}@${pkg.version}`, value: pkg, selected: true })),
	});

	if (!picked) {
		console.error('Aborted.');
		process.exit(1);
	}

	selected = picked;
}

if (selected.length === 0) {
	console.log('Nothing selected, no packages were bumped.');
	process.exit(0);
}

for (const pkg of selected) {
	console.info(`\nBumping ${pkg.name} (${pkg.path})`);

	const headBeforeBump = await revParseHead();

	await bump(pkg);
	await annotateNewTags(headBeforeBump);
}

console.info(`\nBumped ${selected.length} package${selected.length === 1 ? '' : 's'}.`);
