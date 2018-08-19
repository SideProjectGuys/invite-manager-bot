import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';

import { IMClient } from '../../client';
import { checkProBot, checkRoles } from '../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	LogAction
} from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';
import { sendReply } from '../../functions/Messaging';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'restore-invites',
			aliases: ['restoreInvites', 'unclear-invites', 'unclearInvites'],
			desc: 'Restore all previously cleared invites',
			usage: '<prefix>restore-invites (@user)',
			info:
				'`@user`:\n' +
				'The user to restore all invites to. ' +
				'If omitted restores invites for all users.\n\n',
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.restoreInvites))
	@using(resolve('user: User'))
	@using(localize)
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const memberId = user ? user.id : null;

		const num = await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generatedReason: [
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom,
					CustomInvitesGeneratedReason.clear_fake,
					CustomInvitesGeneratedReason.clear_leave
				],
				...(memberId && { memberId })
			}
		});

		this.client.logAction(message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId }),
			num
		});

		return sendReply(
			message,
			rp.CMD_RESTOREINVITES_DONE({ user: user ? user.id : undefined })
		);
	}
}
