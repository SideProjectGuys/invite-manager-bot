import { Client, Command, GuildStorage, Logger, logger, Message } from 'yamdbf';

import { customInvites } from '../sequelize';

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

		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: 'clear_invites',
			}
		});

		message.channel.send(`Restored all invites.`);
	}
}
