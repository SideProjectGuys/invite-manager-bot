import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { checkRoles } from '../../middleware/CheckRoles';
import { OwnerCommand } from '../../types';

const config = require('../../../config.json');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'owner-dm',
			aliases: ['odm'],
			desc: 'Send a DM to a user',
			usage: '<prefix>owner-dm',
			hidden: true
		});
	}

	@using(checkRoles(OwnerCommand.dm))
	@using(resolve('userId: string, ...msg: String'))
	@using(expect('userId: string, ...msg: String'))
	public async action(
		message: Message,
		[userId, msg]: [string, string]
	): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		const user = await this.client.users.fetch(userId);
		if (!user) {
			message.reply(`Could not find user with id ${userId}`);
			return;
		}

		let channel = user.dmChannel;
		if (!channel) {
			channel = await user.createDM();
		}

		channel
			.send(msg)
			.then(() => {
				message.react('👍');
			})
			.catch((err: any) => {
				message.reply(`ERROR ${err.code}: ${err.message}`);
				message.react('👎');
			});
	}
}
