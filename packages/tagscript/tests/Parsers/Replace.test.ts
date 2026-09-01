import { describe, expect, test } from 'bun:test';

import { Interpreter, ReplaceParser, Response } from '../../src';
import { rendered } from '../rendered';

const ts = new Interpreter(new ReplaceParser());
describe('ReplaceParser', () => {
	test('GIVEN a string in replace parser THEN replace one with another and returns the string', async () => {
		expect(rendered(await ts.run('{replace(Mahrin,Mahir):Hi Mahrin}'))).toStrictEqual(
			rendered(new Response().setValues('Hi Mahir', '{replace(Mahrin,Mahir):Hi Mahrin}')),
		);
	});
});
