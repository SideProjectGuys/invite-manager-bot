import { Message } from 'eris';

import { IMClient } from '../../client';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	private readonly allowedCommands: string[] = [
		'leaderboard',
		'invites',
		'bot-info',
		'prefix'
	];

	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.sudo,
			aliases: ['owner-sudo', 'osu'],
			// desc: 'Run commands for another guild',
			guildOnly: true,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[guildId, command]: [any, string],
		{ guild }: Context
	): Promise<any> {
		if (config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		if (guildId.length < 8 || guildId.indexOf('http') === 0) {
			const inv = await this.client.getInvite(
				guildId.replace('https://', '').replace('http://', '')
			);
			guildId = inv.guild.id;
		}

		const args = command.split(' ');
		const cmdName = args[0].toLowerCase();
		const sudoCmd = this.client.cmds.commands.find(c => c.name === cmdName);
		if (!sudoCmd) {
			return this.client.sendReply(
				message,
				'Use one of the following commands: ' +
					this.allowedCommands.map(c => `\`${c}\``).join(', ')
			);
		}
		if (this.allowedCommands.indexOf(sudoCmd.name.toLowerCase()) === -1) {
			return this.client.sendReply(
				message,
				'Use one of the following commands: ' +
					this.allowedCommands.map(c => `\`${c}\``).join(', ')
			);
		}

		this.client.rabbitmq.sendCommandToGuild(
			guildId,
			{
				id: message.id,
				cmd: ShardCommand.SUDO,
				originGuildId: guild.id,
				guildId,
				sudoCmd: sudoCmd.name,
				args: args.slice(1),
				authorId: message.author.id
			},
			response => {
				if (response.error) {
					this.client.sendReply(message, response.error);
				} else {
					this.client.sendReply(message, response.data);
				}
			}
		);
	}
}
