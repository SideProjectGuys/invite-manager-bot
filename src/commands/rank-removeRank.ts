import { Role } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { ranks } from '../sequelize';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-rank',
			aliases: ['removerank'],
			desc: 'Remove a rank',
			usage: '<prefix>remove-rank @role',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('role: Role'))
	@using(expect('role: Role'))
	public async action(message: Message, [role]: [Role]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const rank = await ranks.find({
			where: {
				guildId: role.guild.id,
				roleId: role.id,
			}
		});

		if (rank) {
			rank.destroy();
			message.channel.send(`Rank ${role.name} removed`);
		} else {
			message.channel.send(`Rank ${role.name} does not exist!`);
		}
	}
}
