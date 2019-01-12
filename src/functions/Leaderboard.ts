import { Guild } from 'eris';
import moment from 'moment';
import { Op } from 'sequelize';

import {
	customInvites,
	inviteCodes,
	JoinInvalidatedReason,
	joins,
	leaves,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize
} from '../sequelize';

type InvCacheType = {
	[x: string]: {
		id: string;
		name: string;
		total: number;
		regular: number;
		custom: number;
		fakes: number;
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
	from?: moment.Moment,
	compare?: moment.Moment,
	limit: number = null
) {
	const guildId = guild.id;

	/*const fromCond = from
	? `AND createdAt < '${from.utc().format('YYYY/MM/DD HH:mm:ss')}'`
	: '';*/

	const inviteCodePromise = inviteCodes.findAll({
		attributes: [
			'inviterId',
			[sequelize.fn('SUM', sequelize.literal('uses - clearedAmount')), 'total']
		],
		include: [
			{
				attributes: ['name', 'discriminator'],
				model: members,
				as: 'inviter',
				required: true
			}
		],
		where: {
			guildId: guildId,
			uses: { [Op.gt]: sequelize.col('inviteCode.clearedAmount') }
		},
		group: ['inviterId'],
		order: [sequelize.literal('total DESC')],
		raw: true
	});

	const joinsPromise = joins.findAll({
		attributes: [
			'invalidatedReason',
			[sequelize.fn('COUNT', sequelize.col('join.id')), 'total']
		],
		where: {
			guildId,
			invalidatedReason: { [Op.ne]: null },
			cleared: false
		},
		include: [
			{
				attributes: ['code', 'inviterId'],
				model: inviteCodes,
				as: 'exactMatch',
				required: true,
				include: [
					{
						attributes: ['name', 'discriminator'],
						model: members,
						as: 'inviter',
						required: true
					}
				]
			}
		],
		group: ['exactMatch.inviterId', 'invalidatedReason'],
		order: [sequelize.literal('total DESC')],
		raw: true
	});

	const customInvitesPromise = customInvites.findAll({
		attributes: [
			'memberId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'total']
		],
		where: {
			guildId: guildId,
			cleared: false
		},
		include: [
			{
				attributes: ['name', 'discriminator'],
				model: members,
				required: true
			}
		],
		group: ['memberId'],
		order: [sequelize.literal('total DESC')],
		raw: true
	});

	const [invCodes, js, customInvs] = await Promise.all([
		inviteCodePromise,
		joinsPromise,
		customInvitesPromise
	]);

	const invs: InvCacheType = {};
	invCodes.forEach((inv: any) => {
		const id = inv.inviterId;
		invs[id] = {
			id,
			name: inv['inviter.name'],
			total: Number(inv.total),
			regular: Number(inv.total),
			custom: 0,
			fakes: 0,
			leaves: 0,
			oldTotal: 0,
			oldRegular: 0,
			oldCustom: 0,
			oldFake: 0,
			oldLeaves: 0
		};
	});

	js.forEach((join: any) => {
		const id = join['exactMatch.inviterId'];
		let fake = 0;
		let leave = 0;
		if (join.invalidatedReason === JoinInvalidatedReason.fake) {
			fake += Number(join.total);
		} else {
			leave += Number(join.total);
		}
		if (invs[id]) {
			invs[id].total -= fake + leave;
			invs[id].fakes -= fake;
			invs[id].leaves -= leave;
		} else {
			invs[id] = {
				id,
				name: join['exactMatch.inviter.name'],
				total: -(fake + leave),
				regular: 0,
				custom: 0,
				fakes: -fake,
				leaves: -leave,
				oldTotal: 0,
				oldRegular: 0,
				oldCustom: 0,
				oldFake: 0,
				oldLeaves: 0
			};
		}
	});

	customInvs.forEach((inv: any) => {
		const id = inv.memberId;
		const custom = Number(inv.total);
		if (invs[id]) {
			invs[id].total += custom;
			invs[id].custom += custom;
		} else {
			invs[id] = {
				id,
				name: inv['member.name'],
				total: custom,
				regular: 0,
				custom: custom,
				fakes: 0,
				leaves: 0,
				oldTotal: 0,
				oldRegular: 0,
				oldCustom: 0,
				oldFake: 0,
				oldLeaves: 0
			};
		}
	});

	if (compare) {
		/*const oldJoinsPromise = joins.findAll({
			attributes: [
				'invalidatedReason',
				[sequelize.fn('COUNT', sequelize.col('join.id')), 'total']
			],
			where: {
				guildId,
				invalidatedReason: { [Op.ne]: null },
				cleared: false
			},
			include: [
				{
					attributes: ['code', 'inviterId'],
					model: inviteCodes,
					as: 'exactMatch',
					required: true,
					include: [
						{
							attributes: ['name', 'discriminator'],
							model: members,
							as: 'inviter',
							required: true
						}
					]
				}
			],
			group: ['exactMatch.inviterId', 'invalidatedReason'],
			order: [sequelize.literal('total DESC')],
			raw: true
		});

		const oldCustomInvitesPromise = customInvites.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('SUM', sequelize.col('amount')), 'total']
			],
			where: {
				guildId: guildId,
				cleared: false
			},
			include: [
				{
					attributes: ['name', 'discriminator'],
					model: members,
					required: true
				}
			],
			group: ['memberId'],
			order: [sequelize.literal('total DESC')],
			raw: true
		});

		const [oldJs, oldCustomInvs] = await Promise.all([
			oldJoinsPromise,
			oldCustomInvitesPromise
		]);*/
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
