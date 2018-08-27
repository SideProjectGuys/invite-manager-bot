import { Message } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.dm,
			aliases: ['owner-dm', 'odm'],
			desc: 'Send a DM to a user',
			args: [
				{
					name: 'userId',
					resolver: StringResolver,
					description: 'The id of the user.'
				},
				{
					name: 'msg',
					resolver: StringResolver,
					description: 'The message to send to the user'
				}
			],
			guildOnly: false,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[userId, msg]: [string, string],
		{ guild }: Context
	): Promise<any> {
		if (config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		this.client.rabbitmq.pendingRabbitMqRequests.set(message.id, response => {
			if (response.ok) {
				message.addReaction('👍');
			} else {
				message.addReaction('👎');
				this.client.sendReply(
					message,
					`ERROR ${response.code}: ${response.message}`
				);
			}
		});

		this.client.rabbitmq.sendCommandToShard(1, {
			id: message.id,
			type: 'OWNER_DM',
			message: msg
		});
	}
}
