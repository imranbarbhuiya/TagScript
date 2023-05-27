import { BaseTransformer } from './Base';

import type { CommandInteraction } from 'discord.js';

/**
 * Transformer for Discord {@link CommandInteraction}
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 *  @example
 * ```ts copy showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { InteractionTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('You've used the command `{command.name}`', { command: new InteractionTransformer(Role) });
 * // You've used the command `ping`
 * ```
 */
export class InteractionTransformer extends BaseTransformer<CommandInteraction> {
	protected override updateSafeValues() {
		this.safeValues.applicationId = this.base.applicationId;
		this.safeValues.channelId = this.base.channelId;
		this.safeValues.guildId = this.base.guildId;
		this.safeValues.commandId = this.base.commandId;
		this.safeValues.commandName = this.base.commandName;
		this.safeValues.locale = this.base.locale;
		this.safeValues.guildLocale = this.base.guildLocale;
	}
}
