/**
 * Represents a type that may or may not be a promise
 *
 * @typeParam T - The type of the value
 */
export type Awaitable<T> = PromiseLike<T> | T;

export const splitRegex = /(?<!\\)\|/;
export const escapeRegex = /(?<!\\)(?<block>[():{|}])/g;

/**
 *
 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array.filter()} but works with async filter functions.
 *
 * @param values - The array of values
 * @param fn - The filter function
 * @returns
 * @typeParam T - The type of the values
 */
export const asyncFilter = async <T>(values: T[], fn: (t: T) => Awaitable<boolean>) => {
	const promises = values.map(fn);
	// eslint-disable-next-line @typescript-eslint/await-thenable
	const booleans = await Promise.all(promises);
	return values.filter((_, index) => booleans[index]);
};

/**
 *
 * Escapes special tagscript syntax in a string.
 *
 * @param content - The content to escape
 * @returns
 */
export const escapeContent = (content: string): string => content.replaceAll(escapeRegex, '\\$1');

/**
 *
 * Checks if the given value is `'true'` or `'false'`. If it is, it returns the boolean value. Otherwise, it returns null
 *
 * @param str - The string to check
 * @returns
 */
export const implicitBool = (str: string) => {
	const booleans = {
		true: true,
		false: false
	};
	const lower = str.toLowerCase();
	return lower in booleans ? booleans[lower as keyof typeof booleans] : null;
};

/**
 *
 * Parses an if statement. Returns a value based on the conditions.
 *
 * @param str - The string to parse
 * @returns
 */
export const parseIf = (str: string) => {
	const value = implicitBool(str);
	if (value !== null) return value;
	if (str.includes('!=')) {
		const spl = str.split('!=');
		return spl[0].trim() !== spl[1].trim();
	}

	if (str.includes('==')) {
		const spl = str.split('==');
		return spl[0].trim() === spl[1].trim();
	}

	if (str.includes('>=')) {
		const spl = str.split('>=');
		return Number.parseFloat(spl[0].trim()) >= Number.parseFloat(spl[1].trim());
	}

	if (str.includes('<=')) {
		const spl = str.split('<=');
		return Number.parseFloat(spl[0].trim()) <= Number.parseFloat(spl[1].trim());
	}

	if (str.includes('>')) {
		const spl = str.split('>');
		return Number.parseFloat(spl[0].trim()) > Number.parseFloat(spl[1].trim());
	}

	if (str.includes('<')) {
		const spl = str.split('<');
		return Number.parseFloat(spl[0].trim()) < Number.parseFloat(spl[1].trim());
	}

	return true;
};

/**
 *
 * Split a string by `|`, but ignore escaped characters.
 *
 * @remarks
 * If extended if true, it will also split by `~` and `,`
 * @param str - The string to split
 * @param extended - allow `~` or `,` as separators
 * @returns
 */
export const split = (str: string, extended = false): string[] => {
	if (extended && str.includes('~')) return str.split('~');
	if (extended && str.includes(',')) return str.split(',');
	if (str.includes('|')) return str.split(splitRegex);
	return [str];
};

/**
 *
 * Parses multiple if statements from a string.
 *
 * @param str - The string to parse
 * @returns
 */
export const parseListIf = (str: string) => {
	const splitted = split(str, false);
	return splitted.map((node) => parseIf(node));
};
