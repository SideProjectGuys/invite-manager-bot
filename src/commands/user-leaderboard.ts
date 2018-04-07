import { Channel, RichEmbed } from 'discord.js';
import { FindOptionsAttributesArray, Op } from 'sequelize';
import { Command, CommandDecorators, KeyedStorage, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, inviteCodes, joins, members, sequelize } from '../sequelize';
import { createEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

// Extra attributes for the sequelize queries
const attrs: FindOptionsAttributesArray = [
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
				[sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
			],
			where,
			group: 'inviteCode.inviterId',
			include: [{ model: members, as: 'inviter' }]
		});
		const customInvs = await customInvites.findAll({
			attributes: attrs,
			where: {
				guildId: message.guild.id,
			},
			group: 'customInvite.memberId',
			include: [members]
		});

		const invs: { [x: string]: { name: string, total: number, bonus: number, oldTotal: number, oldBonus: number } } = {};
		codeInvs.forEach(inv => {
			const id = inv.inviter.id;
			invs[id] = {
				name: inv.inviter.name,
				total: parseInt(inv.get('totalUses'), 10),
				bonus: 0,
				oldTotal: 0,
				oldBonus: 0,
			};
		});
		customInvs.forEach(inv => {
			const id = inv.member.id;
			const bonus = parseInt(inv.get('totalBonus'), 10);
			const auto = parseInt(inv.get('totalAuto'), 10);
			if (invs[id]) {
				invs[id].total += bonus + auto;
				invs[id].bonus = bonus;
			} else {
				invs[id] = {
					name: inv.member.name,
					total: bonus + auto,
					bonus: bonus,
					oldTotal: 0,
					oldBonus: 0,
				};
			}
		});

		const oldCodeInvs = await joins.findAll({
			attributes: [
				[sequelize.fn('COUNT', sequelize.col('join.id')), 'totalJoins']
			],
			where: {
				guildId: message.guild.id,
				createdAt: {
					[Op.gt]: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
				}
			},
			group: ['exactMatch.code', 'exactMatch.inviterId'],
			include: [{
				attributes: ['inviterId'],
				model: inviteCodes,
				as: 'exactMatch',
				include: [{
					attributes: ['name'],
					model: members,
					as: 'inviter'
				}]
			}],
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
			include: [members]
		});

		oldCodeInvs.forEach(inv => {
			const id = inv.exactMatch.inviter.id;
			if (invs[id]) {
				invs[id].oldTotal = parseInt(inv.get('totalJoins'), 10);
			} else {
				invs[id] = {
					name: inv.exactMatch.inviter.name,
					total: 0,
					bonus: 0,
					oldTotal: parseInt(inv.get('totalJoins'), 10),
					oldBonus: 0,
				};
			}
		});
		oldBonusInvs.forEach(inv => {
			const id = inv.member.id;
			const bonus = parseInt(inv.get('totalBonus'), 10);
			const auto = parseInt(inv.get('totalAuto'), 10);
			if (invs[id]) {
				invs[id].oldTotal += bonus + auto;
				invs[id].oldBonus = bonus;
			} else {
				invs[id] = {
					name: inv.member.name,
					total: 0,
					bonus: 0,
					oldTotal: bonus + auto,
					oldBonus: bonus,
				};
			}
		});

		const keys = Object.keys(invs)
			.filter(k => invs[k].total > 0)
			.sort((a, b) => invs[b].total - invs[a].total);

		const leaderboard24hAgo = [...keys].sort(
			(a, b) => (invs[b].total - invs[b].oldTotal) - (invs[a].total - invs[a].oldTotal));

		let str = '(changes compared to 1 day ago)\n\n';

		if (keys.length === 0) {
			str += 'No invites!';
		} else {
			keys.slice(0, 50).forEach((k, i) => {
				const inv = invs[k];

				const pos = i + 1;
				const prevPos = leaderboard24hAgo.indexOf(k) + 1;
				const posChange = (prevPos - i) - 1;

				const symbol = posChange > 0 ? upSymbol : (posChange < 0 ? downSymbol : neutralSymbol);

				const posText = posChange > 0 ? '+' + posChange : (posChange === 0 ? '--' : posChange);
				str += `**${pos}.** (${posText}) ${symbol} <@${k}> **${inv.total}** invites (**${inv.bonus}** bonus)\n`;
			});
		}

		const embed = new RichEmbed().setDescription(str);
		embed.setTitle(`Leaderboard ${channel ? 'for channel <#' + channel.id + '>' : ''}`);
		createEmbed(message.client, embed);

		message.channel.send({ embed });
	}
}
