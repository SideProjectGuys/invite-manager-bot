import { Channel, RichEmbed } from 'discord.js';
import * as moment from 'moment';
import { FindOptionsAttributesArray, Op } from 'sequelize';
import { Command, CommandDecorators, KeyedStorage, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, inviteCodes, joins, leaves, members, sequelize } from '../sequelize';
import { createEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

// Extra attributes for the sequelize queries
const attrs: FindOptionsAttributesArray = [
	'memberId',
	[
		sequelize.fn(
			'sum',
			sequelize.fn('if', sequelize.col('customInvite.generated'), 0, sequelize.col('customInvite.amount'))
		),
		'totalBonus'
	],
	[
		sequelize.fn(
			'sum',
			sequelize.fn('if', sequelize.col('customInvite.generated'), sequelize.col('customInvite.amount'), 0)
		),
		'totalAuto'
	]
];

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'leaderboard',
			aliases: ['top'],
			desc: 'Show members with most invites. You can pass it a channel and only invites in that channel will be counted.',
			usage: '<prefix>leaderboard (#channel)',
			clientPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	@using(resolve('channel: Channel'))
	public async action(message: Message, [channel]: [Channel]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const where: { guildId: string, channelId?: string } = {
			guildId: message.guild.id,
		};
		if (channel) {
			where.channelId = channel.id;
		}

		const codeInvs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
			],
			where,
			group: 'inviteCode.inviterId',
			include: [{
				attributes: ['name'],
				model: members,
				as: 'inviter',
			}],
			raw: true,
		});
		const customInvs = await customInvites.findAll({
			attributes: attrs,
			where: {
				guildId: message.guild.id,
			},
			group: 'customInvite.memberId',
			include: [{
				attributes: ['name'],
				model: members,
			}],
			raw: true,
		});

		const invs: { [x: string]: { name: string, total: number, bonus: number, oldTotal: number, oldBonus: number } } = {};
		codeInvs.forEach((inv: any) => {
			const id = inv.inviterId;
			invs[id] = {
				name: inv['inviter.name'],
				total: parseInt(inv.totalUses, 10),
				bonus: 0,
				oldTotal: 0,
				oldBonus: 0,
			};
		});
		customInvs.forEach((inv: any) => {
			const id = inv.memberId;
			const bonus = parseInt(inv.totalBonus, 10);
			const auto = parseInt(inv.totalAuto, 10);
			if (invs[id]) {
				invs[id].total += bonus + auto;
				invs[id].bonus = bonus;
			} else {
				invs[id] = {
					name: inv['member.name'],
					total: bonus + auto,
					bonus: bonus,
					oldTotal: 0,
					oldBonus: 0,
				};
			}
		});

		const oldCodeInvs = await joins.findAll({
			attributes: [
				[sequelize.fn('COUNT', sequelize.col('join.id')), 'totalJoins'],
			],
			where: {
				guildId: message.guild.id,
				createdAt: {
					[Op.gt]: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
				}
			},
			group: ['exactMatch.inviterId'],
			include: [{
				attributes: ['inviterId'],
				model: inviteCodes,
				as: 'exactMatch',
				include: [{
					attributes: ['name'],
					model: members,
					as: 'inviter',
					required: true,
				}],
				required: true,
			}],
			raw: true,
		});
		const oldBonusInvs = await customInvites.findAll({
			attributes: attrs,
			where: {
				guildId: message.guild.id,
				createdAt: {
					[Op.gt]: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
				}
			},
			group: ['memberId'],
			include: [{
				attributes: ['name'],
				model: members,
			}],
			raw: true,
		});

		oldCodeInvs.forEach((inv: any) => {
			const id = inv['exactMatch.inviterId'];
			if (invs[id]) {
				invs[id].oldTotal = parseInt(inv.totalJoins, 10);
			} else {
				invs[id] = {
					name: inv['exactMatch.inviter.name'],
					total: 0,
					bonus: 0,
					oldTotal: parseInt(inv.totalJoins, 10),
					oldBonus: 0,
				};
			}
		});
		oldBonusInvs.forEach((inv: any) => {
			const id = inv.memberId;
			const bonus = parseInt(inv.totalBonus, 10);
			const auto = parseInt(inv.totalAuto, 10);
			if (invs[id]) {
				invs[id].oldTotal += bonus + auto;
				invs[id].oldBonus = bonus;
			} else {
				invs[id] = {
					name: inv['member.name'],
					total: 0,
					bonus: 0,
					oldTotal: bonus + auto,
					oldBonus: bonus,
				};
			}
		});

		const keys = Object.keys(invs)
			.filter(k => invs[k].total > 0)
			.sort((a, b) => {
				const diff = invs[b].total - invs[a].total;
				return diff !== 0 ? diff : invs[a].name.localeCompare(invs[b].name);
			});

		const leaderboard24hAgo = [...keys].sort((a, b) => {
			const diff = (invs[b].total - invs[b].oldTotal) - (invs[a].total - invs[a].oldTotal);
			return diff !== 0 ? diff : invs[a].name.localeCompare(invs[b].name);
		});

		let str = '(changes compared to 1 day ago)\n\n';

		if (keys.length === 0) {
			str += 'No invites!';
		} else {
			const lastJoinAndLeave = await members.findAll({
				attributes: [
					'id',
					'name',
					[sequelize.fn('MAX', sequelize.col('joins.createdAt')), 'lastJoinedAt'],
					[sequelize.fn('MAX', sequelize.col('leaves.createdAt')), 'lastLeftAt'],
				],
				where: { id: keys },
				group: ['member.id'],
				include: [
					{
						attributes: [],
						model: joins,
						where: { guildId: message.guild.id },
						required: false,
					},
					{
						attributes: [],
						model: leaves,
						where: { guildId: message.guild.id },
						required: false,
					}
				],
				raw: true,
			});
			const stillInServer: { [x: string]: boolean } = {};
			lastJoinAndLeave.forEach((jal: any) => {
				if (!jal.lastLeftAt) {
					stillInServer[jal.id] = true;
					return;
				}
				if (!jal.lastJoinedAt) {
					stillInServer[jal.id] = false;
					return;
				}
				stillInServer[jal.id] = moment(jal.lastLeftAt).isBefore(moment(jal.lastJoinedAt));
			});

			keys.slice(0, 50).forEach((k, i) => {
				const inv = invs[k];

				const pos = i + 1;
				const prevPos = leaderboard24hAgo.indexOf(k) + 1;
				const posChange = (prevPos - i) - 1;

				const name = stillInServer[k] ? `<@${k}>` : inv.name;
				const symbol = posChange > 0 ? upSymbol : (posChange < 0 ? downSymbol : neutralSymbol);

				const posText = posChange > 0 ? '+' + posChange : (posChange === 0 ? '--' : posChange);
				str += `**${pos}.** (${posText}) ${symbol} ${name} **${inv.total}** invites (**${inv.bonus}** bonus)\n`;
			});
		}

		const embed = new RichEmbed().setDescription(str);
		embed.setTitle(`Leaderboard ${channel ? 'for channel <#' + channel.id + '>' : ''}`);
		createEmbed(message.client, embed);

		message.channel.send({ embed });
	}
}
