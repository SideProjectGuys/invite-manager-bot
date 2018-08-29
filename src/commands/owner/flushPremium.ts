import { Message } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.flushPremium,
			aliases: ['owner-flush-premium', 'ofp'],
			// desc: 'Flush premium',
			args: [
				{
					name: 'guildId',
					resolver: StringResolver
					// description: 'The id of the guild to flush.'
				}
			],
			hidden: true,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		[guildId]: [string],
		{ guild }: Context
	): Promise<any> {
		if (config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		if (isNaN(parseInt(guildId, 10))) {
			return this.client.sendReply(message, 'Invalid guild id ' + guildId);
		}

		const { shard, result } = this.client.rabbitmq.sendCommandToGuild(guildId, {
			cmd: ShardCommand.FLUSH_PREMIUM_CACHE,
			id: message.id,
			guildId
		});

		if (result) {
			this.client.sendReply(
				message,
				`Sent command to flush premium settings for guild ${guildId} to shard ${shard}`
			);
		} else {
			this.client.sendReply(message, `RabbitMQ returned false`);
		}
	}
}
