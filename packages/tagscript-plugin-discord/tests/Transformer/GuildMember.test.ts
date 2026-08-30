import { describe, expect, it, test } from 'bun:test';

import { Interpreter, StrictVarsParser } from 'tagscript';

import { MemberTransformer } from '../../src';
import { member } from '../Structures/Structures';

const ts = new Interpreter(new StrictVarsParser());

describe('MemberTransformer', () => {
	test('GIVEN a member tag THEN return value from member variable', async () => {
		expect((await ts.run('{member}', { member: new MemberTransformer(member) })).body).toBe('<@758880890159235083>');
		expect((await ts.run('{member(nickname)}', { member: new MemberTransformer(member) })).body).toBe('');
		expect((await ts.run('{member(displayName)}', { member: new MemberTransformer(member) })).body).toBe('Parbez');
	});

	test('GIVEN a nickname THEN prefer it for displayName', async () => {
		const transformer = new MemberTransformer({ ...member, nick: 'Mahir' });

		expect((await ts.run('{member(displayName)}', { member: transformer })).body).toBe('Mahir');
	});

	it('should match the snapshot', async () => {
		const userTransformer = new MemberTransformer(member);

		expect(userTransformer.toJSON()).toMatchSnapshot();
	});
});
