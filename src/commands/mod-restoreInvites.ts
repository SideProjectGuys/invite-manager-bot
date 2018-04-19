import { Client, Command, GuildStorage, Logger, logger, Message } from 'yamdbf';

import { ActivityAction, customInvites } from '../sequelize';
import { CommandGroup, logAction } from '../utils/util';

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'restore-invites',
			aliases: ['restoreInvites', 'unclear-invites', 'unclearInvites'],
			desc: 'Restore all previously cleared invites',
			usage: '<prefix>restore-invites',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const num = await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: 'clear_invites',
			}
		});

		await logAction(ActivityAction.restoreInvites, message.guild.id, message.author.id, {
			num,
		});

		message.channel.send(`Restored all invites.`);
	}
}
