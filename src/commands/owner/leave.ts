import { Message } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { LogAction } from '../../sequelize';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.leave,
			aliases: ['owner-leave', 'ol'],
			args: [
				{
					name: 'guildId',
					resolver: StringResolver
				}
			],
			hidden: true,
			guildOnly: true
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

		this.client.logAction(guild, message, LogAction.owner, {
			type: 'leave-guild',
			guildId
		});

		const msg = await message.channel.createMessage(
			`Sending command to leave guild ${guildId}...`
		);

		const { shard } = this.client.rabbitmq.sendCommandToGuild(
			guildId,
			{
				cmd: ShardCommand.LEAVE_GUILD,
				id: message.id,
				guildId
			},
			() => msg.edit(`Successfully left guild ${guildId}`)
		);

		msg.edit(`Sent command to leave guild ${guildId} to shard ${shard}`);
	}
}
