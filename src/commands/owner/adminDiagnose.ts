import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../../client';
import { checkRoles } from '../../middleware/CheckRoles';
import { guilds } from '../../sequelize';
import { ShardCommand } from '../../types';

const config = require('../../../config.json');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'diagnose',
			aliases: ['diag'],
			desc: 'Remotely diagnose servers',
			usage: '<prefix>diagnose',
			hidden: true
		});
	}

	@using(checkRoles('diagnose'))
	@using(resolve('guild: String'))
	@using(expect('guild: String'))
	public async action(message: Message, [guildId]: [any]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		if (guildId.length < 8 || guildId.indexOf('http') === 0) {
			const inv = await this.client.fetchInvite(guildId);
			guildId = inv.guild.id;
		}

		const guild = await guilds.find({
			where: {
				id: guildId
			}
		});

		const msg = (await message.channel.send(
			'Requesting diagnose info from shard...'
		)) as Message;

		this.client.pendingRabbitMqRequests[message.id] = response => {
			msg.edit(
				`Response from shard \`${shard}\`:\n\n` +
					`**Guild:**\n` +
					`Id: ${guildId}\n` +
					`Added: ${moment(guild.createdAt).fromNow()}\n` +
					'\n\n' +
					`**Settings:**\n` +
					'```json\n' +
					JSON.stringify(response.settings, null, 2) +
					'```\n\n' +
					'**Bot permissions:**\n' +
					'```\n' +
					response.perms.join('\n') +
					'```\n\n' +
					'**Join channel permissions:**\n' +
					'```\n' +
					response.joinChannelPerms.join('\n') +
					'```\n\n' +
					'**Leave channel permissions:**\n' +
					'```\n' +
					response.leaveChannelPerms.join('\n') +
					'```\n\n' +
					'**Rank announcement channel permissions:**\n' +
					'```\n' +
					response.announceChannelPerms.join('\n') +
					'```\n\n' +
					'**Last command usage:**\n' +
					moment(response.lastCmd).fromNow()
			);
		};

		const { shard } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.DIAGNOSE,
			id: message.id,
			guildId,
			originGuildId: message.guild
		});
	}
}
