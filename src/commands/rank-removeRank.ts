import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Role } from 'discord.js';

import { IMClient } from '../client';
import { LogAction, ranks } from '../sequelize';
import { CommandGroup, RP } from '../utils/util';

const { resolve, expect } = Middleware;
const { using, localizable } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-rank',
			aliases: ['removeRank'],
			desc: 'Remove a rank',
			usage: '<prefix>remove-rank @role',
			info: '`@role`:\n' + 'The for which you want to remove the rank.\n\n',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	@using(resolve('role: Role'))
	@using(expect('role: Role'))
	@localizable
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

			message.channel.send(rp.CMD_REMOVERANK_DONE({ role: role.name }));
		} else {
			message.channel.send(
				rp.CMD_REMOVERANK_RANK_NOT_FOUND({ role: role.name })
			);
		}
	}
}
