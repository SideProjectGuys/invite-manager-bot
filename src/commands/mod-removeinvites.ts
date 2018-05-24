import { Role, User } from 'discord.js';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, LogAction, ranks } from '../sequelize';
import {
	CommandGroup,
	createEmbed,
	getInviteCounts,
	promoteIfQualified,
	sendEmbed
} from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-invites',
			aliases: ['removeInvites'],
			desc: 'Removes/Adds invites from/to a member',
			usage: '<prefix>remove-invites @user amount (reason)',
			info:
				'`' +
				'@user    The user that will receive/lose the bonus invites\n' +
				'amount   The amount of invites the user will lose/get.\n' +
				'           Use a negative (-) number to add invites.\n' +
				'reason   The reason why the user is losing/receiving the invites.' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User, amount: Number, ...reason: String'))
	@using(expect('user: User, amount: Number'))
	public async action(
		message: Message,
		[user, amount, reason]: [User, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let cmd = this.client.commands.resolve('add-invites');
		cmd.action(message, [user.id, -amount, reason]);
	}
}
