import { BaseTransformer } from './Base';

import type { Role } from 'discord.js';

/**
 * Transformer for Discord {@link Role}.
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
 * memberCount: Gives role member count.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { RoleTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('Ping {role}', { role: new RoleTransformer(Role) });
 * // Ping <@&868430685231271966>
 * ```
 */
export class RoleTransformer extends BaseTransformer<Role> {
	protected override updateSafeValues() {
		this.safeValues.color = this.base.color.toString();
		this.safeValues.hoist = this.base.hoist;
		this.safeValues.mentionable = this.base.mentionable;
		this.safeValues.position = this.base.position;
		this.safeValues.permissions = this.base.permissions.toArray().join(', ');
		this.safeValues.createdAt = this.base.createdAt.toISOString();
		this.safeValues.createdTimestamp = this.base.createdTimestamp;
		this.safeValues.memberCount = this.base.members.size;
	}
}
