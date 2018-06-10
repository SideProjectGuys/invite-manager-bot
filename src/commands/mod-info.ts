import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';
import moment from 'moment';

import { IMClient } from '../client';
import {
	CustomInviteInstance,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	members,
	sequelize,
	SettingsKey
} from '../sequelize';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { resolve, expect } = Middleware;
const { using, localizable } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'info',
			aliases: ['showinfo'],
			desc: 'Show info about a specific member',
			usage: '<prefix>info @user',
			info:
				'`@user`:\n' + 'The user for whom you want to see additional info.\n\n',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	@using(expect('user: User'))
	@localizable
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let member = message.guild.members.get(user.id);

		if (!member) {
			message.channel.send(rp.CMD_INFO_NOT_IN_GUILD());
			return;
		}

		const lang = await message.guild.storage.settings.get(SettingsKey.lang);

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

		const embed = createEmbed(this.client);
		embed.setTitle(member.user.username);

		const joinedAgo = moment(member.joinedAt)
			.locale(lang)
			.fromNow();
		embed.addField(rp.CMD_INFO_LASTJOINED_TITLE(), joinedAgo, true);
		embed.addField(
			rp.CMD_INFO_INVITES_TITLE(),
			rp.CMD_INFO_INVITES_TEXT({
				total: numTotal,
				regular,
				custom,
				fake,
				leave
			}),
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
		embed.addField(
			rp.CMD_INFO_JOINED_TITLE(),
			rp.CMD_INFO_JOINED_TEXT({
				amount: joinCount
			}),
			true
		);

		embed.addField(
			rp.CMD_INFO_CREATED_TITLE(),
			moment(member.user.createdAt)
				.locale(lang)
				.fromNow(),
			true
		);

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

				const mainText = rp.CMD_INFO_JOINS_ENTRY({
					total: total > 1 ? total : undefined,
					time
				});

				const invText = Object.keys(joinTime)
					.map(id =>
						rp.CMD_INFO_JOINS_ENTRY_INV({
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
					rp.CMD_INFO_JOINS_MORE({
						amount: joinTimesKeys.length - 10
					});
			}

			embed.addField(rp.CMD_INFO_JOINS_TITLE(), joinText + more);
		} else {
			embed.addField(rp.CMD_INFO_JOINS_TITLE(), rp.CMD_INFO_JOINS_UNKNOWN());
		}

		if (invs.length > 0) {
			let invText = '';
			invs.forEach(inv => {
				invText +=
					rp.CMD_INFO_REGULARINVITES_ENTRY({
						uses: inv.uses,
						code: inv.code,
						createdAt: moment(inv.createdAt)
							.locale(lang)
							.fromNow(),
						reason: inv.reason
					}) + '\n';
			});
			embed.addField(rp.CMD_INFO_REGULARINVITES_TITLE(), invText);
		} else {
			embed.addField(
				rp.CMD_INFO_REGULARINVITES_TITLE(),
				rp.CMD_INFO_REGULARINVITES_NONE()
			);
		}

		if (customInvs.length > 0) {
			let customInvText = '';
			customInvs.slice(0, 10).forEach(inv => {
				const reasonText = inv.generatedReason
					? ', ' + this.formatGeneratedReason(rp, inv)
					: inv.reason;

				customInvText +=
					rp.CMD_INFO_BONUSINVITES_ENTRY({
						amount: inv.amount,
						creator: inv.creatorId ? inv.creatorId : message.guild.me.id,
						date: moment(inv.createdAt)
							.locale(lang)
							.fromNow(),
						reason: reasonText
					}) + '\n';
			});

			let more = '';
			if (customInvs.length > 10) {
				more =
					'\n' +
					rp.CMD_INFO_BONUSINVITES_MORE({
						amount: customInvs.length - 10
					});
			}

			embed.addField(rp.CMD_INFO_BONUSINVITES_TITLE(), customInvText + more);
		} else {
			embed.addField(
				rp.CMD_INFO_BONUSINVITES_TITLE(),
				rp.CMD_INFO_BONUSINVITES_NONE()
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
				const time = moment(join.createdAt)
					.locale(lang)
					.fromNow();
				inviteText += `<@${join.memberId}> - ${time}\n`;
			});

			let more = '';
			if (js2.length > 10) {
				more =
					'\n' +
					rp.CMD_INFO_INVITEDMEMBERS_MORE({
						amount: js2.length - 10
					});
			}

			embed.addField(rp.CMD_INFO_INVITEDMEMBERS_TITLE(), inviteText + more);
		} else {
			embed.addField(
				rp.CMD_INFO_INVITEDMEMBERS_TITLE(),
				rp.CMD_INFO_INVITEDMEMBERS_NONE()
			);
		}

		sendEmbed(message.channel, embed, message.author);
	}

	private formatGeneratedReason(rp: RP, inv: CustomInviteInstance) {
		switch (inv.generatedReason) {
			case CustomInvitesGeneratedReason.clear_regular:
				return rp.CUSTOM_INVITES_REASON_CLEAR_REGULAR();

			case CustomInvitesGeneratedReason.clear_custom:
				return rp.CUSTOM_INVITES_REASON_CLEAR_CUSTOM();

			case CustomInvitesGeneratedReason.clear_fake:
				return rp.CUSTOM_INVITES_REASON_CLEAR_FAKE();

			case CustomInvitesGeneratedReason.clear_leave:
				return rp.CUSTOM_INVITES_REASON_CLEAR_LEAVE();

			case CustomInvitesGeneratedReason.fake:
				return rp.CUSTOM_INVITES_REASON_FAKE({ reason: inv.reason });

			case CustomInvitesGeneratedReason.leave:
				return rp.CUSTOM_INVITES_REASON_LEAVE({ reason: inv.reason });

			default:
				return rp.CUSTOM_INVITES_REASON_UNKNOWN();
		}
	}
}
