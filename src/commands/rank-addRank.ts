import { Role } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { ranks } from '../sequelize';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-rank',
			aliases: ['addrank', 'setrank', 'set-rank'],
			desc: 'Add a new rank',
			usage: '<prefix>add-rank @role invitesNeeded (description)',
			info: '',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('role: Role, invites: Number, ...description: String'))
	@using(expect('role: Role, invites: Number'))
	public async action(message: Message, [role, invites, description]: [Role, number, string]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

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
