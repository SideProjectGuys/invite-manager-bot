import { Role } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { ranks, roles } from '../sequelize';
import { CommandGroup } from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-rank',
			aliases: ['addRank', 'set-rank', 'setRank'],
			desc: 'Add a new rank',
			usage: '<prefix>add-rank @role invites (info)',
			info: '`' +
				'@role    The role which the user will receive when reaching this rank\n' +
				'invites  The amount of invites needed to reach the rank\n' +
				'info     A decription that users will see so they know more about this rank' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	@using(resolve('role: Role, invites: Number, ...description: String'))
	@using(expect('role: Role, invites: Number'))
	public async action(message: Message, [role, invites, description]: [Role, number, string]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		await roles.insertOrUpdate({
			id: role.id,
			name: role.name,
			guildId: role.guild.id,
			color: role.hexColor,
			createdAt: role.createdAt
		});

		await ranks.insertOrUpdate({
			id: null,
			guildId: role.guild.id,
			roleId: role.id,
			numInvites: invites,
			description: description,
		}).then(created => {
			if (!created) {
				message.channel.send(`Rank ${role.toString()} updated: Now needs ${invites} ` +
					`and has the following description: "${description ? description : ''}"`);
			} else {
				message.channel.send(`Added rank ${role.toString()} which needs ${invites} ` +
					`and has the following description: "${description ? description : ''}"`);
			}
		});
	}
}
