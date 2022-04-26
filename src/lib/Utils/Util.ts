export type Awaitable<T> = T | PromiseLike<T>;

export const asyncFilter = async <T>(values: T[], fn: (t: T) => Awaitable<boolean>) => {
	const promises = values.map(fn);
	const booleans = await Promise.all(promises);
	return values.filter((_, i) => booleans[i]);
};
