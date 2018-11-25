import { Message } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.dm,
			aliases: ['owner-dm', 'odm'],
			args: [
				{
					name: 'userId',
					resolver: StringResolver
				},
				{
					name: 'msg',
					resolver: StringResolver,
					rest: true
				}
			],
			strict: true,
			guildOnly: false,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[userId, msg]: [string, string],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		this.client.rabbitmq.sendCommandToShard(
			1,
			{
				id: message.id,
				cmd: ShardCommand.OWNER_DM,
				userId,
				message: msg
			},
			() => message.addReaction('👍')
		);
	}
}
