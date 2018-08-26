import { Message, User } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	members,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { UserResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.info,
			aliases: ['showinfo'],
			desc: 'Show info about a specific member',
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					description: 'The user for whom you want to see additional info.'
				}
			],
			// clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [User],
		{ guild, t, settings, me }: Context
	): Promise<any> {
		const lang = settings.lang;

		// TODO: Show current rank
		// let ranks = await settings.get('ranks');

		const invs = await inviteCodes.findAll({
			where: {
				guildId: guild.id,
				inviterId: user.id
			},
			order: [['uses', 'DESC']],
			raw: true
		});

		const customInvs = await customInvites.findAll({
			where: {
				guildId: guild.id,
				memberId: user.id
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		let regular = invs.reduce((acc, inv) => acc + inv.uses, 0);
		let custom = 0;
		let fake = 0;
		let leave = 0;

		customInvs.forEach(inv => {
			switch (inv.generatedReason) {
				case CustomInvitesGeneratedReason.clear_regular:
					regular += inv.amount;
					break;

				case CustomInvitesGeneratedReason.fake:
				case CustomInvitesGeneratedReason.clear_fake:
					fake += inv.amount;
					break;

				case CustomInvitesGeneratedReason.leave:
				case CustomInvitesGeneratedReason.clear_leave:
					leave += inv.amount;
					break;

				// 'clear_custom' and 'null' case:
				default:
					custom += inv.amount;
					break;
			}
		});

		const numTotal = regular + custom + fake + leave;

		const embed = createEmbed(this.client, {
			title: user.username
		});

		// Try and get the member if they are still in the guild
		let member = guild.members.get(user.id);
		if (!member) {
			member = await guild.getRESTMember(user.id);
		}

		if (member) {
			const joinedAgo = moment(member.joinedAt)
				.locale(lang)
				.fromNow();

			embed.fields.push({
				name: t('CMD_INFO_LASTJOINED_TITLE'),
				value: joinedAgo,
				inline: true
			});
		} else {
			embed.fields.push({
				name: t('CMD_INFO_LASTJOINED_TITLE'),
				value: t('CMD_INFO_LASTJOINED_NOT_IN_GUILD'),
				inline: true
			});
		}

		const joinCount = Math.max(
			await joins.count({
				where: {
					guildId: guild.id,
					memberId: user.id
				}
			}),
			0
		);

		embed.fields.push({
			name: t('CMD_INFO_JOINED_TITLE'),
			value: t('CMD_INFO_JOINED_TEXT', {
				amount: joinCount
			}),
			inline: true
		});

		embed.fields.push({
			name: t('CMD_INFO_CREATED_TITLE'),
			value: moment(user.createdAt)
				.locale(lang)
				.fromNow(),
			inline: true
		});

		embed.fields.push({
			name: t('CMD_INFO_INVITES_TITLE'),
			value: t('CMD_INFO_INVITES_TEXT', {
				total: numTotal,
				regular,
				custom,
				fake,
				leave
			}),
			inline: true
		});

		const js = await joins.findAll({
			attributes: ['createdAt'],
			where: {
				guildId: guild.id,
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
				const text = moment(join.createdAt)
					.locale(lang)
					.fromNow();
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

				const mainText = t('CMD_INFO_JOINS_ENTRY', {
					total: total > 1 ? total : undefined,
					time
				});

				const invText = Object.keys(joinTime)
					.map(id =>
						t('CMD_INFO_JOINS_ENTRY_INV', {
							id,
							times: joinTime[id] > 1 ? joinTime[id] : undefined
						})
					)
					.join(', ');

				joinText += mainText + ' ' + invText;
			});

			let more = '';
			if (joinTimesKeys.length > 10) {
				more =
					'\n' +
					t('CMD_INFO_JOINS_MORE', {
						amount: joinTimesKeys.length - 10
					});
			}

			embed.fields.push({
				name: t('CMD_INFO_JOINS_TITLE'),
				value: joinText + more
			});
		} else {
			embed.fields.push({
				name: t('CMD_INFO_JOINS_TITLE'),
				value: t('CMD_INFO_JOINS_UNKNOWN')
			});
		}

		if (invs.length > 0) {
			let invText = '';
			invs.slice(0, 10).forEach(inv => {
				invText +=
					t('CMD_INFO_REGULARINVITES_ENTRY', {
						uses: inv.uses,
						code: inv.code,
						createdAt: moment(inv.createdAt)
							.locale(lang)
							.fromNow(),
						reason: inv.reason
					}) + '\n';
			});

			let more = '';
			if (invs.length > 10) {
				more =
					'\n' +
					t('CMD_INFO_REGULARINVITES_MORE', {
						amount: invs.length - 10
					});
			}

			embed.fields.push({
				name: t('CMD_INFO_REGULARINVITES_TITLE'),
				value: invText + more
			});
		} else {
			embed.fields.push({
				name: t('CMD_INFO_REGULARINVITES_TITLE'),
				value: t('CMD_INFO_REGULARINVITES_NONE')
			});
		}

		const bonusInvs = customInvs.filter(inv => inv.generatedReason === null);

		if (bonusInvs.length > 0) {
			let customInvText = '';

			bonusInvs.slice(0, 10).forEach(inv => {
				customInvText +=
					t('CMD_INFO_BONUSINVITES_ENTRY', {
						amount: inv.amount,
						creator: inv.creatorId ? inv.creatorId : me.id,
						date: moment(inv.createdAt)
							.locale(lang)
							.fromNow(),
						reason: inv.reason
					}) + '\n';
			});

			let more = '';
			if (bonusInvs.length > 10) {
				more =
					'\n' +
					t('CMD_INFO_BONUSINVITES_MORE', {
						amount: bonusInvs.length - 10
					});
			}

			// Crop the text because we don't know how long the 'reasons' are that
			// people added to custom invites, so we have to make sure the text fits.
			let text = customInvText + more;
			const diff = text.length - 1024;
			if (diff > 0) {
				text =
					customInvText.substr(0, customInvText.length - diff - 3) +
					'...' +
					more;
			}

			embed.fields.push({
				name: t('CMD_INFO_BONUSINVITES_TITLE'),
				value: text
			});
		} else {
			embed.fields.push({
				name: t('CMD_INFO_BONUSINVITES_TITLE'),
				value: t('CMD_INFO_BONUSINVITES_NONE')
			});
		}

		const js2 = await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('MAX', sequelize.col('join.createdAt')), 'createdAt']
			],
			where: {
				guildId: guild.id
			},
			group: [sequelize.col('memberId')],
			order: [sequelize.literal('MAX(join.createdAt) DESC')],
			include: [
				{
					attributes: [],
					model: inviteCodes,
					as: 'exactMatch',
					where: {
						inviterId: user.id
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
				const time = moment(join.createdAt)
					.locale(lang)
					.fromNow();
				inviteText += `<@${join.memberId}> - ${time}\n`;
			});

			let more = '';
			if (js2.length > 10) {
				more =
					'\n' +
					t('CMD_INFO_INVITEDMEMBERS_MORE', {
						amount: js2.length - 10
					});
			}

			embed.fields.push({
				name: t('CMD_INFO_INVITEDMEMBERS_TITLE'),
				value: inviteText + more
			});
		} else {
			embed.fields.push({
				name: t('CMD_INFO_INVITEDMEMBERS_TITLE'),
				value: t('CMD_INFO_INVITEDMEMBERS_NONE')
			});
		}

		return sendReply(this.client, message, embed);
	}
}
