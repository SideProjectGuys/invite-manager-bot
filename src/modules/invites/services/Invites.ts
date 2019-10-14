import { Embed, Guild, Member, Message, Role, TextChannel } from 'eris';
import { Moment } from 'moment';
import moment from 'moment';

import { IMClient } from '../../../client';
import { GuildSettingsKey, RankAssignmentStyle } from '../../../models/GuildSetting';
import { JoinInvalidatedReason } from '../../../models/Join';
import { Rank } from '../../../models/Rank';
import { BasicInvite, BasicMember, GuildPermission } from '../../../types';

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

	public async getInviteCounts(guildId: string, memberId: string): Promise<InviteCounts> {
		const inviteCodePromise = this.client.repo.inviteCode
			.createQueryBuilder()
			.addSelect('SUM(uses - clearedAmount)', 'total')
			.where('guildId = :guildId AND inviterId = :memberId AND uses > clearedAmount', { guildId, memberId })
			.getRawOne();
		const joinsPromise = this.client.repo.join
			.createQueryBuilder('join')
			.addSelect('COUNT(id)', 'total')
			.where('join.guildId = :guildId AND invalidatedReason IS NOT NULL AND cleared = 0', { guildId })
			.leftJoinAndSelect('join.exactMatch', 'exactMatch')
			.andWhere('exactMatch.inviterId = :memberId', { memberId })
			.getRawMany();
		const customInvitesPromise = this.client.repo.customInvite
			.createQueryBuilder()
			.addSelect('SUM(amount)', 'total')
			.where('guildId = :guildId AND memberId = :memberId AND cleared = 0', { guildId, memberId })
			.getRawOne();

		const [invCode, js, customInvs] = await Promise.all([inviteCodePromise, joinsPromise, customInvitesPromise]);

		const regular = Number(invCode.total);
		const custom = Number(customInvs.total);

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

		const inviteCodePromise = this.client.repo.inviteCode
			.createQueryBuilder('inviteCode')
			.select('SUM(inviteCode.uses - inviteCode.clearedAmount)', 'total')
			.addSelect('inviteCode.inviterId', 'inviterId')
			.addSelect('inviter.name', 'inviterName')
			.leftJoinAndSelect('inviteCode.inviter', 'inviter')
			.where('inviteCode.guildId = :guildId AND inviteCode.uses > inviteCode.clearedAmount', { guildId })
			.groupBy('inviteCode.inviterId')
			.orderBy('total', 'DESC')
			.getRawMany();

		const joinsPromise = this.client.repo.join
			.createQueryBuilder('join')
			.select('COUNT(join.id)', 'total')
			.select('exactMatch.inviterId', 'inviterId')
			.select('inviter.name', 'inviterName')
			.select('join.invalidatedReason', 'invalidatedReason')
			.leftJoinAndSelect('join.exactMatch', 'exactMatch')
			.leftJoinAndSelect('exactMatch.inviter', 'inviter')
			.where('join.guildId = :guildId AND join.invalidatedReason IS NOT NULL AND join.cleared = 0', { guildId })
			.groupBy('exactMatch.inviterId')
			.addGroupBy('join.invalidatedReason')
			.orderBy('total', 'DESC')
			.getRawMany();

		const customInvitesPromise = this.client.repo.customInvite
			.createQueryBuilder('customInvite')
			.select('SUM(amount)', 'total')
			.addSelect('customInvite.memberId', 'memberId')
			.addSelect('member.name', 'memberName')
			.leftJoinAndSelect('customInvite.member', 'member')
			.where('customInvite.guildId = :guildId AND customInvite.cleared = 0', { guildId })
			.groupBy('customInvite.memberId')
			.orderBy('total', 'DESC')
			.getRawMany();

		const [invCodes, js, customInvs] = await Promise.all([inviteCodePromise, joinsPromise, customInvitesPromise]);

		const invs: InvCacheType = {};
		invCodes.forEach(inv => {
			const id = inv.inviterId;
			invs[id] = {
				id,
				name: inv.inviterName,
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

		js.forEach(join => {
			const id = join.inviterId;
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
					name: join.inviterName,
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

		customInvs.forEach(inv => {
			const id = inv.memberId;
			const custom = Number(inv.total);
			if (invs[id]) {
				invs[id].total += custom;
				invs[id].custom += custom;
			} else {
				invs[id] = {
					id,
					name: inv.memberName,
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

		const hidden = (await this.client.repo.memberSetting.find({
			where: {
				guildId,
				'JSON_EXTRACT(value, "$.hideFromLeaderboard")': true
			}
		})).map(i => i.memberId);

		const rawKeys = Object.keys(invs)
			.filter(k => hidden.indexOf(k) === -1 && invs[k].total > 0)
			.sort((a, b) => {
				const diff = invs[b].total - invs[a].total;
				return diff !== 0 ? diff : invs[a].name ? invs[a].name.localeCompare(invs[b].name) : 0;
			});

		const lastJoinAndLeave = await this.client.repo.member
			.createQueryBuilder('member')
			.addSelect('MAX(join.createdAt)', 'lastJoinedAt')
			.addSelect('MAX(leave.createdAt)', 'lastLeftAt')
			.leftJoinAndSelect('member.joins', 'join', 'join.guildId = :guildId', { guildId })
			.leftJoinAndSelect('member.leaves', 'leave', 'leave.guildId = :guildId', { guildId })
			.where('member.id IN(:ids)', { ids: rawKeys })
			.groupBy('member.id')
			.getRawMany();

		const stillInServer: { [x: string]: boolean } = {};
		lastJoinAndLeave.forEach(jal => {
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

		const keys = rawKeys.filter(k => !hideLeft || (guild.members.has(k) && stillInServer[k]));

		const oldKeys = [...keys].sort((a, b) => {
			const diff = invs[b].oldTotal - invs[a].oldTotal;
			return diff !== 0 ? diff : invs[a].name ? invs[a].name.localeCompare(invs[b].name) : 0;
		});

		return { keys, oldKeys, invs, stillInServer };
	}

	public async fillJoinLeaveTemplate(
		template: string,
		guild: Guild,
		member: Member,
		invites: InviteCounts,
		{ invite, inviter }: JoinLeaveTemplateData
	): Promise<string | Embed> {
		if (typeof template !== 'string') {
			template = JSON.stringify(template);
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') >= 0) {
			numJoins = await this.client.repo.join.count({
				where: {
					guildId: guild.id,
					memberId: member.id
				}
			});
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await this.client.repo.join.findOne({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: { createdAt: 'ASC' }
			});
			if (temp) {
				firstJoin = moment(temp.createdAt);
			}
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin:') >= 0) {
			const temp = await this.client.repo.join.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: { createdAt: 'DESC' },
				skip: 1,
				take: 1
			});
			if (temp) {
				prevJoin = moment(temp[0].createdAt);
			}
		}

		const memberFullName = member.user.username + '#' + member.user.discriminator;
		const inviterFullName = inviter.user.username + '#' + inviter.user.discriminator;

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

	public async promoteIfQualified(guild: Guild, member: Member, me: Member, totalInvites: number) {
		let nextRankName = '';
		let nextRank: Rank = null;

		const settings = await this.client.cache.settings.get(guild.id);
		const style = settings.rankAssignmentStyle;

		const allRanks = await this.client.cache.ranks.get(guild.id);

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
			if (role && (!myRole || myRole.position < role.position)) {
				myRole = role;
			}
		});

		const tooHighRoles = guild.roles.filter(r => r.position > myRole.position);

		let shouldHave: Role[] = [];
		let shouldNotHave = notReached.filter(r => tooHighRoles.includes(r) && member.roles.includes(r.id));

		if (highest && !member.roles.includes(highest.id)) {
			const rankChannelId = settings.rankAnnouncementChannel;
			if (rankChannelId) {
				const rankChannel = guild.channels.get(rankChannelId) as TextChannel;

				// Check if it's a valid channel
				if (rankChannel) {
					const rankMessageFormat = settings.rankAnnouncementMessage;
					if (rankMessageFormat) {
						const msg = await this.client.msg.fillTemplate(guild, rankMessageFormat, {
							memberId: member.id,
							memberName: member.user.username,
							memberFullName: member.user.username + '#' + member.user.discriminator,
							memberMention: `<@${member.id}>`,
							memberImage: member.user.avatarURL,
							rankMention: `<@&${highest.id}>`,
							rankName: highest.name,
							totalInvites: totalInvites.toString()
						});
						rankChannel
							.createMessage(typeof msg === 'string' ? msg : { embed: msg })
							.then((m: Message) => m.addReaction('🎉'))
							.catch(() => undefined);
					}
				} else {
					console.error(`Guild ${guild.id} has invalid ` + `rank announcement channel ${rankChannelId}`);
					await this.client.cache.settings.setOne(guild.id, GuildSettingsKey.rankAnnouncementChannel, null);
				}
			}
		}

		if (me.permission.has(GuildPermission.MANAGE_ROLES)) {
			// No matter what the rank assignment style is
			// we always want to remove any roles that we don't have
			notReached
				.filter(r => !tooHighRoles.includes(r) && member.roles.includes(r.id))
				.forEach(r =>
					this.client
						.removeGuildMemberRole(guild.id, member.id, r.id, 'Not have enough invites for rank')
						.catch(() => undefined)
				);

			// Filter dangerous roles
			dangerous = reached.filter(
				r => r.permissions.has(GuildPermission.ADMINISTRATOR) || r.permissions.has(GuildPermission.MANAGE_GUILD)
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
					.forEach(r =>
						this.client
							.addGuildMemberRole(guild.id, member.user.id, r.id, 'Reached a new rank by invites')
							.catch(() => undefined)
					);
			} else if (style === RankAssignmentStyle.highest) {
				// Only add the highest role we've reached to the member
				// Remove roles that we've reached but aren't the highest
				const oldRoles = reached.filter(r => r !== highest && member.roles.includes(r.id));
				// Add more roles that we shouldn't have
				shouldNotHave = shouldNotHave.concat(oldRoles.filter(r => tooHighRoles.includes(r)));
				// Remove the old ones from the member
				oldRoles
					.filter(r => !tooHighRoles.includes(r))
					.forEach(r =>
						this.client
							.removeGuildMemberRole(guild.id, member.id, r.id, 'Only keeping highest rank')
							.catch(() => undefined)
					);
				// Add the highest one if we don't have it yet
				if (highest && !member.roles.includes(highest.id)) {
					if (!tooHighRoles.includes(highest)) {
						this.client
							.addGuildMemberRole(guild.id, member.id, highest.id, 'Reached a new rank by invites')
							.catch(() => undefined);
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
