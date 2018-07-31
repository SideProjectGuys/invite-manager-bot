import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';
import { FindOptionsAttributesArray, Op } from 'sequelize';

import { IMClient } from '../client';
import {
	customInvites,
	inviteCodes,
	joins,
	LeaderboardStyle,
	leaves,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize,
	settings
} from '../sequelize';
import { SettingsCache } from '../utils/SettingsCache';
import { createEmbed, RP, sendEmbed, showPaginated } from '../utils/util';

const chrono = require('chrono-node');

const { resolve } = Middleware;
const { using, localizable } = CommandDecorators;

const usersPerPage = 10;
const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

type InvCacheType = {
	[x: string]: {
		name: string;
		total: number;
		regular: number;
		custom: number;
		fake: number;
		leaves: number;
		oldTotal: number;
		oldRegular: number;
		oldCustom: number;
		oldFake: number;
		oldLeaves: number;
	};
};

// Extra query stuff we need in multiple places
const sumClearRegular =
	`SUM(` +
	`IF(customInvite.generatedReason = 'clear_regular',` +
	`customInvite.amount,` +
	`0))`;
const sumTotalCustom =
	`SUM(` +
	`IF(customInvite.generatedReason IS NULL OR customInvite.generatedReason = 'clear_custom',` +
	`customInvite.amount,` +
	`0))`;
const sumTotalFake =
	`SUM(` +
	`IF(customInvite.generatedReason = 'fake' OR customInvite.generatedReason = 'clear_fake',` +
	`customInvite.amount,` +
	`0))`;
const sumTotalLeaves =
	`SUM(` +
	`IF(customInvite.generatedReason = 'leave' OR customInvite.generatedReason = 'clear_leave',` +
	`customInvite.amount,` +
	`0))`;

