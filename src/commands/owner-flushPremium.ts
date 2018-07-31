import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../client';

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
	public async action(message: Message, [guildID]: [string]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		// tslint:disable-next-line
		let targetShardId = (parseInt(guildID, 10) >>> 22) % this.client.options.shardCount;

		const rabbitMqPrefix = this.client.config.rabbitmq.prefix ? `${this.client.config.rabbitmq.prefix}-` : '';
		const queueName = `${rabbitMqPrefix}cmds-${targetShardId}-${this.client.options.shardCount}`;
		const payload = {
			cmd: 'FLUSH_PREMIUM_CACHE',
			args: [guildID]
		};
		const success = this.client.channelCmds.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
		if (success) {
			message.reply(`Sent command to flush premium settings for guild ${guildID} to shard ${targetShardId}`);
		} else {
			message.reply(`RabbitMQ returned false`);
		}
	}
}
