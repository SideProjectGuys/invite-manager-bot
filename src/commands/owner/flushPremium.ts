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
			name: 'ownerFlushPremium',
			aliases: ['owner-flush-premium', 'ofp'],
			desc: 'Flush premium',
			usage: '<prefix>ownerFlushPremium <guildID>',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			ownerOnly: true,
			hidden: true
		});
	}

	@using(resolve('guild: String'))
	@using(expect('guild: String'))
	public async action(message: Message, [_guildId]: [string]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		const guildId = parseInt(_guildId, 10);
		if (isNaN(guildId)) {
			message.reply('Invalid guild id ' + _guildId);
			return;
		}

		// tslint:disable-next-line
		const shardId = ((guildId >>> 22) % this.client.options.shardCount) + 1;
		const shardCount = this.client.options.shardCount;

		const rabbitMqPrefix = this.client.config.rabbitmq.prefix
			? `${this.client.config.rabbitmq.prefix}-`
			: '';
		const queueName = `${rabbitMqPrefix}cmds-${shardId}-${shardCount}`;
		const payload = {
			cmd: 'FLUSH_PREMIUM_CACHE',
			args: [guildId]
		};
		const success = this.client.channelCmds.sendToQueue(
			queueName,
			Buffer.from(JSON.stringify(payload))
		);
		if (success) {
			message.reply(
				`Sent command to flush premium settings for guild ${guildId} to shard ${shardId}`
			);
		} else {
			message.reply(`RabbitMQ returned false`);
		}
	}
}
