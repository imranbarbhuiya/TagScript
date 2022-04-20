const splitRegex = /(?<!\\)\|/;
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
	return null;
};

const implicitBool = (str: string) => {
	const bools = {
		true: true,
		false: false,
	};
	return bools[str.toLowerCase() as keyof typeof bools] ?? null;
};

export const split = (str: string, easy: boolean): string[] | null => {
	if (str.includes('|')) return str.split(splitRegex);
	if (easy && str.includes('~')) return str.split('~');
	if (easy && str.includes(',')) return str.split(',');
	return null;
};
