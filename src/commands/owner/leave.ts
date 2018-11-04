import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { checkProBot } from '../../middleware';
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
			name: 'owner-leave',
			aliases: ['ownerLeave', 'ol'],
			desc: 'Leave server',
			usage: '<prefix>owner-leave <guildID>',
			hidden: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(OwnerCommand.leave))
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

		const msg = (await message.reply(
			`Sending command to leave guild ${guildId}...`
		)) as Message;

		this.client.pendingRabbitMqRequests[message.id] = () =>
			msg.edit(`Successfully left guild ${guildId}`);

		const { shard, result } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.LEAVE_GUILD,
			id: message.id,
			guildId,
			originGuildId: message.guild.id
		});

		msg.edit(`Sent command to leave guild ${guildId} to shard ${shard}`);
	}
}
