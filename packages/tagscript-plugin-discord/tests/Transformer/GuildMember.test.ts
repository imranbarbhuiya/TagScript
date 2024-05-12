import { Interpreter, StrictVarsParser } from 'tagscript';

import { MemberTransformer } from '../../src';
import { member } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('MemberTransformer', () => {
	test('GIVEN a member tag THEN return value from member variable', async () => {
		expect((await ts.run('{member}', { member: new MemberTransformer(member) })).body).toBe('<@758880890159235083>');
		expect((await ts.run('{member(nickname)}', { member: new MemberTransformer(member) })).body).toBe('');
	});

	it('should match the snapshot', async () => {
		const userTransformer = new MemberTransformer(member);

		expect(userTransformer.toJSON()).toMatchSnapshot();
	});
});
