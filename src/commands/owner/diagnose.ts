import { Message } from 'eris';
import moment from 'moment';
import { MoreThan } from 'typeorm';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
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

		const lastCmd = await this.repo.cmdUsage.findOne({
			where: {
				guildId
			},
			order: {
				createdAt: 'DESC'
			}
		});

		const sub = await this.repo.premium.findOne({
			where: {
				guildId,
				validUntil: MoreThan(new Date())
			}
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
					this.sendReply(message, response.error);
					return;
				}

				const embed = this.createEmbed({
					description: ''
				});

				embed.fields.push({
					name: 'Guild',
					value: `Id: ${guildId}\n` + `Shard: ${shard}\n`
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
				const permsEmbed = this.createEmbed();

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
