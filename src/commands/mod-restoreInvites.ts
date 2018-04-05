import { Client, Command, GuildStorage, Logger, logger, Message } from 'yamdbf';

import { EStrings } from '../enums';

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'restoreInvites',
			aliases: ['unclear-invites', 'restore-invites', 'restoreInvites'],
			desc: 'Restore all invites',
			usage: '<prefix>restoreInvites',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const storage: GuildStorage = message.guild.storage;
		await storage.set(EStrings.CLEARED_INVITES, {});
		message.channel.send(`Restored all invites.`);
	}
}
