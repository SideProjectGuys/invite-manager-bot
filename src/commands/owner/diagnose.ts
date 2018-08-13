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
import { createEmbed } from '../../functions/Messaging';
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
			name: 'owner-diagnose',
			aliases: ['ownerDiagnose', 'odiag'],
			desc: 'Remotely diagnose servers',
			usage: '<prefix>owner-diagnose',
			hidden: true
		});
	}

	@using(checkRoles(OwnerCommand.diagnose))
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

		const lastCmd = await commandUsage.find({
			where: {
				guildId
			},
			order: [sequelize.literal('createdAt DESC')],
			limit: 1,
			raw: true
		});

		const sub = await premiumSubscriptions.findOne({
			where: {
				guildId,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			},
			raw: true
		});

		this.client.pendingRabbitMqRequests[message.id] = response => {
			const embed = createEmbed(this.client);

			embed.addField(
				'Guild',
				`Id: ${guildId}\n` +
					`Shard: ${shard}\n` +
					`Added: ${moment(guild.createdAt).fromNow()}`
			);

			embed.addField(
				'Settings',
				'```json\n' +
					JSON.stringify(response.settings, null, 2).substr(0, 1000) +
					'```'
			);

			embed.addField(
				'Bot permissions',
				'```\n' + response.perms.join('\n').substr(0, 1000) + '```'
			);

			embed.addField(
				'Join channel permissions',
				'```\n' + response.joinChannelPerms.join('\n').substr(0, 1000) + '```'
			);

			embed.addField(
				'Leave channel permissions',
				'```\n' + response.leaveChannelPerms.join('\n').substr(0, 1000) + '```'
			);

			embed.addField(
				'Rank announcement channel permissions',
				'```\n' +
					response.announceChannelPerms.join('\n').substr(0, 1000) +
					'```'
			);

			embed.addField(
				'Premium',
				'```json\n' +
					(sub ? JSON.stringify(sub, null, 2).substr(0, 1000) : 'none') +
					'```'
			);

			embed.addField(
				'Last command usage',
				lastCmd ? moment(lastCmd.createdAt).fromNow() : 'never'
			);

			msg.edit(embed);
		};

		const { shard } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.DIAGNOSE,
			id: message.id,
			guildId,
			originGuildId: message.guild.id
		});
	}
}
