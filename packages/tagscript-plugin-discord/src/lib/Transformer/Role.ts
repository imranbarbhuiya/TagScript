import { PermissionFlagsBits } from 'discord-api-types/v10';

import { BaseTransformer } from './Base';

import { snowflakeDate, snowflakeTimestamp } from '../Utils/snowflake';

import type { APIRole } from 'discord-api-types/v10';

const permissionNames = (permissions: string) => {
	const bits = BigInt(permissions);

	return Object.entries(PermissionFlagsBits)
		.filter(([, bit]) => (bits & bit) === bit)
		.map(([name]) => name)
		.join(', ');
};

/**
 * Transformer for a Discord {@link APIRole} payload.
 *
 * Properties:
 * ```yaml
 * id: Gives role id.
 * name: Gives role name.
 * mention: Mentions the role.
 * color: Gives role color.
 * hoist: Gives true if the role is hoisted else false.
 * mentionable: Gives true if the role is mentionable else false.
 * position: Gives role position.
 * permissions: Gives role permissions.
 * createdAt: Gives role create date.
 * createdTimestamp: Gives role create date in ms.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 *
 * A role payload does not say who holds the role, so pass a member count yourself if a template needs one:
 * `new RoleTransformer(role, { memberCount: members.filter((member) => member.roles.includes(role.id)).length })`.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { RoleTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('Ping {role}', { role: new RoleTransformer(role) });
 * // Ping <@&868430685231271966>
 * ```
 */
export class RoleTransformer extends BaseTransformer<APIRole> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return `<@&${this.base.id}>`;
	}

	protected override updateSafeValues() {
		this.safeValues.color = this.base.color.toString();
		this.safeValues.hoist = this.base.hoist;
		this.safeValues.mentionable = this.base.mentionable;
		this.safeValues.position = this.base.position;
		this.safeValues.permissions = permissionNames(this.base.permissions);
		this.safeValues.createdAt = snowflakeDate(this.base.id);
		this.safeValues.createdTimestamp = snowflakeTimestamp(this.base.id);
	}
}
