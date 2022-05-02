import { Node } from '../src';

describe('Node', () => {
	const node = new Node([0, 1], null);

	test('GIVEN a node THEN Node#toString() should return a string with start, end info', () => {
		expect(node.toString()).toEqual(' at 0-1');
	});

	test('GIVEN a node THEN Node#toJSON() should return all the props', () => {
		expect(node.toJSON()).toEqual({ coordinates: [0, 1], output: null, tag: null });
	});
});
