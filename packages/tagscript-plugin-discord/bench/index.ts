import { bench, group, do_not_optimize } from 'mitata';
import { Interpreter, Lexer, ParenType } from 'tagscript';

import { emitResults, runBenchmarks } from '../../../scripts/bench/harness';
import {
	ChannelTransformer,
	CooldownParser,
	DateFormatParser,
	DeleteParser,
	DenyParser,
	EmbedParser,
	FilesParser,
	GuildTransformer,
	InteractionTransformer,
	MemberTransformer,
	RequiredParser,
	RoleTransformer,
	SilentParser,
	UserTransformer,
	resolveColor,
	resolveCommandOptions,
} from '../src';
import { channel, commandData, guild, interaction, member, role, user } from '../tests/Structures/Structures';

import type { IParser } from 'tagscript';

/**
 *
 * Benchmarks one parser in isolation, through a real interpreter holding only that parser.
 *
 * @param name - The label for the benchmark.
 * @param parser - The parser under test.
 * @param template - A template that exercises it.
 */
const benchParser = (name: string, parser: IParser, template: string) => {
	const ts = new Interpreter(parser);

	bench(name, function* () {
		yield async () => do_not_optimize(await ts.run(template));
	});
};

group('parsers', () => {
	benchParser('CooldownParser', new CooldownParser(), '{cooldown(5):Slow down.}');
	benchParser('DateFormatParser', new DateFormatParser(), '{date(YYYY-MM-DD):1735689600000}');
	benchParser('DeleteParser', new DeleteParser(), '{delete}');
	benchParser('DenyParser', new DenyParser(), '{deny(123,456):Not allowed.}');
	benchParser('FilesParser', new FilesParser(), '{file:https://example.com/a.png}');
	benchParser('RequiredParser', new RequiredParser(), '{require(123,456):Members only.}');
	benchParser('SilentParser', new SilentParser(), '{silent}');
});

group('embed', () => {
	const json = new Interpreter(new EmbedParser());

	bench('EmbedParser, json payload', function* () {
		yield async () => do_not_optimize(await json.run('{embed:{"title":"Hello!","description":"A test embed."}}'));
	});

	bench('EmbedParser, property form', function* () {
		yield async () => do_not_optimize(await json.run('{embed(title):Rules}'));
	});

	bench('EmbedParser, field form', function* () {
		yield async () => do_not_optimize(await json.run('{embed(field):Rule 1|Be nice.|false}'));
	});

	bench('EmbedParser, malformed json', function* () {
		yield async () => do_not_optimize(await json.run('{embed:{"title": }}'));
	});

	bench('EmbedParser, many properties', function* () {
		yield async () =>
			do_not_optimize(
				await json.run(
					'{embed(title):Rules}{embed(description):Read them.}{embed(color):0x37b2cb}{embed(footer):Posted by the mods}',
				),
			);
	});
});

group('transformers', () => {
	const bare = new Lexer('{thing}', 2_000, ParenType.Both);
	const dotted = new Lexer('{thing.name}', 2_000, ParenType.Both);

	const transformers = {
		UserTransformer: new UserTransformer(user),
		MemberTransformer: new MemberTransformer({ ...member, user }),
		RoleTransformer: new RoleTransformer(role),
		ChannelTransformer: new ChannelTransformer(channel),
		GuildTransformer: new GuildTransformer(guild),
		InteractionTransformer: new InteractionTransformer(interaction),
	};

	for (const [name, transformer] of Object.entries(transformers)) {
		bench(`${name}, mention`, function* () {
			yield () => do_not_optimize(transformer.transform(bare));
		});

		bench(`${name}, property`, function* () {
			yield () => do_not_optimize(transformer.transform(dotted));
		});
	}

	bench('UserTransformer, construction', function* () {
		yield () => do_not_optimize(new UserTransformer(user));
	});

	bench('MemberTransformer, construction', function* () {
		yield () => do_not_optimize(new MemberTransformer({ ...member, user }));
	});
});

group('utils', () => {
	bench('resolveColor, name', function* () {
		yield () => do_not_optimize(resolveColor('Blurple'));
	});

	bench('resolveColor, hex', function* () {
		yield () => do_not_optimize(resolveColor('#37b2cb'));
	});

	bench('resolveCommandOptions', function* () {
		yield () => do_not_optimize(resolveCommandOptions(commandData));
	});
});

group('interpreter', () => {
	const ts = new Interpreter(
		new CooldownParser(),
		new DateFormatParser(),
		new DeleteParser(),
		new DenyParser(),
		new EmbedParser(),
		new FilesParser(),
		new RequiredParser(),
		new SilentParser(),
	);

	const seedVariables = {
		user: new UserTransformer(user),
		member: new MemberTransformer({ ...member, user }),
		guild: new GuildTransformer(guild),
		channel: new ChannelTransformer(channel),
		role: new RoleTransformer(role),
	};

	for (const [name, template] of [
		['mentions only', 'Hi {user}, welcome to {guild.name} in {channel}.'],
		['embed plus actions', '{embed(title):Welcome}{embed(description):Hi {user.name}}{silent}{delete}'],
		[
			'realistic welcome tag',
			'Welcome {user.mention} to **{guild.name}**! You are member number {guild.memberCount}. {embed(color):0x37b2cb}{embed(title):Welcome}{cooldown(5):Slow down.}',
		],
	] as const) {
		bench(name, function* () {
			yield async () => do_not_optimize(await ts.run(template, { seedVariables }));
		});
	}
});

await emitResults(await runBenchmarks('plugin-discord'));
