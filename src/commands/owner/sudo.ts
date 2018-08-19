import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { checkRoles } from '../../middleware/CheckRoles';
import {
	commandUsage,
	guilds,
	premiumSubscriptions,
	sequelize
} from '../../sequelize';
import { OwnerCommand, ShardCommand } from '../../types';

const config = require('../../../config.json');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'owner-sudo',
			aliases: ['osu'],
			desc: 'Run commands for another guild',
			usage: '<prefix>owner-sudo command',
			hidden: true
		});
	}

	@using(checkRoles(OwnerCommand.sudo))
	@using(resolve('guild: String, ...command: string'))
	@using(expect('guild: String, ...command: string'))
	public async action(
		message: Message,
		[guildId, command]: [any, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		if (guildId.length < 8 || guildId.indexOf('http') === 0) {
			const inv = await this.client.fetchInvite(
				guildId.replace('https://', '').replace('http://', '')
			);
			guildId = inv.guild.id;
		}

		const args = command.split(' ');
		const cmdName = args[0].toLowerCase();
		const sudoCmd = this.client.commands.resolve(cmdName);
		if (!sudoCmd) {
			return message.channel.send(
				'Use one of the following commands: `leaderboard`, `invites`'
			);
		}
		if (sudoCmd.name !== 'leaderboard' && sudoCmd.name !== 'invites') {
			return message.channel.send(
				'Use one of the following commands: `leaderboard`, `invites`'
			);
		}

		this.client.pendingRabbitMqRequests[message.id] = response => {
			if (response.error) {
				sendReply(message, response.error);
			} else {
				message.channel.send(response.data);
			}
		};

		this.client.sendCommandToGuild(guildId, {
			id: message.id,
			cmd: ShardCommand.SUDO,
			originGuildId: message.guild.id,
			guildId,
			sudoCmd: sudoCmd.name,
			args: args.slice(1),
			authorId: message.author.id
		});
	}
}
