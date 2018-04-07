import { Channel } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

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

		message.reply(`This command has moved! Use \`!config joinMessageChannel #channel\` instead.`);
	}
}
