import { Message, User } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { EnumResolver, NumberResolver, UserResolver } from '../../resolvers';
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

const ENTRIES_PER_PAGE = 20;

enum InfoDetails {
	bonus = 'bonus',
	members = 'members'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.info,
			aliases: ['showinfo'],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					required: true
				},
				{
					name: 'details',
					resolver: new EnumResolver(client, Object.values(InfoDetails))
				},
				{
					name: 'page',
					resolver: NumberResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user, details, _page]: [User, InfoDetails, number],
		flags: {},
		{ guild, t, settings, me }: Context
	): Promise<any> {
		const lang = settings.lang;

		const embed = this.client.createEmbed({
			title: `${user.username}#${user.discriminator}`
		});

		const invitedMembers = await joins.findAll({
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
					}
				}
			],
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

		const bonusInvs = customInvs.filter(inv => inv.generatedReason === null);

		if (details === InfoDetails.bonus) {
			// Exit if we have no bonus invites
			if (bonusInvs.length <= 0) {
				embed.fields.push({
					name: t('cmd.info.bonusInvites.title'),
					value: t('cmd.info.bonusInvites.more')
				});
			}
			const maxPage = Math.ceil(invitedMembers.length / ENTRIES_PER_PAGE);
			const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

			return this.client.showPaginated(message, p, maxPage, page => {
				let customInvText = '';

				bonusInvs
					.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
					.forEach(inv => {
						customInvText +=
							t('cmd.info.bonusInvites.entry', {
								amount: `**${inv.amount}**`,
								creator: `<@!${inv.creatorId ? inv.creatorId : me.id}>`,
								date:
									'**' +
									moment(inv.createdAt)
										.locale(lang)
										.fromNow() +
									'**',
								reason: inv.reason
									? `**${inv.reason}**`
									: '**' + t('cmd.info.bonusInvites.noReason') + '**'
							}) + '\n';
					});

				embed.description = customInvText;

				return embed;
			});
		} else if (details === InfoDetails.members) {
			// Exit if we have no invited members
			if (invitedMembers.length <= 0) {
				embed.fields.push({
					name: t('cmd.info.invitedMembers.title'),
					value: t('cmd.info.invitedMembers.none')
				});
				return this.client.sendReply(message, embed);
			}

			const maxPage = Math.ceil(invitedMembers.length / ENTRIES_PER_PAGE);
			const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

			return this.client.showPaginated(message, p, maxPage, page => {
				let inviteText = '';
				invitedMembers
					.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
					.forEach((join: any) => {
						const time = moment(join.createdAt)
							.locale(lang)
							.fromNow();
						inviteText += `<@${join.memberId}> - ${time}\n`;
					});

				embed.description = inviteText;

				return embed;
			});
		}

		// TODO: Show current rank
		// let ranks = await settings.get('ranks');

		const invCodes = await inviteCodes.findAll({
			where: {
				guildId: guild.id,
				inviterId: user.id
			},
			order: [['uses', 'DESC']],
			raw: true
		});

		let regular = invCodes.reduce((acc, inv) => acc + inv.uses, 0);
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
				name: t('cmd.info.lastJoined.title'),
				value: joinedAgo,
				inline: true
			});
		} else {
			embed.fields.push({
				name: t('cmd.info.lastJoined.title'),
				value: t('cmd.info.lastJoined.notInGuild'),
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
			name: t('cmd.info.joined.title'),
			value: t('cmd.info.joined.text', {
				amount: joinCount
			}),
			inline: true
		});

		embed.fields.push({
			name: t('cmd.info.created.title'),
			value: moment(user.createdAt)
				.locale(lang)
				.fromNow(),
			inline: true
		});

		embed.fields.push({
			name: t('cmd.info.invites.title'),
			value: t('cmd.info.invites.text', {
				total: numTotal,
				regular,
				custom,
				fake,
				leave
			}),
			inline: true
		});

		embed.fields.push({
			name: t('cmd.info.invites.clear.title'),
			value: t('cmd.info.invites.clear.text', {
				total: clearTotal,
				regular: clearRegular,
				custom: clearCustom,
				fake: clearFake,
				leave: clearLeave
			}),
			inline: true
		});

		const ownJoins = await joins.findAll({
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

		if (ownJoins.length > 0) {
			const joinTimes: { [x: string]: { [x: string]: number } } = {};

			ownJoins.forEach((join: any) => {
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

				const mainText = t('cmd.info.joins.entry.text', {
					total: total >= 1 ? total : undefined,
					time
				});

				const invText = Object.keys(joinTime)
					.map(id =>
						t('cmd.info.joins.entry.invite', {
							member: `<@!${id}>`,
							times: joinTime[id]
						})
					)
					.join(', ');

				joinText += mainText + ' ' + invText + '\n';
			});

			let more = '';
			if (joinTimesKeys.length > 10) {
				more =
					'\n' +
					t('cmd.info.joins.more', {
						amount: `**${joinTimesKeys.length - 10}**`
					});
			}

			embed.fields.push({
				name: t('cmd.info.joins.title'),
				value: joinText + more
			});
		} else {
			embed.fields.push({
				name: t('cmd.info.joins.title'),
				value: t('cmd.info.joins.unknown')
			});
		}

		if (invCodes.length > 0) {
			let invText = '';
			const allSets = await this.client.cache.inviteCodes.get(guild.id);

			for (const inv of invCodes.slice(0, 10)) {
				const sets = allSets.get(inv.code);
				const name =
					sets && sets.name
						? `**${sets.name}** (${inv.code})`
						: `**${inv.code}**`;

				invText +=
					t('cmd.info.regularInvites.entry', {
						uses: `**${inv.uses}**`,
						code: name,
						createdAt:
							'**' +
							moment(inv.createdAt)
								.locale(lang)
								.fromNow() +
							'**'
					}) + '\n';
			}

			let more = '';
			if (invCodes.length > 10) {
				more =
					'\n' +
					t('cmd.info.regularInvites.more', {
						amount: `**${invCodes.length - 10}**`
					});
			}

			embed.fields.push({
				name: t('cmd.info.regularInvites.title'),
				value: invText + more
			});
		} else {
			embed.fields.push({
				name: t('cmd.info.regularInvites.title'),
				value: t('cmd.info.regularInvites.none')
			});
		}

		if (bonusInvs.length > 0) {
			let customInvText = '';

			bonusInvs.slice(0, 10).forEach(inv => {
				customInvText +=
					t('cmd.info.bonusInvites.entry', {
						amount: `**${inv.amount}**`,
						creator: `<@!${inv.creatorId ? inv.creatorId : me.id}>`,
						date:
							'**' +
							moment(inv.createdAt)
								.locale(lang)
								.fromNow() +
							'**',
						reason: inv.reason
							? `**${inv.reason}**`
							: '**' + t('cmd.info.bonusInvites.noReason') + '**'
					}) + '\n';
			});

			let more = '';
			if (bonusInvs.length > 10) {
				more =
					'\n' +
					t('cmd.info.bonusInvites.more', {
						amount: `**${bonusInvs.length - 10}**`
					});
			}

			const detailMsg =
				'\n' +
				t('cmd.info.bonusInvites.details', {
					cmd: `\`${settings.prefix}info @${user.username} bonus\``
				});

			// Crop the text because we don't know how long the 'reasons' are that
			// people added to custom invites, so we have to make sure the text fits.
			let text = customInvText + more + detailMsg;
			const diff = text.length - 1024;
			if (diff > 0) {
				text =
					customInvText.substr(0, customInvText.length - diff - 3) +
					'...' +
					more;
			}

			embed.fields.push({
				name: t('cmd.info.bonusInvites.title'),
				value: text
			});
		} else {
			embed.fields.push({
				name: t('cmd.info.bonusInvites.title'),
				value: t('cmd.info.bonusInvites.none')
			});
		}

		if (invitedMembers.length > 0) {
			let inviteText = '';
			invitedMembers.slice(0, 10).forEach((join: any) => {
				const time = moment(join.createdAt)
					.locale(lang)
					.fromNow();
				inviteText += `<@${join.memberId}> - ${time}\n`;
			});

			let more = '';
			if (invitedMembers.length > 10) {
				more =
					'\n' +
					t('cmd.info.invitedMembers.more', {
						amount: `**${invitedMembers.length - 10}**`
					});
			}

			const detailMsg =
				'\n' +
				t('cmd.info.invitedMembers.details', {
					cmd: `\`${settings.prefix}info @${user.username} members\``
				});

			embed.fields.push({
				name: t('cmd.info.invitedMembers.title'),
				value: inviteText + more + detailMsg
			});
		} else {
			embed.fields.push({
				name: t('cmd.info.invitedMembers.title'),
				value: t('cmd.info.invitedMembers.none')
			});
		}

		this.client.sendReply(message, embed);
	}
}
