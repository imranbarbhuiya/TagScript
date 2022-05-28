import { resolveCommandOptions } from '../../src';
import { interaction } from '../Structures/Structures';

// TODO(@imranbarbhuiya): Separate tests for each property.
describe('resolveCommandOptions', () => {
	test('GIVEN a interaction tag THEN return value from interaction variable', () => {
		// expect(resolveCommandOptions(interaction.options)).toBe({
		// 	subCommand: new StringTransformer('sub-command'),
		// 	subCommandGroup: new StringTransformer('sub-command-group'),
		// 	'sub-command-member': new MemberTransformer(member),
		// 	'sub-command-group-sub-command-member': new MemberTransformer(member),
		// 	string: new StringTransformer('Hello'),
		// 	channel: new ChannelTransformer(channel),
		// 	role: new RoleTransformer(role),
		// 	mentionable: new RoleTransformer(role),
		// 	mentionable2: new MemberTransformer(member),
		// 	boolean: new StringTransformer('true'),
		// 	number: new StringTransformer('1.1'),
		// 	integer: new StringTransformer('1')
		// });
		expect(Object.keys(resolveCommandOptions(interaction.options))).toStrictEqual([
			'subCommand',
			'sub-command-member',
			'subCommandGroup',
			'sub-command-group-sub-command-channel',
			'string',
			'mentionable',
			'mentionable-2',
			'boolean',
			'number',
			'integer',
			'attachment',
			'user'
		]);
	});
});
