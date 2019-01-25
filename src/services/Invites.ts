import { Guild, Member, Message, Role, TextChannel } from 'eris';
import moment, { Moment } from 'moment';
import { FindOptionsAttributesArray, Op } from 'sequelize';

import { IMClient } from '../client';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
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
} from '../sequelize';
import { Permissions } from '../types';

type InvCacheType = {
	[x: string]: {
		id: string;
		name: string;
		total: number;
		regular: number;
		custom: number;
		fake: number;
		leave: number;
		oldTotal: number;
		oldRegular: number;
		oldCustom: number;
		oldFake: number;
		oldLeave: number;
	};
};

export interface InviteCounts {
	regular: number;
	custom: number;
	fake: number;
	leave: number;
	total: number;
}

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

export class InvitesService {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public async getInviteCounts(
		guildId: string,
		memberId: string
	): Promise<InviteCounts> {
		const regularPromise = inviteCodes.sum('uses', {
			where: {
				guildId: guildId,
				inviterId: memberId
			}
		});
		const customPromise = customInvites.findAll({
			attributes: [
				'generatedReason',
				[sequelize.fn('SUM', sequelize.col('amount')), 'total']
			],
			where: {
				guildId: guildId,
				memberId: memberId
			},
			group: ['generatedReason'],
			raw: true
		});
		const values = await Promise.all([regularPromise, customPromise]);

		const reg = values[0] || 0;

		const customUser = values[1].find(ci => ci.generatedReason === null) as any;
		const ctm = customUser ? parseInt(customUser.total, 10) : 0;

		const generated: { [x in CustomInvitesGeneratedReason]: number } = {
			[CustomInvitesGeneratedReason.clear_regular]: 0,
			[CustomInvitesGeneratedReason.clear_custom]: 0,
			[CustomInvitesGeneratedReason.clear_fake]: 0,
			[CustomInvitesGeneratedReason.clear_leave]: 0,
			[CustomInvitesGeneratedReason.fake]: 0,
			[CustomInvitesGeneratedReason.leave]: 0
		};

		values[1].forEach((ci: any) => {
			if (ci.generatedReason === null) {
				return;
			}
			const reason = ci.generatedReason as CustomInvitesGeneratedReason;
			const amount = parseInt(ci.total, 10);
			generated[reason] = amount;
		});

		const regular = reg + generated[CustomInvitesGeneratedReason.clear_regular];
		const custom = ctm + generated[CustomInvitesGeneratedReason.clear_custom];
		const fake =
			generated[CustomInvitesGeneratedReason.fake] +
			generated[CustomInvitesGeneratedReason.clear_fake];
		const leave =
			generated[CustomInvitesGeneratedReason.leave] +
			generated[CustomInvitesGeneratedReason.clear_leave];

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
				fake: 0,
				leave: 0,
				oldTotal: 0,
				oldRegular: 0,
				oldCustom: 0,
				oldFake: 0,
				oldLeave: 0
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
				invs[id].leave = lvs;
			} else {
				invs[id] = {
					id,
					name: inv['member.name'],
					total: custom + clearReg + fake + lvs,
					regular: clearReg,
					custom: custom,
					fake: fake,
					leave: lvs,
					oldTotal: 0,
					oldRegular: 0,
					oldCustom: 0,
					oldFake: 0,
					oldLeave: 0
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
						leave: 0,
						oldTotal: parseInt(inv.totalJoins, 10),
						oldRegular: parseInt(inv.totalJoins, 10),
						oldCustom: 0,
						oldFake: 0,
						oldLeave: 0
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
					invs[id].oldLeave = lvs;
				} else {
					invs[id] = {
						id,
						name: inv['member.name'],
						total: 0,
						regular: 0,
						custom: 0,
						fake: 0,
						leave: 0,
						oldTotal: custom + clearReg + fake + lvs,
						oldRegular: clearReg,
						oldCustom: custom,
						oldFake: fake,
						oldLeave: lvs
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
