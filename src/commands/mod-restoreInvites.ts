import { User } from 'discord.js';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, LogAction } from '../sequelize';
import { CommandGroup } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'restore-invites',
			aliases: ['restoreInvites', 'unclear-invites', 'unclearInvites'],
			desc: 'Restore all previously cleared invites',
			usage: '<prefix>restore-invites (@user)',
			info: '`' + '@user  The user to restore all invites to\n' + '`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const memberId = user ? user.id : null;

		const num = await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: 'clear_invites',
				...(memberId && { memberId })
			}
		});

		this.client.logAction(message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId }),
			num
		});

		message.channel.send(`Restored invites for ${num} users.`);
	}
}
