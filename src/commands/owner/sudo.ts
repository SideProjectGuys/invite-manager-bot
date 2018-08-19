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
import {
	commandUsage,
	guilds,
	premiumSubscriptions,
	sequelize
} from '../../sequelize';
import { BotCommand, OwnerCommand } from '../../types';

const config = require('../../../config.json');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'sudo',
			aliases: ['su'],
			desc: 'Run commands for another guild',
			usage: '<prefix>sudo command',
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

		console.log(command);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		if (guildId.length < 8 || guildId.indexOf('http') === 0) {
			const inv = await this.client.fetchInvite(
				guildId.replace('https://', '').replace('http://', '')
			);
			guildId = inv.guild.id;
		}

		const g = this.client.guilds.get(guildId);
		if (!g) {
			return message.channel.send('Invalid guild');
		}

		(message as any).__guild = g;

		const args = command.split(' ');
		const cmdName = args[0].toLowerCase();

		if (cmdName !== BotCommand.leaderboard && cmdName !== BotCommand.invites) {
			return message.channel.send(
				'Use one of the following commands: `leaderboard`, `invites`'
			);
		}

		let cmd = this.client.commands.resolve(cmdName);
		cmd.action(message, args.slice(1));
	}
}
