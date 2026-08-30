import { BaseTransformer } from './Base';

import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';

/**
 * Transformer for a Discord {@link APIApplicationCommandInteraction} payload.
 *
 * Properties:
 * ```yaml
 * id: Gives interaction id.
 * name: Gives the command name.
 * mention: Renders a clickable command mention.
 * applicationId: Gives the application id.
 * channelId: Gives the channel id.
 * guildId: Gives the guild id.
 * commandId: Gives the command id.
 * commandName: Gives the command name.
 * locale: Gives the user's locale.
 * guildLocale: Gives the guild's locale.
 * ```
 *
 * @remarks
 * You need to use `StrictVarsParser` parser to use this transformer.
 * @example
 * ```ts showLineNumbers
 * import { Interpreter, StrictVarsParser } from 'tagscript';
 * import { InteractionTransformer } from '@tagscript/plugin-discord';
 *
 * const ts = new Interpreter(new StrictVarsParser());
 *
 * await ts.run('You used the {command.commandName} command', { command: new InteractionTransformer(interaction) });
 * // You used the ping command
 * ```
 */
export class InteractionTransformer extends BaseTransformer<APIApplicationCommandInteraction> {
	protected resolveId() {
		return this.base.id;
	}

	protected resolveMention() {
		return `</${this.base.data.name}:${this.base.data.id}>`;
	}

	protected override updateSafeValues() {
		this.safeValues.name = this.base.data.name;
		this.safeValues.applicationId = this.base.application_id;
		this.safeValues.channelId = this.base.channel.id;
		this.safeValues.guildId = this.base.guild_id ?? '';
		this.safeValues.commandId = this.base.data.id;
		this.safeValues.commandName = this.base.data.name;
		this.safeValues.locale = this.base.locale;
		this.safeValues.guildLocale = this.base.guild_locale ?? '';
	}
}
