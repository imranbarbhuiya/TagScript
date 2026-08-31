import * as Context from 'effect/Context';
import * as Data from 'effect/Data';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

/**
 * Raised by {@link cooldownParser} when a tag is used again before its cooldown has elapsed.
 *
 * Handle it at the call site with `Effect.catchTag('OnCooldown', ...)`. The message is whatever the
 * template author wrote as the payload, with `{retryAfter}` and `{name}` already filled in.
 */
export class OnCooldown extends Data.TaggedError('OnCooldown')<{
	/**
	 * The message the template asked to show, or `null` when it gave none.
	 */
	readonly message: string | null;
	/**
	 * The tag that is on cooldown.
	 */
	readonly name: string;
	/**
	 * Seconds left before the tag can run again, to one decimal place.
	 */
	readonly retryAfter: number;
}> {}

/**
 * Where cooldown state lives.
 *
 * On the classic entry point `CooldownParser` cannot enforce anything, because a parser has no way
 * to reach a store. It writes to `response.actions.cooldown` and leaves the work to you. Here the
 * parser asks for this service, so the compiler makes you provide one and the parser does the job.
 *
 * `hit` records a use and reports what is left, which keeps the check and the write in one
 * operation. Splitting them would let two concurrent renders both pass the check.
 */
export class CooldownStore extends Context.Service<
	CooldownStore,
	{
		/**
		 * Records a use of `key` and reports the seconds left, or `null` when it was not on cooldown.
		 */
		readonly hit: (key: string, seconds: number) => Effect.Effect<number | null>;
	}
>()('@tagscript/plugin-discord/CooldownStore') {
	/**
	 * Keeps cooldowns in a `Map` in this process.
	 *
	 * Good for one process and for tests. It never evicts, so a bot with many distinct keys grows
	 * without bound, and nothing is shared across shards. Use a Redis layer for either of those.
	 */
	static readonly memory = Layer.sync(CooldownStore)(() => {
		const used = new Map<string, number>();

		return CooldownStore.of({
			hit: (key, seconds) =>
				Effect.map(
					Effect.clockWith((clock) => clock.currentTimeMillis),
					(now) => {
						const last = used.get(key);
						const window = seconds * 1_000;

						if (last !== undefined && now - last < window) {
							return Math.round(((window - (now - last)) / 1_000) * 10) / 10;
						}

						used.set(key, now);
						return null;
					},
				),
		});
	});
}
