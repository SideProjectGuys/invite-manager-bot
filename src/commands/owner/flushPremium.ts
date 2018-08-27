import { Message } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { StringResolver } from '../../resolvers';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.flushPremium,
			aliases: ['owner-flush-premium', 'ofp'],
			desc: 'Flush premium',
			args: [
				{
					name: 'guildId',
					resolver: StringResolver,
					description: 'The id of the guild to flush.'
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
			return sendReply(this.client, message, 'Invalid guild id ' + guildId);
		}

		const { shard, result } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.FLUSH_PREMIUM_CACHE,
			id: message.id,
			guildId
		});

		if (result) {
			sendReply(
				this.client,
				message,
				`Sent command to flush premium settings for guild ${guildId} to shard ${shard}`
			);
		} else {
			sendReply(this.client, message, `RabbitMQ returned false`);
		}
	}
}
