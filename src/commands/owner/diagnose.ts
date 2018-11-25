import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import {
	commandUsage,
	guilds,
	premiumSubscriptions,
	sequelize
} from '../../sequelize';
import { OwnerCommand, ShardCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.diagnose,
			aliases: ['owner-diagnose', 'odiag'],
			// desc: 'Remotely diagnose servers',
			args: [
				{
					name: 'guildId',
					resolver: StringResolver
					// description: 'The id of the guild to diagnose.'
				}
			],
			strict: true,
			hidden: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[guildId]: [any],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		if (guildId.length < 8 || guildId.indexOf('http') === 0) {
			const inv = await this.client.getInvite(
				guildId.replace('https://', '').replace('http://', '')
			);
			guildId = inv.guild.id;
		}

		const msg = await message.channel.createMessage(
			`Requesting diagnose info for ${guildId}...`
		);

		const guildInfo = await guilds.findById(guildId);

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

		const { shard } = this.client.rabbitmq.sendCommandToGuild(
			guildId,
			{
				cmd: ShardCommand.DIAGNOSE,
				id: message.id,
				guildId
			},
			response => {
				if (response.error) {
					this.client.sendReply(message, response.error);
					return;
				}

				const embed = this.client.createEmbed({
					description: ''
				});

				embed.fields.push({
					name: 'Guild',
					value:
						`Id: ${guildId}\n` +
						`Name: ${guildInfo.name}\n` +
						`Members: ${guildInfo.memberCount}` +
						`Inserted: ${moment(guildInfo.createdAt).fromNow()}` +
						`Shard: ${shard}\n`
				});

				const sets: { [x: string]: string } = {};
				Object.keys(response.settings).forEach(key => {
					if (typeof response.settings[key] === 'string') {
						sets[key] = response.settings[key].substr(0, 200);
					} else {
						sets[key] = response.settings[key];
					}
				});
				embed.fields.push({
					name: 'Owner',
					value:
						'```json\n' +
						JSON.stringify(response.owner, null, 2).substr(0, 1000) +
						'```'
				});
				embed.fields.push({
					name: 'Settings',
					value:
						'```json\n' + JSON.stringify(sets, null, 2).substr(0, 1000) + '```'
				});

				embed.fields.push({
					name: 'Premium',
					value:
						'```json\n' +
						(sub ? JSON.stringify(sub, null, 2).substr(0, 1000) : 'none') +
						'```'
				});

				embed.fields.push({
					name: 'Last command usage',
					value: lastCmd ? moment(lastCmd.createdAt).fromNow() : 'never'
				});

				msg.edit({ embed }).catch(e => msg.edit(e));

				// Send second message with permissions info
				const permsEmbed = this.client.createEmbed();

				permsEmbed.fields.push({
					name: 'Bot permissions',
					value:
						'```json\n' +
						JSON.stringify(response.perms, null, 2).substr(0, 1000) +
						'```'
				});

				permsEmbed.fields.push({
					name: 'Join channel permissions',
					value:
						'```json\n' +
						JSON.stringify(response.joinChannelPerms, null, 2).substr(0, 1000) +
						'```'
				});

				permsEmbed.fields.push({
					name: 'Leave channel permissions',
					value:
						'```json\n' +
						JSON.stringify(response.leaveChannelPerms, null, 2).substr(
							0,
							1000
						) +
						'```'
				});

				permsEmbed.fields.push({
					name: 'Rank announcement channel permissions',
					value:
						'```json\n' +
						JSON.stringify(response.announceChannelPerms, null, 2).substr(
							0,
							1000
						) +
						'```'
				});

				message.channel
					.createMessage({ embed: permsEmbed })
					.catch(e => message.channel.createMessage(e));
			}
		);
	}
}