const attrs: FindOptionsAttributesArray = [
	'memberId',
	[sumClearRegular, 'totalClearRegular'],
	[sumTotalCustom, 'totalCustom'],
	[sumTotalFake, 'totalFake'],
	[sumTotalLeaves, 'totalLeaves']
];

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'leaderboard',
			aliases: ['top'],
			desc: 'Show members with most invites.',
			usage: '<prefix>leaderboard (page) (date)',
			info:
				'`page`:\n' +
				'Which page of the leaderboard to get.\n\n' +
				'`date`:\n' +
				'The date (& time) for which the leaderboard is shown\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	@using(resolve('page: Number, ...date?: String'))
	@localizable
	public async action(
		message: Message,
		[rp, _page, _date]: [RP, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let from = moment();
		let to = moment().subtract(1, 'day');
		if (_date) {
			const res = chrono.parse(_date);
			if (!res[0]) {
				await message.channel.send(
					rp.CMD_LEADERBOARD_INVALID_DATE({ date: _date })
				);
				return;
			}
			if (res[0].start) {
				from = moment(res[0].start.date());
				to = from.clone().subtract(1, 'day');
			}
			if (res[0].end) {
				to = moment.min(moment(), moment(res[0].end.date()));
			} else if (!from.isSame(moment(), 'day')) {
				to = moment();
			}
			const min = moment.min(from, to);
			from = moment.max(from, to);
			to = min;
		}

		const guildId = message.guild.id;
		const guildSettings = await SettingsCache.get(message.guild.id);

		const codeInvs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[
					sequelize.literal(
						'SUM(inviteCode.uses) - MAX((SELECT COUNT(joins.id) FROM joins WHERE ' +
							`exactMatchCode = code AND deletedAt IS NULL AND ` +
							`createdAt >= '${from.utc().format('YYYY/MM/DD HH:mm:ss')}'))`
					),
					'totalJoins'
				]
			],
			where: {
				guildId
			},
			group: 'inviteCode.inviterId',
			include: [
				{
					attributes: ['name'],
					model: members,
					as: 'inviter',
					required: true
				}
			],
			order: [sequelize.literal('totalJoins'), 'inviterId'],
			limit: 100,
			raw: true
		});
		const customInvs = await customInvites.findAll({
			attributes: attrs,
			where: {
				guildId,
				createdAt: {
					[Op.lte]: from
				}
			},
			group: 'customInvite.memberId',
			include: [
				{
					attributes: ['name'],
					model: members
				}
			],
			order: [
				sequelize.literal(
					`${sumClearRegular} + ${sumTotalCustom} + ${sumTotalFake} + ${sumTotalLeaves}`
				),
				'memberId'
			],
			limit: 100,
			raw: true
		});

		const invs: InvCacheType = {};
		codeInvs.forEach((inv: any) => {
			const id = inv.inviterId;
			invs[id] = {
				name: inv['inviter.name'],
				total: parseInt(inv.totalJoins, 10),
				regular: parseInt(inv.totalJoins, 10),
				custom: 0,
				fake: 0,
				leaves: 0,
				oldTotal: 0,
				oldRegular: 0,
				oldCustom: 0,
				oldFake: 0,
				oldLeaves: 0
			};
		});
		customInvs.forEach((inv: any) => {
			const id = inv.memberId;
			const clearReg = parseInt(inv.totalClearRegular, 10);
			const custom = parseInt(inv.totalCustom, 10);
			const fake = parseInt(inv.totalFake, 10);
			const lvs = parseInt(inv.totalLeaves, 10);
			if (invs[id]) {
				invs[id].total += custom + clearReg + fake + lvs;
				invs[id].regular += clearReg;
				invs[id].custom = custom;
				invs[id].fake = fake;
				invs[id].leaves = lvs;
			} else {
				invs[id] = {
					name: inv['member.name'],
					total: custom + clearReg + fake + lvs,
					regular: clearReg,
					custom: custom,
					fake: fake,
					leaves: lvs,
					oldTotal: 0,
					oldRegular: 0,
					oldCustom: 0,
					oldFake: 0,
					oldLeaves: 0
				};
			}
		});

		const oldCodeInvs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[
					sequelize.literal(
						'SUM(inviteCode.uses) - MAX((SELECT COUNT(joins.id) FROM joins WHERE ' +
							`exactMatchCode = code AND deletedAt IS NULL AND ` +
							`createdAt >= '${to.utc().format('YYYY/MM/DD HH:mm:ss')}'))`
					),
					'totalJoins'
				]
			],
			where: {
				guildId
			},
			group: 'inviteCode.inviterId',
			include: [
				{
					attributes: ['name'],
					model: members,
					as: 'inviter',
					required: true
				}
			],
			order: [sequelize.literal('totalJoins'), 'inviterId'],
			limit: 100,
			raw: true
		});
		const oldCustomInvs = await customInvites.findAll({
			attributes: attrs,
			where: {
				guildId,
				createdAt: {
					[Op.lte]: to
				}
			},
			group: ['memberId'],
			include: [
				{
					attributes: ['name'],
					model: members
				}
			],
			order: [
				sequelize.literal(
					`${sumClearRegular} + ${sumTotalCustom} + ${sumTotalFake} + ${sumTotalLeaves}`
				),
				'memberId'
			],
			limit: 100,
			raw: true
		});

		oldCodeInvs.forEach((inv: any) => {
			const id = inv.inviterId;
			if (invs[id]) {
				invs[id].oldTotal = parseInt(inv.totalJoins, 10);
				invs[id].oldRegular = parseInt(inv.totalJoins, 10);
			} else {
				invs[id] = {
					name: inv['inviter.name'],
					total: 0,
					regular: 0,
					custom: 0,
					fake: 0,
					leaves: 0,
					oldTotal: parseInt(inv.totalJoins, 10),
					oldRegular: parseInt(inv.totalJoins, 10),
					oldCustom: 0,
					oldFake: 0,
					oldLeaves: 0
				};
			}
		});
		oldCustomInvs.forEach((inv: any) => {
			const id = inv.memberId;
			const clearReg = parseInt(inv.totalClearRegular, 10);
			const custom = parseInt(inv.totalCustom, 10);
			const fake = parseInt(inv.totalFake, 10);
			const lvs = parseInt(inv.totalLeaves, 10);
			if (invs[id]) {
				invs[id].oldTotal += custom + clearReg + fake + lvs;
				invs[id].oldRegular += clearReg;
				invs[id].oldCustom = custom;
				invs[id].oldFake = fake;
				invs[id].oldLeaves = lvs;
			} else {
				invs[id] = {
					name: inv['member.name'],
					total: 0,
					regular: 0,
					custom: 0,
					fake: 0,
					leaves: 0,
					oldTotal: custom + clearReg + fake + lvs,
					oldRegular: clearReg,
					oldCustom: custom,
					oldFake: fake,
					oldLeaves: lvs
				};
			}
		});

		const hidden = (await memberSettings.findAll({
			attributes: ['memberId'],
			where: {
				guildId: message.guild.id,
				key: MemberSettingsKey.hideFromLeaderboard,
				value: 'true'
			},
			raw: true
		})).map(i => i.memberId);

		const rawKeys = Object.keys(invs)
			.filter(k => hidden.indexOf(k) === -1 && invs[k].total > 0)
			.sort((a, b) => {
				const diff = invs[b].total - invs[a].total;
				return diff !== 0
					? diff
					: invs[a].name
						? invs[a].name.localeCompare(invs[b].name)
						: 0;
			});

		const lastJoinAndLeave = await members.findAll({
			attributes: [
				'id',
				'name',
				[sequelize.fn('MAX', sequelize.col('joins.createdAt')), 'lastJoinedAt'],
				[sequelize.fn('MAX', sequelize.col('leaves.createdAt')), 'lastLeftAt']
			],
			where: { id: rawKeys },
			group: ['member.id'],
			include: [
				{
					attributes: [],
					model: joins,
					where: { guildId },
					required: false
				},
				{
					attributes: [],
					model: leaves,
					where: { guildId },
					required: false
				}
			],
			raw: true
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
			stillInServer[jal.id] = moment(jal.lastLeftAt).isBefore(
				moment(jal.lastJoinedAt)
			);
		});

		const hideLeft = guildSettings.hideLeftMembersFromLeaderboard === 'true';
		const keys = rawKeys.filter(
			k => !hideLeft || (message.guild.members.has(k) && stillInServer[k])
		);

		const oldKeys = [...keys].sort((a, b) => {
			const diff = invs[b].oldTotal - invs[a].oldTotal;
			return diff !== 0
				? diff
				: invs[a].name
					? invs[a].name.localeCompare(invs[b].name)
					: 0;
		});

		if (keys.length === 0) {
			const embed = createEmbed(this.client);
			embed.setDescription(rp.CMD_LEADERBOARD_NO_INVITES());
			embed.setTitle(rp.CMD_LEADERBOARD_TITLE());
			sendEmbed(message.channel, embed, message.author);
			return;
		}

		const maxPage = Math.ceil(keys.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		const style: LeaderboardStyle = guildSettings.leaderboardStyle;

		// Show the leaderboard as a paginated list
		showPaginated(this.client, message, p, maxPage, page => {
			const fromText = from.format('YYYY/MM/DD - HH:mm:ss - z');
			const toText = to.format('YYYY/MM/DD - HH:mm:ss - z');

			let str =
				fromText + `\n(${rp.CMD_LEADERBOARD_COMPARED_TO({ to: toText })})\n\n`;

			// Collect texts first to possibly make a table
			const lines: string[][] = [];
			let lengths: number[] = [1, 6, 4, 1, 1, 1, 1];

			if (style === LeaderboardStyle.table) {
				lines.push([
					'#',
					rp.CMD_LEADERBOARD_COL_CHANGE(),
					rp.CMD_LEADERBOARD_COL_NAME(),
					rp.CMD_LEADERBOARD_COL_TOTAL(),
					rp.CMD_LEADERBOARD_COL_REGULAR(),
					rp.CMD_LEADERBOARD_COL_CUSTOM(),
					rp.CMD_LEADERBOARD_COL_FAKE(),
					rp.CMD_LEADERBOARD_COL_LEAVE()
				]);
				lines.push(lines[0].map(h => '-'.repeat(h.length)));
			}

			keys
				.slice(page * usersPerPage, (page + 1) * usersPerPage)
				.forEach((k, i) => {
					const inv = invs[k];
					const pos = page * usersPerPage + i + 1;

					const prevPos = oldKeys.indexOf(k) + 1;
					const posChange = prevPos - i - 1;

					const name =
						style === LeaderboardStyle.mentions && stillInServer[k]
							? `<@${k}>`
							: `${inv.name}`;
					const symbol =
						posChange > 0
							? upSymbol
							: posChange < 0
								? downSymbol
								: neutralSymbol;

					const posText =
						posChange > 0
							? '+' + posChange
							: posChange === 0
								? '--'
								: posChange;

					const line = [
						`${pos}.`,
						`${symbol} (${posText})`,
						name,
						`${inv.total}`,
						`${inv.regular}`,
						`${inv.custom}`,
						`${inv.fake}`,
						`${inv.leaves}`
					];

					lines.push(line);
					lengths.forEach(
						(l, pIndex) =>
							(lengths[pIndex] = Math.max(l, Array.from(line[pIndex]).length))
					);
				});

			// Put string together
			if (style === LeaderboardStyle.table) {
				str += '```';
			}
			lines.forEach(line => {
				if (style === LeaderboardStyle.table) {
					line.forEach((part, partIndex) => {
						str += part + ' '.repeat(lengths[partIndex] - part.length + 2);
					});
				} else if (
					style === LeaderboardStyle.normal ||
					style === LeaderboardStyle.mentions
				) {
					str += rp.CMD_LEADERBOARD_ROW_ENTRY({
						pos: line[0],
						change: line[1],
						name: line[2],
						total: line[3],
						regular: line[4],
						custom: line[5],
						fake: line[6],
						leave: line[7]
					});
				}

				str += '\n';
			});
			if (style === LeaderboardStyle.table) {
				str += '```\n' + rp.CMD_LEADERBOARD_TABLE_LEGEND();
			}

			return createEmbed(this.client)
				.setTitle(rp.CMD_LEADERBOARD_TITLE())
				.setDescription(str);
		});
	}
}
