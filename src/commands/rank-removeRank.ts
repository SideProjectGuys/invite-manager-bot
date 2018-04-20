import { Role } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { LogAction, ranks } from '../sequelize';
import { CommandGroup, logAction } from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-rank',
			aliases: ['removeRank'],
			desc: 'Remove a rank',
			usage: '<prefix>remove-rank @role',
			info: '`' +
				'@role  The for which you want to remove the rank.' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Ranks,
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
			await rank.destroy();

			await logAction(message, LogAction.removeRank, {
				rankId: rank.id,
				roleId: role.id,
			});

			message.channel.send(`Rank ${role.name} removed`);
		} else {
			message.channel.send(`Rank ${role.name} does not exist!`);
		}
	}
}
