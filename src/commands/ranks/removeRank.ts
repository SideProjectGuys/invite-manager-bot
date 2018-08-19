import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Role } from 'discord.js';

import { IMClient } from '../../client';
import { checkProBot, checkRoles } from '../../middleware';
import { LogAction, ranks } from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';
import { sendReply } from '../../functions/Messaging';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-rank',
			aliases: ['removeRank'],
			desc: 'Remove a rank',
			usage: '<prefix>remove-rank @role',
			info: '`@role`:\n' + 'The for which you want to remove the rank.\n\n',
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.removeRank))
	@using(resolve('role: Role'))
	@using(expect('role: Role'))
	@using(localize)
	public async action(message: Message, [rp, role]: [RP, Role]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const rank = await ranks.find({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			}
		});

		if (rank) {
			await rank.destroy();

			this.client.logAction(message, LogAction.removeRank, {
				rankId: rank.id,
				roleId: role.id
			});

			return sendReply(message, rp.CMD_REMOVERANK_DONE({ role: role.name }));
		} else {
			return sendReply(
				message,
				rp.CMD_REMOVERANK_RANK_NOT_FOUND({ role: role.name })
			);
		}
	}
}
