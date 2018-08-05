import { Command, Logger, logger, Message } from '@yamdbf/core';

import { IMClient } from '../../client';
import { SettingsCache } from '../../storage/SettingsCache';
import { CommandGroup } from '../../types';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'prefix',
			desc: 'Shows the current prefix of the bot',
			usage: '<prefix>prefix',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const sets = await SettingsCache.get(message.guild.id);

		message.channel.send(
			`The current prefix is ${sets.prefix}\n` +
				`Change it using \`${sets.prefix}config prefix +\``
		);
	}
}
