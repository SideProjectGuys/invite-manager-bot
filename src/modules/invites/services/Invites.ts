import { Embed, Guild, Member, Message, Role, TextChannel } from 'eris';
import { Moment } from 'moment';
import moment = require('moment');
import { FindOptionsAttributesArray, Op } from 'sequelize';

import { IMClient } from '../../../client';
import {
	customInvites,
	inviteCodes,
	JoinInvalidatedReason,
	joins,
	leaves,
	members,
	memberSettings,
	MemberSettingsKey,
	RankAssignmentStyle,
	RankInstance,
	ranks,
	sequelize,
	SettingsKey
} from '../../../sequelize';
import { BasicInvite, BasicMember, Permissions } from '../../../types';

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
		fakes: number;
		leaves: number;
		oldTotal: number;
		oldRegular: number;
		oldCustom: number;
		oldFakes: number;
		oldLeaves: number;
	};
};

export interface JoinLeaveTemplateData {
	invite: BasicInvite;
	inviter: BasicMember;
	invites?: InviteCounts;
}

export interface InviteCounts {
	regular: number;
	custom: number;
	fake: number;
	leave: number;
	total: number;
}

export class InvitesService {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public async getInviteCounts(
		guildId: string,
		memberId: string
	): Promise<InviteCounts> {
		const inviteCodePromise = inviteCodes.findOne({
			attributes: [
				[
					sequelize.fn('SUM', sequelize.literal('uses - clearedAmount')),
					'total'
				]
			],
			where: {
				guildId: guildId,
				inviterId: memberId,
				uses: { [Op.gt]: sequelize.col('inviteCode.clearedAmount') }
			},
			raw: true
		});
		const joinsPromise = joins.findAll({
			attributes: [
				'invalidatedReason',
				[sequelize.fn('COUNT', sequelize.col('id')), 'total']
			],
			where: {
				guildId,
				invalidatedReason: { [Op.ne]: null },
				cleared: false
			},
			include: [
				{
					attributes: [],
					model: inviteCodes,
					as: 'exactMatch',
					required: true,
					where: { inviterId: memberId }
				}
			],
			group: ['invalidatedReason'],
			raw: true
		});
		const customInvitesPromise = customInvites.findOne({
			attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
			where: {
				guildId: guildId,
				memberId: memberId,
				generatedReason: null,
				cleared: false
			},
			raw: true
		});

		const [invCode, js, customInvs] = await Promise.all([
			inviteCodePromise,
			joinsPromise,
			customInvitesPromise
		]);

		const regular = Number((invCode as any).total);
		const custom = Number((customInvs as any).total);

		let fake = 0;
		let leave = 0;
		js.forEach((j: any) => {
			if (j.invalidatedReason === JoinInvalidatedReason.fake) {
				fake -= Number(j.total);
			} else if (j.invalidatedReason === JoinInvalidatedReason.leave) {
				leave -= Number(j.total);
			}
		});

		return {
			regular,
			custom,
			fake,
			leave,
			total: regular + custom + fake + leave
		};
	}

