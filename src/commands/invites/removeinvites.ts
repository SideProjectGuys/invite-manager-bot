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
import { BotCommand, CommandGroup } from '../../types';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'remove-invites',
			aliases: ['removeInvites'],
			desc: 'Removes/Adds invites from/to a member',
			usage: '<prefix>remove-invites @user amount (reason)',
			info:
				'`@user`:\n' +
				'The user that will receive/lose the bonus invites\n\n' +
				'`amount`:\n' +
				'The amount of invites the user will lose/get. ' +
				'Use a negative (-) number to add invites.\n\n' +
				'`reason`:\n' +
				'The reason for adding/removing the invites.\n\n',
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.addInvites))
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
