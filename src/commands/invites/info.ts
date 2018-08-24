import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { GuildMember, User } from 'discord.js';
import moment from 'moment';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	joins,
	members,
	sequelize
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'info',
			aliases: ['showinfo'],
			desc: 'Show info about a specific member',
			usage: '<prefix>info @user',
			info:
				'`@user`:\n' + 'The user for whom you want to see additional info.\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.info))
	@using(resolve('user: User'))
	@using(expect('user: User'))
	@using(localize)
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const sets = await SettingsCache.get(message.guild.id);
		const lang = sets.lang;

		// TODO: Show current rank
		// let ranks = await settings.get('ranks');

		const invs = await inviteCodes.findAll({
			where: {
				guildId: message.guild.id,
				inviterId: user.id
			},
			order: [['uses', 'DESC']],
			include: [
				{
					model: inviteCodeSettings,
					where: {
						guildId: message.guild.id,
						key: InviteCodeSettingsKey.name
					},
					required: false
				}
			],
			raw: true
		});

		const customInvs = await customInvites.findAll({
			where: {
				guildId: message.guild.id,
				memberId: user.id
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		let regular = invs.reduce((acc, inv) => acc + inv.uses, 0);
		let custom = 0;
		let fake = 0;
		let leave = 0;

		let clearRegular = 0;
		let clearCustom = 0;
		let clearFake = 0;
		let clearLeave = 0;
		customInvs.forEach(inv => {
			switch (inv.generatedReason) {
				case CustomInvitesGeneratedReason.clear_regular:
					clearRegular += inv.amount;
					regular += inv.amount;
					break;

				case CustomInvitesGeneratedReason.clear_fake:
					clearFake += inv.amount;
					fake += inv.amount;
					break;

				case CustomInvitesGeneratedReason.fake:
					fake += inv.amount;
					break;

				case CustomInvitesGeneratedReason.clear_leave:
					clearLeave += inv.amount;
					leave += inv.amount;
					break;

				case CustomInvitesGeneratedReason.leave:
					leave += inv.amount;
					break;

				case CustomInvitesGeneratedReason.clear_custom:
					clearCustom += inv.amount;
					custom += inv.amount;
					break;

				default:
					custom += inv.amount;
					break;
			}
		});

		const numTotal = regular + custom + fake + leave;
		const clearTotal = clearRegular + clearCustom + clearFake + clearLeave;

		const embed = createEmbed(this.client);
		embed.setTitle(user.username);

		// Try and get the member if they are still in the guild
		const member: GuildMember = await message.guild.members
			.fetch(user.id)
			.catch(() => undefined);

		if (member) {
			const joinedAgo = moment(member.joinedAt)
				.locale(lang)
				.fromNow();

			embed.addField(rp.CMD_INFO_LASTJOINED_TITLE(), joinedAgo, true);
		} else {
			embed.addField(
				rp.CMD_INFO_LASTJOINED_TITLE(),
				rp.CMD_INFO_LASTJOINED_NOT_IN_GUILD(),
				true
			);
		}

		const joinCount = Math.max(
			await joins.count({
				where: {
					guildId: message.guild.id,
					memberId: user.id
				}
			}),
			0
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
			moment(user.createdAt)
				.locale(lang)
				.fromNow(),
			true
		);

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

		embed.addField(
			rp.CMD_INFO_INVITES_CLEARS_TITLE(),
			rp.CMD_INFO_INVITES_CLEARS_TEXT({
				total: clearTotal,
				regular: clearRegular,
				custom: clearCustom,
				fake: clearFake,
				leave: clearLeave
			}),
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
			invs.slice(0, 10).forEach(inv => {
				const name = (inv as any)['inviteCodeSettings.value'];

				invText +=
					rp.CMD_INFO_REGULARINVITES_ENTRY({
						uses: inv.uses,
						code: name ? name : inv.code,
						name: name ? inv.code : undefined,
						createdAt: moment(inv.createdAt)
							.locale(lang)
							.fromNow()
					}) + '\n';
			});

			let more = '';
			if (invs.length > 10) {
				more =
					'\n' +
					rp.CMD_INFO_REGULARINVITES_MORE({
						amount: invs.length - 10
					});
			}

			embed.addField(rp.CMD_INFO_REGULARINVITES_TITLE(), invText + more);
		} else {
			embed.addField(
				rp.CMD_INFO_REGULARINVITES_TITLE(),
				rp.CMD_INFO_REGULARINVITES_NONE()
			);
		}

		const bonusInvs = customInvs.filter(inv => inv.generatedReason === null);

		if (bonusInvs.length > 0) {
			let customInvText = '';

			bonusInvs.slice(0, 10).forEach(inv => {
				customInvText +=
					rp.CMD_INFO_BONUSINVITES_ENTRY({
						amount: inv.amount,
						creator: inv.creatorId ? inv.creatorId : message.guild.me.id,
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
					rp.CMD_INFO_BONUSINVITES_MORE({
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

			embed.addField(rp.CMD_INFO_BONUSINVITES_TITLE(), text);
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

		return sendReply(message, embed);
	}
}
