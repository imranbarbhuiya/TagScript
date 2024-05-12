import { Interpreter, StrictVarsParser } from 'tagscript';

import { RoleTransformer } from '../../src';
import { role } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('RoleTransformer', () => {
	test('GIVEN a role tag THEN return value from Role variable', async () => {
		expect((await ts.run('{role}', { role: new RoleTransformer(role) })).body).toBe('<@&933378013154906142>');
	});

	it('should match the snapshot', async () => {
		const userTransformer = new RoleTransformer(role);

		expect(userTransformer.toJSON()).toMatchSnapshot();
	});
});
