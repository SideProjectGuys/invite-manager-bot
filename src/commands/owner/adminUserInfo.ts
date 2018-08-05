import {
	Client,
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'adminUserInfo',
			aliases: ['admin-user-info', 'aui'],
			desc: 'Get info about a user and his servers',
			usage: '<prefix>adminUserInfo @user',
			ownerOnly: true,
			hidden: true
		});
	}

	@using(resolve('user: User'))
	@using(expect('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		if (!user) {
			message.reply(`Could not find user`);
			return;
		} else {
			message.reply(`Command not implemented yet`);
		}

		// TODO: Show where this user is owner
		// TODO: Show where this user is member
	}
}
