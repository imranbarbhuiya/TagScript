export type Awaitable<T> = T | PromiseLike<T>;

export const asyncFilter = async <T>(values: T[], fn: (t: T) => Awaitable<boolean>) => {
	const promises = values.map(fn);
	const booleans = await Promise.all(promises);
	return values.filter((_, i) => booleans[i]);
};

export function any<T>(iterable: Iterable<T>, keyFn: (arg: T) => boolean = Boolean): boolean {
	for (const item of iterable) {
		if (keyFn(item)) {
			return true;
		}
	}

	return false;
}

export function all<T>(iterable: Iterable<T>, keyFn: (arg: T) => boolean = Boolean): boolean {
	for (const item of iterable) {
		if (!keyFn(item)) {
			return false;
		}
	}

	return true;
}
