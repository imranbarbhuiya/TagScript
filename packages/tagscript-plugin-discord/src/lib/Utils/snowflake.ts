import type { Snowflake } from 'discord-api-types/v10';

const DISCORD_EPOCH = 1_420_070_400_000n;

/**
 * Reads the creation time out of a snowflake.
 *
 * @param id - The snowflake to read
 * @returns The creation time in milliseconds since the Unix epoch
 */
export const snowflakeTimestamp = (id: Snowflake) => Number((BigInt(id) >> 22n) + DISCORD_EPOCH);

/**
 * Reads the creation date out of a snowflake.
 *
 * @param id - The snowflake to read
 * @returns The creation date as an ISO string
 */
export const snowflakeDate = (id: Snowflake) => new Date(snowflakeTimestamp(id)).toISOString();
