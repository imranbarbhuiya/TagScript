import type { Snowflake } from 'discord-api-types/v10';

const CDN = 'https://cdn.discordapp.com';

const extensionFor = (hash: string) => (hash.startsWith('a_') ? 'gif' : 'webp');

export const userAvatarURL = (id: Snowflake, hash: string) => `${CDN}/avatars/${id}/${hash}.${extensionFor(hash)}`;

export const defaultUserAvatarURL = (id: Snowflake) => `${CDN}/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;

export const guildIconURL = (id: Snowflake, hash: string) => `${CDN}/icons/${id}/${hash}.${extensionFor(hash)}`;

export const guildSplashURL = (id: Snowflake, hash: string) => `${CDN}/splashes/${id}/${hash}.webp`;

export const guildBannerURL = (id: Snowflake, hash: string) => `${CDN}/banners/${id}/${hash}.${extensionFor(hash)}`;
