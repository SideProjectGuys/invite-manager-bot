import { Guild } from '@yamdbf/core';
import moment from 'moment';
import { FindOptionsAttributesArray, Op } from 'sequelize';

import {
	customInvites,
	inviteCodes,
	joins,
	leaves,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize
} from '../sequelize';

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

type InvCacheType = {
	[x: string]: {
		id: string;
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

export async function generateLeaderboard(
	guild: Guild,
	hideLeft?: boolean,
	from: moment.Moment = moment(),
	to?: moment.Moment,
	limit: number = null
) {
	const guildId = guild.id;

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
		order: [sequelize.literal('totalJoins DESC'), 'inviterId'],
		limit,
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
		raw: true
	});

	const invs: InvCacheType = {};
	codeInvs.forEach((inv: any) => {
		const id = inv.inviterId;
		invs[id] = {
			id,
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
				id,
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

	if (to) {
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
			order: [sequelize.literal('totalJoins DESC'), 'inviterId'],
			limit,
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
			raw: true
		});

		oldCodeInvs.forEach((inv: any) => {
			const id = inv.inviterId;
			if (invs[id]) {
				invs[id].oldTotal = parseInt(inv.totalJoins, 10);
				invs[id].oldRegular = parseInt(inv.totalJoins, 10);
			} else {
				invs[id] = {
					id,
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
					id,
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
	}

	const hidden = (await memberSettings.findAll({
		attributes: ['memberId'],
		where: {
			guildId,
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

	const keys = rawKeys.filter(
		k => !hideLeft || (guild.members.has(k) && stillInServer[k])
	);

	const oldKeys = [...keys].sort((a, b) => {
		const diff = invs[b].oldTotal - invs[a].oldTotal;
		return diff !== 0
			? diff
			: invs[a].name
				? invs[a].name.localeCompare(invs[b].name)
				: 0;
	});

	return { keys, oldKeys, invs, stillInServer };
}
