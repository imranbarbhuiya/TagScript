import { resolveColor as DJSResolveColor, type ColorResolvable } from 'discord.js';

/**
 * Resolves a color to a number. This function doesn't throw for invalid colors but returns the input
 *
 * @param color - The color to resolve
 * @returns
 */
export const resolveColor = (color: string): number | string => {
	try {
		return Number(color) || DJSResolveColor(color as ColorResolvable);
	} catch {
		return color;
	}
};
