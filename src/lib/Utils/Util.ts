export type Awaitable<T> = T | PromiseLike<T>;

export const splitRegex = /(?<!\\)\|/;
export const escapeRegex = /(?<!\\)([{():|}])/g;

export const asyncFilter = async <T>(values: T[], fn: (t: T) => Awaitable<boolean>) => {
	const promises = values.map(fn);
	const booleans = await Promise.all(promises);
	return values.filter((_, i) => booleans[i]);
};

export const escapeContent = (content: string): string => {
	return content.replace(escapeRegex, '\\$1');
};

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
		return parseFloat(spl[0].trim()) >= parseFloat(spl[1].trim());
	}
	if (str.includes('<=')) {
		const spl = str.split('<=');
		return parseFloat(spl[0].trim()) <= parseFloat(spl[1].trim());
	}
	if (str.includes('>')) {
		const spl = str.split('>');
		return parseFloat(spl[0].trim()) > parseFloat(spl[1].trim());
	}
	if (str.includes('<')) {
		const spl = str.split('<');
		return parseFloat(spl[0].trim()) < parseFloat(spl[1].trim());
	}
	return true;
};

const implicitBool = (str: string) => {
	const booleans = {
		true: true,
		false: false,
	};
	const lower = str.toLowerCase();
	return lower in booleans ? booleans[lower as keyof typeof booleans] : null;
};

export const split = (str: string, easy: boolean): string[] => {
	if (easy && str.includes('~')) return str.split('~');
	if (easy && str.includes(',')) return str.split(',');
	if (str.includes('|')) return str.split(splitRegex);
	return [str];
};

export const parseListIf = (str: string) => {
	const splitted = split(str, false);
	return splitted.map((s) => parseIf(s));
};
