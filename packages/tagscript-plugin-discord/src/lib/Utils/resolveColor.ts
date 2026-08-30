/**
 * The colour names Discord clients ship with, matching the names discord.js exposes.
 */
export const Colors = {
	Default: 0x00_00_00,
	White: 0xff_ff_ff,
	Aqua: 0x1a_bc_9c,
	Green: 0x57_f2_87,
	Blue: 0x34_98_db,
	Yellow: 0xfe_e7_5c,
	Purple: 0x9b_59_b6,
	LuminousVividPink: 0xe9_1e_63,
	Fuchsia: 0xeb_45_9e,
	Gold: 0xf1_c4_0f,
	Orange: 0xe6_7e_22,
	Red: 0xed_42_45,
	Grey: 0x95_a5_a6,
	Navy: 0x34_49_5e,
	DarkAqua: 0x11_80_6a,
	DarkGreen: 0x1f_8b_4c,
	DarkBlue: 0x20_66_94,
	DarkPurple: 0x71_36_8a,
	DarkVividPink: 0xad_14_57,
	DarkGold: 0xc2_7c_0e,
	DarkOrange: 0xa8_43_00,
	DarkRed: 0x99_2d_22,
	DarkGrey: 0x97_9c_9f,
	DarkerGrey: 0x7f_8c_8d,
	LightGrey: 0xbc_c0_c0,
	DarkNavy: 0x2c_3e_50,
	Blurple: 0x58_65_f2,
	Greyple: 0x99_aa_b5,
	DarkButNotBlack: 0x2c_2f_33,
	NotQuiteBlack: 0x23_27_2a,
} as const satisfies Record<string, number>;

const HEX = /^(?:#|0x)?(?<hex>[\da-f]{6})$/i;
const MAX = 0xff_ff_ff;

/**
 * Resolves a colour to the integer Discord expects. Unresolvable input is returned untouched instead of
 * throwing, so one bad colour in a template does not end the render.
 *
 * Accepts a name from {@link Colors}, `Random`, `#ed4245`, `0xed4245`, `ed4245` or a decimal number.
 *
 * @param color - The colour to resolve
 * @returns The colour as a number, or the input when it resolves to nothing
 */
export const resolveColor = (color: number | string): number | string => {
	if (typeof color === 'number') return color;

	const trimmed = color.trim();
	if (trimmed === 'Random') return Math.floor(Math.random() * (MAX + 1));
	if (Object.hasOwn(Colors, trimmed)) return Colors[trimmed as keyof typeof Colors];

	const hex = HEX.exec(trimmed)?.groups?.hex;
	if (hex) return Number.parseInt(hex, 16);

	const decimal = Number(trimmed);
	if (trimmed !== '' && Number.isInteger(decimal) && decimal >= 0 && decimal <= MAX) return decimal;

	return color;
};
