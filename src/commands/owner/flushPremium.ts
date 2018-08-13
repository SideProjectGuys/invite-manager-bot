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
import { OwnerCommand, ShardCommand } from '../../types';

const config = require('../../../config.json');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'owner-flush-premium',
			aliases: ['ownerFlushPremium', 'ofp'],
			desc: 'Flush premium',
			usage: '<prefix>owner-flush-premium <guildID>',
			hidden: true
		});
	}

	@using(checkRoles(OwnerCommand.flushPremium))
	@using(resolve('guild: String'))
	@using(expect('guild: String'))
	public async action(message: Message, [guildId]: [any]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		if (isNaN(parseInt(guildId, 10))) {
			message.reply('Invalid guild id ' + guildId);
			return;
		}

		const { shard, result } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.FLUSH_PREMIUM_CACHE,
			id: message.id,
			guildId
		});

		if (result) {
			message.reply(
				`Sent command to flush premium settings for guild ${guildId} to shard ${shard}`
			);
		} else {
			message.reply(`RabbitMQ returned false`);
		}
	}
}
