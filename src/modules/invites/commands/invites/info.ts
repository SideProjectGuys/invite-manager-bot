import { Message } from 'eris';
import moment from 'moment';
import { Op } from 'sequelize';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { EnumResolver, NumberResolver, UserResolver } from '../../../../framework/resolvers';
import { JoinInvalidatedReason } from '../../../../models/Join';
import { BasicUser, CommandGroup, InvitesCommand } from '../../../../types';

const ENTRIES_PER_PAGE = 20;

enum InfoDetails {
	bonus = 'bonus',
	members = 'members'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.info,
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
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: [
				'!info @User',
				'!info "User with space"',
				'!info @User members',
				'!info @User bonus',
				'!info @User members 4'
			]
		});
	}

	public async action(
		message: Message,
		[user, details, _page]: [BasicUser, InfoDetails, number],
		flags: {},
		{ guild, t, settings, me }: Context
	): Promise<any> {
		const lang = settings.lang;

		const embed = this.createEmbed({
			title: `${user.username}#${user.discriminator}`
		});

		const invitedMembers = await joins.findAll({
			attributes: ['memberId', [sequelize.fn('MAX', sequelize.col('join.createdAt')), 'createdAt']],
			where: {
				guildId: guild.id,
				invalidatedReason: null
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

		const customInvs = await this.client.repo.customInvite.find({
			where: {
				guildId: guild.id,
				memberId: user.id
			},
			order: { createdAt: 'DESC' }
		});

		const bonusInvs = customInvs.filter(ci => !ci.cleared);

		if (details === InfoDetails.bonus) {
			// Exit if we have no bonus invites
			if (bonusInvs.length <= 0) {
				embed.fields.push({
					name: t('cmd.info.bonusInvites.title'),
					value: t('cmd.info.bonusInvites.more')
				});
			}
			const maxPage = Math.ceil(bonusInvs.length / ENTRIES_PER_PAGE);
			const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

			return this.showPaginated(message, p, maxPage, page => {
				let customInvText = '';

				bonusInvs.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE).forEach(inv => {
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
							reason: inv.reason ? `**${inv.reason}**` : '**' + t('cmd.info.bonusInvites.noReason') + '**'
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
				return this.sendReply(message, embed);
			}

			const maxPage = Math.ceil(invitedMembers.length / ENTRIES_PER_PAGE);
			const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

			return this.showPaginated(message, p, maxPage, page => {
				let inviteText = '';
				invitedMembers.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE).forEach((join: any) => {
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

		const invCodes = await this.client.repo.inviteCode.find({
			where: {
				guildId: guild.id,
				inviterId: user.id
			},
			order: { uses: 'DESC' }
		});

		const js = await joins.findAll({
			attributes: ['invalidatedReason', 'cleared', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
			where: {
				guildId: guild.id,
				exactMatchCode: { [Op.in]: invCodes.map(i => i.code) },
				invalidatedReason: { [Op.ne]: null }
			},
			group: ['invalidatedReason', 'cleared'],
			raw: true
		});

		let fake = 0;
		let leave = 0;
		js.forEach((j: any) => {
			if (j.invalidatedReason === JoinInvalidatedReason.fake) {
				if (!j.cleared) {
					fake -= Number(j.total);
				}
			} else if (j.invalidatedReason === JoinInvalidatedReason.leave) {
				if (!j.cleared) {
					leave -= Number(j.total);
				}
			}
		});

		let regular = 0;
		let clearRegular = 0;
		invCodes.forEach(ic => {
			clearRegular += ic.clearedAmount;
			regular += ic.uses - ic.clearedAmount;
		});

		let custom = 0;
		let clearCustom = 0;
		customInvs.forEach(ci => {
			if (ci.cleared) {
				clearCustom += ci.amount;
			} else {
				custom += ci.amount;
			}
		});

		const numTotal = regular + custom + fake + leave;
		const clearTotal = clearRegular + clearCustom;

		// Try and get the member if they are still in the guild
		let member = guild.members.get(user.id);
		if (!member) {
			member = await guild.getRESTMember(user.id).catch(() => undefined);
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
			await this.client.repo.join.count({
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
				custom: clearCustom
			}),
			inline: true
		});

		const ownJoins = await this.client.repo.join.find({
			where: {
				guildId: guild.id,
				memberId: user.id
			},
			relations: ['exactMatch'],
			order: { createdAt: 'DESC' }
		});

		if (ownJoins.length > 0) {
			const joinTimes: { [x: string]: { [x: string]: number } } = {};

			ownJoins.forEach(join => {
				const text = moment(join.createdAt)
					.locale(lang)
					.fromNow();
				if (!joinTimes[text]) {
					joinTimes[text] = {};
				}

				const id = join.exactMatch.inviterId;
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

				const total = Object.keys(joinTime).reduce((acc, id) => acc + joinTime[id], 0);

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
				const name = sets && sets.name ? `**${sets.name}** (${inv.code})` : `**${inv.code}**`;

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
						reason: inv.reason ? `**${inv.reason}**` : '**' + t('cmd.info.bonusInvites.noReason') + '**'
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
					cmd: `\`${settings.prefix}info ${user.id} bonus\``
				});

			// Crop the text because we don't know how long the 'reasons' are that
			// people added to custom invites, so we have to make sure the text fits.
			let text = customInvText + more + detailMsg;
			const diff = text.length - 1024;
			if (diff > 0) {
				text = customInvText.substr(0, customInvText.length - diff - 3) + '...' + more;
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
					cmd: `\`${settings.prefix}info ${user.id} members\``
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

		await this.sendReply(message, embed);
	}
}
