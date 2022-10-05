import { BaseTransformer } from './Base';

import type { Role } from 'discord.js';

/**
 * Transformer for Discord [Role](https://discord.js.org/#/docs/discord.js/stable/class/Role).
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