	public async generateLeaderboard(
		guild: Guild,
		hideLeft?: boolean,
		from?: Moment,
		compare?: Moment,
		limit: number = null
	) {
		const guildId = guild.id;

		/*const fromCond = from
		? `AND createdAt < '${from.utc().format('YYYY/MM/DD HH:mm:ss')}'`
		: '';*/

		const inviteCodePromise = inviteCodes.findAll({
			attributes: [
				'inviterId',
				[
					sequelize.fn('SUM', sequelize.literal('uses - clearedAmount')),
					'total'
				]
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
					attributes: ['inviterId'],
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
				generatedReason: null,
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
				oldFakes: 0,
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
					oldFakes: 0,
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
					oldFakes: 0,
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

	public async fillJoinLeaveTemplate(
		template: any,
		guild: Guild,
		member: Member,
		{ invite, inviter, invites }: JoinLeaveTemplateData
	): Promise<string | Embed> {
		if (!invites) {
			if (
				template.indexOf('{numInvites}') >= 0 ||
				template.indexOf('{numRegularInvites}') >= 0 ||
				template.indexOf('{numBonusInvites}') >= 0 ||
				template.indexOf('{numFakeInvites}') >= 0 ||
				template.indexOf('{numLeaveInvites}') >= 0
			) {
				invites = await this.client.invs.getInviteCounts(
					guild.id,
					inviter.user.id
				);
			} else {
				invites = {
					custom: 0,
					fake: 0,
					leave: 0,
					regular: 0,
					total: 0
				};
			}
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') >= 0) {
			numJoins = await joins.count({
				where: {
					guildId: guild.id,
					memberId: member.id
				}
			});
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'ASC']]
			});
			if (temp) {
				firstJoin = moment(temp.createdAt);
			}
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'DESC']],
				offset: 1
			});
			if (temp) {
				prevJoin = moment(temp.createdAt);
			}
		}

		const memberFullName =
			member.user.username + '#' + member.user.discriminator;
		const inviterFullName =
			inviter.user.username + '#' + inviter.user.discriminator;

		let memberName = member.nick ? member.nick : member.user.username;
		const encodedMemberName = JSON.stringify(memberName);
		memberName = encodedMemberName.substring(1, encodedMemberName.length - 1);

		let invName = inviter.nick ? inviter.nick : inviter.user.username;
		const encodedInvName = JSON.stringify(invName);
		invName = encodedInvName.substring(1, encodedInvName.length - 1);

		const joinedAt = moment(member.joinedAt);
		const createdAt = moment(member.user.createdAt);

		return this.client.msg.fillTemplate(
			guild,
			template,
			{
				inviteCode: invite.code,
				memberId: member.id,
				memberName: memberName,
				memberFullName: memberFullName,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarURL,
				numJoins: `${numJoins}`,
				inviterId: inviter.user.id,
				inviterName: invName,
				inviterFullName: inviterFullName,
				inviterMention: `<@${inviter.user.id}>`,
				inviterImage: inviter.user.avatarURL,
				numInvites: `${invites.total}`,
				numRegularInvites: `${invites.regular}`,
				numBonusInvites: `${invites.custom}`,
				numFakeInvites: `${invites.fake}`,
				numLeaveInvites: `${invites.leave}`,
				memberCount: `${guild.memberCount}`,
				channelMention: `<#${invite.channel.id}>`,
				channelName: invite.channel.name
			},
			{
				memberCreated: createdAt,
				firstJoin: firstJoin,
				previousJoin: prevJoin,
				joinedAt: joinedAt
			}
		);
	}

	public async generateLegacyLeaderboard(
		guild: Guild,
		hideLeft?: boolean,
		from: Moment = moment(),
		to?: Moment,
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
				fakes: 0,
				leaves: 0,
				oldTotal: 0,
				oldRegular: 0,
				oldCustom: 0,
				oldFakes: 0,
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
				invs[id].fakes = fake;
				invs[id].leaves = lvs;
			} else {
				invs[id] = {
					id,
					name: inv['member.name'],
					total: custom + clearReg + fake + lvs,
					regular: clearReg,
					custom: custom,
					fakes: fake,
					leaves: lvs,
					oldTotal: 0,
					oldRegular: 0,
					oldCustom: 0,
					oldFakes: 0,
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
						fakes: 0,
						leaves: 0,
						oldTotal: parseInt(inv.totalJoins, 10),
						oldRegular: parseInt(inv.totalJoins, 10),
						oldCustom: 0,
						oldFakes: 0,
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
					invs[id].oldFakes = fake;
					invs[id].oldLeaves = lvs;
				} else {
					invs[id] = {
						id,
						name: inv['member.name'],
						total: 0,
						regular: 0,
						custom: 0,
						fakes: 0,
						leaves: 0,
						oldTotal: custom + clearReg + fake + lvs,
						oldRegular: clearReg,
						oldCustom: custom,
						oldFakes: fake,
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

	public async promoteIfQualified(
		guild: Guild,
		member: Member,
		me: Member,
		totalInvites: number
	) {
		let nextRankName = '';
		let nextRank: RankInstance = null;

		const settings = await this.client.cache.settings.get(guild.id);
		const style = settings.rankAssignmentStyle;

		const allRanks = await ranks.findAll({
			where: {
				guildId: guild.id
			},
			raw: true
		});

		// Return early if we don't have any ranks so we do not
		// get any permission issues for MANAGE_ROLES
		if (allRanks.length === 0) {
			return;
		}

		let highest: Role = null;
		let dangerous: Role[] = [];
		let reached: Role[] = [];
		const notReached: Role[] = [];

		allRanks.forEach(r => {
			const role = guild.roles.get(r.roleId);
			if (role) {
				if (r.numInvites <= totalInvites) {
					reached.push(role);
					if (!highest || highest.position < role.position) {
						highest = role;
					}
				} else {
					notReached.push(role);
					// Rank requires more invites
					if (!nextRank || r.numInvites < nextRank.numInvites) {
						// Next rank is the one with lowest invites needed
						nextRank = r;
						nextRankName = role.name;
					}
				}
			} else {
				console.log('ROLE DOES NOT EXIST');
			}
		});

		let myRole: Role;
		me.roles.forEach(r => {
			const role = guild.roles.get(r);
			if (!myRole || myRole.position < role.position) {
				myRole = role;
			}
		});

		const tooHighRoles = guild.roles.filter(r => r.position > myRole.position);

		let shouldHave: Role[] = [];
		let shouldNotHave = notReached.filter(
			r => tooHighRoles.includes(r) && member.roles.includes(r.id)
		);

		// No matter what the rank assignment style is
		// we always want to remove any roles that we don't have
		notReached
			.filter(r => !tooHighRoles.includes(r) && member.roles.includes(r.id))
			.forEach(r =>
				member.removeRole(r.id, 'Not have enough invites for rank')
			);

		if (highest && !member.roles.includes(highest.id)) {
			const rankChannelId = settings.rankAnnouncementChannel;
			if (rankChannelId) {
				const rankChannel = guild.channels.get(rankChannelId) as TextChannel;

				// Check if it's a valid channel
				if (rankChannel) {
					const rankMessageFormat = settings.rankAnnouncementMessage;
					if (rankMessageFormat) {
						const msg = await this.client.msg.fillTemplate(
							guild,
							rankMessageFormat,
							{
								memberId: member.id,
								memberName: member.user.username,
								memberFullName:
									member.user.username + '#' + member.user.discriminator,
								memberMention: `<@${member.id}>`,
								memberImage: member.user.avatarURL,
								rankMention: `<@&${highest.id}>`,
								rankName: highest.name,
								totalInvites: totalInvites.toString()
							}
						);
						rankChannel
							.createMessage(typeof msg === 'string' ? msg : { embed: msg })
							.then((m: Message) => m.addReaction('🎉'));
					}
				} else {
					console.error(
						`Guild ${guild.id} has invalid ` +
							`rank announcement channel ${rankChannelId}`
					);
					this.client.cache.settings.setOne(
						guild.id,
						SettingsKey.rankAnnouncementChannel,
						null
					);
				}
			}
		}

		if (me.permission.has(Permissions.MANAGE_ROLES)) {
			// Filter dangerous roles
			dangerous = reached.filter(
				r =>
					r.permissions.has(Permissions.ADMINISTRATOR) ||
					r.permissions.has(Permissions.MANAGE_GUILD)
			);
			reached = reached.filter(r => dangerous.indexOf(r) === -1);

			if (style === RankAssignmentStyle.all) {
				// Add all roles that we've reached to the member
				const newRoles = reached.filter(r => !member.roles.includes(r.id));
				// Roles that the member should have but we can't assign
				shouldHave = newRoles.filter(r => tooHighRoles.includes(r));
				// Assign only the roles that we can assign
				newRoles
					.filter(r => !tooHighRoles.includes(r))
					.forEach(r => member.addRole(r.id, 'Reached a new rank by invites'));
			} else if (style === RankAssignmentStyle.highest) {
				// Only add the highest role we've reached to the member
				// Remove roles that we've reached but aren't the highest
				const oldRoles = reached.filter(
					r => r !== highest && member.roles.includes(r.id)
				);
				// Add more roles that we shouldn't have
				shouldNotHave = shouldNotHave.concat(
					oldRoles.filter(r => tooHighRoles.includes(r))
				);
				// Remove the old ones from the member
				oldRoles
					.filter(r => !tooHighRoles.includes(r))
					.forEach(r => member.removeRole(r.id, 'Only keeping highest rank'));
				// Add the highest one if we don't have it yet
				if (highest && !member.roles.includes(highest.id)) {
					if (!tooHighRoles.includes(highest)) {
						member.addRole(highest.id, 'Reached a new rank by invites');
					} else {
						shouldHave = [highest];
					}
				}
			}
		} else {
			// TODO: Notify user about the fact that he deserves a promotion, but it
			// cannot be given to him because of missing permissions
		}

		return {
			numRanks: allRanks.length,
			nextRank,
			nextRankName,
			shouldHave,
			shouldNotHave,
			dangerous
		};
	}
}
