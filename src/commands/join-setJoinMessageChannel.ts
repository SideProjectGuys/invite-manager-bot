import { Channel } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { EStrings } from '../enums';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'set-join-message-channel',
			aliases: ['setjoinmessagechannel'],
			desc: 'Sets the channel where join messages are sent',
			usage: '<prefix>set-join-message-channel #channel',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('channel: Channel'))
	public async action(message: Message, [channel]: [Channel]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		if (channel) {
			message.guild.storage.settings.set(EStrings.JOIN_MESSAGE_CHANNEL, channel.id);
			message.reply(`Join messages will now be sent to channel <#${channel.id}>!`);
		} else {
			message.guild.storage.settings.remove(EStrings.JOIN_MESSAGE_CHANNEL);
			message.reply(`No channel set, so no join messages will be sent.`);
		}
	}
}
