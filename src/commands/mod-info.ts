import { RichEmbed, User } from 'discord.js';
import * as moment from 'moment';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { customInvites, inviteCodes, joins, members, sequelize } from '../sequelize';
import { CommandGroup, createEmbed, getInviteCounts } from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'info',
			aliases: ['showinfo'],
			desc: 'Show info about a specific member',
			usage: '<prefix>info @user',
			info: '`' + '@user  The user for whom you want to see additional info.' + '`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	@using(expect('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		let member = message.guild.members.get(user.id);

		// TODO: Show current rank
		// let ranks = await settings.get('ranks');
		if (member) {
			const invites = await getInviteCounts(member.guild.id, member.id);

			const embed = new RichEmbed().setTitle(member.user.username);

			const joinedAgo = moment(member.joinedAt).fromNow();
			embed.addField('Last joined', joinedAgo, true);
			embed.addField('Invites', invites.total + ` (${invites.custom} bonus)`, true);

			const joinCount = Math.max(
				await joins.count({
					where: {
						guildId: member.guild.id,
						memberId: member.id
					}
				}),
				1
			);
			embed.addField('Joined', `${joinCount} times`, true);

			const js = await joins.findAll({
				attributes: ['createdAt'],
				where: {
					guildId: message.guild.id,
					memberId: user.id
				},
				order: [['createdAt', 'DESC']],
				include: [
					{
						attributes: ['inviterId'],
						model: inviteCodes,
						as: 'exactMatch',
						include: [
							{
								attributes: [],
								model: members,
								as: 'inviter'
							}
						]
					}
				],
				raw: true
			});

			if (js.length > 0) {
				const joinTimes: { [x: string]: { [x: string]: number } } = {};

				js.forEach((join: any) => {
					const text = moment(join.createdAt).fromNow();
					if (!joinTimes[text]) {
						joinTimes[text] = {};
					}

					const id = join['exactMatch.inviterId'];
					if (joinTimes[text][id]) {
						joinTimes[text][id]++;
					} else {
						joinTimes[text][id] = 1;
					}
				});

				const joinText = Object.keys(joinTimes)
					.map(time => {
						const joinTime = joinTimes[time];

						const total = Object.keys(joinTime).reduce((acc, id) => acc + joinTime[id], 0);
						const totalText = total > 1 ? `**${total}** times ` : 'once ';

						const invText = Object.keys(joinTime)
							.map(id => {
								const timesText = joinTime[id] > 1 ? ` (**${joinTime[id]}** times)` : '';
								return `<@${id}>${timesText}`;
							})
							.join(', ');
						return `${totalText}**${time}**, invited by: ${invText}`;
					})
					.join('\n');
				embed.addField('Joins', joinText);
			} else {
				embed.addField('Joins', 'unknown (this only works for new members)');
			}

			const customInvs = await customInvites.findAll({
				where: {
					guildId: member.guild.id,
					memberId: member.id,
					generated: false
				},
				order: [['createdAt', 'DESC']],
				raw: true
			});

			if (customInvs.length > 0) {
				let customInvText = '';
				customInvs.forEach(inv => {
					const reasonText = inv.reason ? `, reason: **${inv.reason}**` : '';
					customInvText += `**${inv.amount}** from <@${inv.creatorId}> ${moment(
						inv.createdAt
					).fromNow()}${reasonText}\n`;
				});
				embed.addField('Bonus invites', customInvText);
			} else {
				embed.addField('Bonus invites', 'This member has received no bonuses so far');
			}

			// invitedByText = 'Could not match inviter (multiple possibilities)';

			/*if (stillOnServerCount === 0 && trackedInviteCount === 0) {
				embed.addField('Invited people still on the server (since bot joined)', 
				`User did not invite any members since this bot joined.`);
			} else {
				embed.addField('Invited people still on the server (since bot joined)', 
				`**${stillOnServerCount}** still here out of **${trackedInviteCount}** invited members.`);
			}*/

			createEmbed(message.client, embed);

			message.channel.send({ embed });
		} else {
			message.channel.send('User is not part of your guild');
		}
	}
}
