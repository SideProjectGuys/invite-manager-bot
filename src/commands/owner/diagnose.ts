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
import { createEmbed, sendReply } from '../../functions/Messaging';
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
			const inv = await this.client.fetchInvite(
				guildId.replace('https://', '').replace('http://', '')
			);
			guildId = inv.guild.id;
		}

		const msg = (await message.channel.send(
			'Requesting diagnose info...'
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
			if (response.error) {
				sendReply(message, response.error);
				return;
			}

			const embed = createEmbed(this.client);
			embed.setDescription('');

			embed.addField('Guild', `Id: ${guildId}\n` + `Shard: ${shard}\n`);

			const sets: { [x: string]: string } = {};
			Object.keys(response.settings).forEach(key => {
				if (typeof response.settings[key] === 'string') {
					sets[key] = response.settings[key].substr(0, 200);
				} else {
					sets[key] = response.settings[key];
				}
			});

			embed.addField(
				'Owner',
				'```json\n' +
					JSON.stringify(response.owner, null, 2).substr(0, 1000) +
					'```'
			);

			embed.addField(
				'Settings',
				'```json\n' + JSON.stringify(sets, null, 2).substr(0, 1000) + '```'
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

			msg.edit(embed).catch(e => msg.edit(e));

			// Send second message with permissions info
			let permsEmbed = createEmbed(this.client);

			permsEmbed.addField(
				'Bot permissions',
				'```\n' + response.perms.join('\n').substr(0, 1000) + '```'
			);

			permsEmbed.addField(
				'Join channel permissions',
				'```\n' + response.joinChannelPerms.join('\n').substr(0, 1000) + '```'
			);

			permsEmbed.addField(
				'Leave channel permissions',
				'```\n' + response.leaveChannelPerms.join('\n').substr(0, 1000) + '```'
			);

			permsEmbed.addField(
				'Rank announcement channel permissions',
				'```\n' +
					response.announceChannelPerms.join('\n').substr(0, 1000) +
					'```'
			);

			message.channel.send(permsEmbed).catch(e => message.channel.send(e));
		};

		const { shard } = this.client.sendCommandToGuild(guildId, {
			cmd: ShardCommand.DIAGNOSE,
			id: message.id,
			guildId,
			originGuildId: message.guild.id
		});
	}
}
