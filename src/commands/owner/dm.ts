import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'dm',
			aliases: ['senddm'],
			desc: 'Send a DM to a user',
			usage: '<prefix>dm',
			ownerOnly: true,
			hidden: true
		});
	}

	@using(resolve('userId: string, ...msg: String'))
	@using(expect('userId: string, ...msg: String'))
	public async action(
		message: Message,
		[userId, msg]: [string, string]
	): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

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
