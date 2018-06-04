import { RichEmbed, User } from 'discord.js';
import * as moment from 'moment';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import {
	CustomInviteInstance,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	members,
	sequelize
} from '../sequelize';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'info',
			aliases: ['showinfo'],
			desc: 'Show info about a specific member',
			usage: '<prefix>info @user',
			info:
				'`' + '@user  The user for whom you want to see additional info.' + '`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	@using(expect('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let member = message.guild.members.get(user.id);

		if (!member) {
			message.channel.send('User is not part of your guild');
			return;
		}

		// TODO: Show current rank
		// let ranks = await settings.get('ranks');

		const invs = await inviteCodes.findAll({
			where: {
				guildId: member.guild.id,
				inviterId: member.id
			},
			order: [['uses', 'DESC']],
			raw: true
		});

		const customInvs = await customInvites.findAll({
			where: {
				guildId: member.guild.id,
				memberId: member.id
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		const numCustom = customInvs
			.filter(i => i.generatedReason === null)
			.reduce((acc, inv) => acc + inv.amount, 0);
		const numClear = customInvs
			.filter(
				i => i.generatedReason === CustomInvitesGeneratedReason.clear_invites
			)
			.reduce((acc, inv) => acc + inv.amount, 0);
		const numFake = customInvs
			.filter(i => i.generatedReason === CustomInvitesGeneratedReason.fake)
			.reduce((acc, inv) => acc + inv.amount, 0);
		const numLeaves = customInvs
			.filter(i => i.generatedReason === CustomInvitesGeneratedReason.leave)
			.reduce((acc, inv) => acc + inv.amount, 0);

		const numRegular = invs.reduce((acc, inv) => acc + inv.uses, 0);
		const numRegularClear = Math.max(-numRegular, numClear);
		const numCustomClear = numClear - numRegularClear;

		const numTotal = numRegular + numCustom + numClear + numFake + numLeaves;

		const embed = createEmbed(this.client);
		embed.setTitle(member.user.username);

		const joinedAgo = moment(member.joinedAt).fromNow();
		embed.addField('Last joined', joinedAgo, true);
		embed.addField(
			'Invites',
			`**${numTotal}** (**${numRegular + numRegularClear}** regular, ` +
				`**${numCustom + numCustomClear}** bonus, **${numFake}** fake, ` +
				`**${numLeaves}** leaves)`,
			true
		);

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

		embed.addField('Created', moment(member.user.createdAt).fromNow(), true);

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

			let joinText = '';
			const joinTimesKeys = Object.keys(joinTimes);
			joinTimesKeys.slice(0, 10).forEach(time => {
				const joinTime = joinTimes[time];

				const total = Object.keys(joinTime).reduce(
					(acc, id) => acc + joinTime[id],
					0
				);
				const totalText = total > 1 ? `**${total}** times ` : 'once ';

				const invText = Object.keys(joinTime)
					.map(id => {
						const timesText =
							joinTime[id] > 1 ? ` (**${joinTime[id]}** times)` : '';
						return `<@${id}>${timesText}`;
					})
					.join(', ');
				joinText += `${totalText}**${time}**, invited by: ${invText}\n`;
			});
			embed.addField(
				'Joins',
				joinText +
					(joinTimesKeys.length > 10
						? `\nPlus another **${joinTimesKeys.length - 10}** more joins`
						: '')
			);
		} else {
			embed.addField('Joins', 'unknown (this only works for new members)');
		}

		if (invs.length > 0) {
			let invText = '';
			invs.forEach(inv => {
				const reasonText = inv.reason ? `, reason: **${inv.reason}**` : '';
				invText += `**${inv.uses}** from **${inv.code}** - created **${moment(
					inv.createdAt
				).fromNow()}${reasonText}**\n`;
			});
			embed.addField('Regular invites', invText);
		} else {
			embed.addField(
				'Regular invites',
				'This member has not invited anyone so far'
			);
		}

		if (customInvs.length > 0) {
			let customInvText = '';
			customInvs.slice(0, 10).forEach(inv => {
				const reasonText = inv.generatedReason
					? ', ' + this.formatGeneratedReason(inv)
					: inv.reason
						? `, reason: **${inv.reason}**`
						: '';

				const dateText = moment(inv.createdAt).fromNow();
				const creator = inv.creatorId ? inv.creatorId : message.guild.me.id;
				customInvText +=
					`**${inv.amount}** from <@${creator}> -` +
					` **${dateText}**${reasonText}\n`;
			});
			embed.addField(
				'Bonus invites',
				customInvText +
					(customInvs.length > 10
						? `\nPlus another **${customInvs.length - 10}** more bonus invites`
						: '')
			);
		} else {
			embed.addField(
				'Bonus invites',
				'This member has received no bonuses so far'
			);
		}

		const js2 = await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('MAX', sequelize.col('join.createdAt')), 'createdAt']
			],
			where: {
				guildId: message.guild.id
			},
			group: [sequelize.col('memberId')],
			order: [sequelize.literal('MAX(join.createdAt) DESC')],
			include: [
				{
					attributes: [],
					model: inviteCodes,
					as: 'exactMatch',
					where: {
						inviterId: member.id
					},
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

		if (js2.length > 0) {
			let inviteText = '';
			js2.slice(0, 10).forEach((join: any) => {
				const time = moment(join.createdAt).fromNow();
				inviteText += `<@${join.memberId}> - ${time}\n`;
			});

			embed.addField(
				'Invited members',
				inviteText +
					(js2.length > 10
						? `\nPlus another **${js2.length - 10}** more members`
						: '')
			);
		} else {
			embed.addField(
				'Invited members',
				'This member has not invited anyone else so far'
			);
		}

		sendEmbed(message.channel, embed, message.author);
	}

	private formatGeneratedReason(inv: CustomInviteInstance) {
		if (inv.generatedReason === CustomInvitesGeneratedReason.clear_invites) {
			return '!clear-invites command';
		} else if (inv.generatedReason === CustomInvitesGeneratedReason.fake) {
			return `Fake invites from <@${inv.reason}>`;
		}
		return '<Unknown reason>';
	}
}
