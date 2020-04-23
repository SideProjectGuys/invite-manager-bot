import { Embed, Guild, Member, Message, Role, TextChannel } from 'eris';
import moment from 'moment';

import { GuildSettingsCache } from '../../framework/cache/GuildSettings';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { DatabaseService, TABLE as BASE_TABLE } from '../../framework/services/Database';
import { MessagingService } from '../../framework/services/Messaging';
import { IMService } from '../../framework/services/Service';
import { BasicInvite, BasicMember, GuildPermission } from '../../types';
import { RanksCache } from '../cache/RanksCache';
import { CustomInvite } from '../models/CustomInvite';
import { InvitesGuildSettings, RankAssignmentStyle } from '../models/GuildSettings';
import { Join, JoinInvalidatedReason } from '../models/Join';
import { Leave } from '../models/Leave';
import { Rank } from '../models/Rank';

enum TABLE {
	customInvites = '`customInvites`',
	joins = '`joins`',
	leaves = '`leaves`'
}

export interface LeaderboardEntry {
	id: string;
	name: string;
	discriminator: string;
	total: number;
	regular: number;
	custom: number;
	fakes: number;
	leaves: number;
}

export interface JoinLeaveTemplateData {
	guild: Guild;
	member: Member;
	invites: InviteCounts;
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

export class InvitesService extends IMService {
	@Service() private db: DatabaseService;
	@Service() private msg: MessagingService;
	@Cache() private guildSettingsCache: GuildSettingsCache;
	@Cache() private ranksCache: RanksCache;

	public async getInviteCounts(guildId: string, memberId: string): Promise<InviteCounts> {
		const inviteCodePromise = this.db.getInviteCodeTotalForMember(guildId, memberId);
		const joinsPromise = this.getInvalidatedJoinsForMember(guildId, memberId);
		const customInvitesPromise = this.getCustomInviteTotalForMember(guildId, memberId);

		const [regular, js, custom] = await Promise.all([inviteCodePromise, joinsPromise, customInvitesPromise]);

		let fake = 0;
		let leave = 0;
		js.forEach((j) => {
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

	public async generateLeaderboard(guildId: string) {
		const inviteCodePromise = this.db.getInviteCodesForGuild(guildId);
		const joinsPromise = this.getJoinsForGuild(guildId);
		const customInvitesPromise = this.getCustomInvitesForGuild(guildId);

		// TODO: This is typed as "any" because of a typescript bug https://github.com/microsoft/TypeScript/issues/34925
		const [invCodes, js, customInvs]: [any[], any[], any[]] = await Promise.all([
			inviteCodePromise,
			joinsPromise,
			customInvitesPromise
		]);

		const entries: Map<string, LeaderboardEntry> = new Map();
		invCodes.forEach((inv) => {
			const id = inv.id;
			entries.set(id, {
				id,
				name: inv.name,
				discriminator: inv.discriminator,
				total: Number(inv.total),
				regular: Number(inv.total),
				custom: 0,
				fakes: 0,
				leaves: 0
			});
		});

		js.forEach((join) => {
			const id = join.id;
			let fake = 0;
			let leave = 0;
			if (join.invalidatedReason === JoinInvalidatedReason.fake) {
				fake += Number(join.total);
			} else {
				leave += Number(join.total);
			}
			const entry = entries.get(id);
			if (entry) {
				entry.total -= fake + leave;
				entry.fakes -= fake;
				entry.leaves -= leave;
			} else {
				entries.set(id, {
					id,
					name: join.name,
					discriminator: join.discriminator,
					total: -(fake + leave),
					regular: 0,
					custom: 0,
					fakes: -fake,
					leaves: -leave
				});
			}
		});

		customInvs.forEach((inv) => {
			const id = inv.id;
			const custom = Number(inv.total);
			const entry = entries.get(id);
			if (entry) {
				entry.total += custom;
				entry.custom += custom;
			} else {
				entries.set(id, {
					id,
					name: inv.name,
					discriminator: inv.discriminator,
					total: custom,
					regular: 0,
					custom: custom,
					fakes: 0,
					leaves: 0
				});
			}
		});

		return [...entries.entries()]
			.filter(([k, entry]) => entry.total > 0)
			.sort(([, a], [, b]) => {
				const diff = b.total - a.total;
				return diff !== 0 ? diff : a.name ? a.name.localeCompare(b.name) : 0;
			})
			.map(([, e]) => e);
	}

	public async fillJoinLeaveTemplate(
		template: string,
		{ guild, member, invites, invite, inviter }: JoinLeaveTemplateData
	): Promise<string | Embed> {
		if (typeof template !== 'string') {
			template = JSON.stringify(template);
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') >= 0) {
			numJoins = await this.getTotalJoinsForMember(guild.id, member.id);
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await this.getFirstJoinForMember(guild.id, member.id);
			if (temp) {
				firstJoin = moment(temp.createdAt);
			}
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin:') >= 0) {
			const temp = await this.getPreviousJoinForMember(guild.id, member.id);
			if (temp) {
				prevJoin = moment(temp.createdAt);
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

		return this.msg.fillTemplate(
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
				channelMention: invite.channel ? `<#${invite.channel.id}>` : '',
				channelName: invite.channel ? invite.channel.name : ''
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

		const settings = await this.guildSettingsCache.get<InvitesGuildSettings>(guild.id);
		const style = settings.rankAssignmentStyle;

		const allRanks = await this.ranksCache.get(guild.id);

		// Return early if we don't have any ranks so we do not
		// get any permission issues for MANAGE_ROLES
		// or if we're trying to promote a bot
		if (allRanks.length === 0 || member.bot) {
			return;
		}

		let highest: Role = null;
		let dangerous: Role[] = [];
		let reached: Role[] = [];
		const notReached: Role[] = [];

		for (const rank of allRanks) {
			const role = guild.roles.get(rank.roleId);

			if (!role) {
				console.log(`ROLE ${rank.roleId} FOR RANK DOES NOT EXIST IN GUILD ${rank.guildId}`);
				continue;
			}

			if (rank.numInvites <= totalInvites) {
				reached.push(role);
				if (!highest || highest.position < role.position) {
					highest = role;
				}
			} else {
				notReached.push(role);
				// Rank requires more invites
				if (!nextRank || rank.numInvites < nextRank.numInvites) {
					// Next rank is the one with lowest invites needed
					nextRank = rank;
					nextRankName = role.name;
				}
			}
		}

		let myRole: Role;
		me.roles.forEach((r) => {
			const role = guild.roles.get(r);
			if (role && (!myRole || myRole.position < role.position)) {
				myRole = role;
			}
		});

		const tooHighRoles = guild.roles.filter((r) => r.position > myRole.position);

		let shouldHave: Role[] = [];
		let shouldNotHave = notReached.filter((r) => tooHighRoles.includes(r) && member.roles.includes(r.id));

		if (highest && !member.roles.includes(highest.id)) {
			const rankChannelId = settings.rankAnnouncementChannel;
			if (rankChannelId) {
				const rankChannel = guild.channels.get(rankChannelId) as TextChannel;

				// Check if it's a valid channel
				if (rankChannel) {
					const rankMessageFormat = settings.rankAnnouncementMessage;
					if (rankMessageFormat) {
						const msg = await this.msg.fillTemplate(guild, rankMessageFormat, {
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
					await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'rankAnnouncementChannel', null);
				}
			}
		}

		if (me.permission.has(GuildPermission.MANAGE_ROLES)) {
			// Filter dangerous roles
			dangerous = reached.filter(
				(r) => r.permissions.has(GuildPermission.ADMINISTRATOR) || r.permissions.has(GuildPermission.MANAGE_GUILD)
			);
			reached = reached.filter((r) => dangerous.indexOf(r) === -1);

			if (style !== RankAssignmentStyle.onlyAdd) {
				// Remove roles that we haven't reached yet
				notReached
					.filter((r) => !tooHighRoles.includes(r) && member.roles.includes(r.id))
					.forEach((r) =>
						this.client
							.removeGuildMemberRole(guild.id, member.id, r.id, 'Not have enough invites for rank')
							.catch(() => undefined)
					);
			}

			if (style === RankAssignmentStyle.all || style === RankAssignmentStyle.onlyAdd) {
				// Add all roles that we've reached to the member
				const newRoles = reached.filter((r) => !member.roles.includes(r.id));
				// Roles that the member should have but we can't assign
				shouldHave = newRoles.filter((r) => tooHighRoles.includes(r));
				// Assign only the roles that we can assign
				newRoles
					.filter((r) => !tooHighRoles.includes(r))
					.forEach((r) =>
						this.client
							.addGuildMemberRole(guild.id, member.user.id, r.id, 'Reached a new rank by invites')
							.catch(() => undefined)
					);
			} else if (style === RankAssignmentStyle.highest) {
				// Only add the highest role we've reached to the member
				// Remove roles that we've reached but aren't the highest
				const oldRoles = reached.filter((r) => r !== highest && member.roles.includes(r.id));
				// Add more roles that we shouldn't have
				shouldNotHave = shouldNotHave.concat(oldRoles.filter((r) => tooHighRoles.includes(r)));
				// Remove the old ones from the member
				oldRoles
					.filter((r) => !tooHighRoles.includes(r))
					.forEach((r) =>
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

	public async getCustomInvitesForMember(guildId: string, memberId: string) {
		return this.db.findMany<CustomInvite>(guildId, TABLE.customInvites, '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}
	public async getCustomInvitesForGuild(guildId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT SUM(ci.`amount`) AS total, ci.`memberId` AS id, m.`name` AS name, m.`discriminator` AS discriminator ' +
				`FROM ${db}.${TABLE.customInvites} ci ` +
				`INNER JOIN ${db}.${BASE_TABLE.members} m ON m.\`id\` = ci.\`memberId\` ` +
				'WHERE ci.`guildId` = ? AND ci.`cleared` = 0 ' +
				'GROUP BY ci.`memberId`',
			[guildId]
		);
		return rows as Array<{ total: string; id: string; name: string; discriminator: string }>;
	}
	public async getCustomInviteTotalForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			`SELECT SUM(\`amount\`) AS total FROM ${db}.${TABLE.customInvites} WHERE \`guildId\` = ? AND \`memberId\` = ? AND \`cleared\` = 0`,
			[guildId, memberId]
		);
		if (rows.length > 0) {
			const num = Number(rows[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async saveCustomInvite(customInvite: Partial<CustomInvite>) {
		const res = await this.db.insertOrUpdate(
			TABLE.customInvites,
			['guildId', 'memberId', 'creatorId', 'amount', 'reason'],
			[],
			[customInvite],
			(c) => c.guildId
		);
		return res[0].insertId;
	}
	public async clearCustomInvites(cleared: boolean, guildId: string, memberId?: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const memberQuery = memberId ? 'AND `memberId` = ?' : '';
		await pool.query(`UPDATE ${db}.${TABLE.customInvites} SET \`cleared\` = ? WHERE \`guildId\` = ? ${memberQuery}`, [
			cleared ? 1 : 0,
			guildId,
			memberId
		]);
	}

	public async getJoinsForGuild(guildId: string) {
		type AccumulatedJoin = {
			total: string;
			id: string;
			name: string;
			discriminator: string;
			invalidatedReason: JoinInvalidatedReason;
		};
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT COUNT(j.`id`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator, ' +
				'j.`invalidatedReason` AS invalidatedReason ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${BASE_TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				`INNER JOIN ${db}.${BASE_TABLE.members} m ON m.\`id\` = ic.\`inviterId\` ` +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 ' +
				'GROUP BY ic.`inviterId`, j.`invalidatedReason`',
			[guildId]
		);
		return rows as AccumulatedJoin[];
	}
	public async getMaxJoinIdsForGuild(guildId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			`SELECT MAX(j.\`id\`) AS id FROM ${db}.${TABLE.joins} j WHERE j.\`guildId\` = ? GROUP BY j.\`exactMatchCode\`, j.\`memberId\``,
			[guildId]
		);
		return rows.map((r) => Number(r.id));
	}
	public async getInvalidatedJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT COUNT(j.`id`) AS total, j.`invalidatedReason` AS invalidatedReason ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${BASE_TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 AND ic.`inviterId` = ? ' +
				'GROUP BY j.`invalidatedReason`',
			[guildId, memberId]
		);
		return rows as Array<{ total: string; invalidatedReason: JoinInvalidatedReason }>;
	}
	public async getJoinsPerDay(guildId: string, from: Date, to: Date) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				`FROM ${db}.${TABLE.joins} ` +
				'WHERE `guildId` = ? AND `createdAt` >= ? AND `createdAt` <= ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`)',
			[guildId, from, to]
		);
		return rows as Array<{ year: number; month: number; day: number; total: number }>;
	}
	public async getFirstJoinForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			`SELECT j.* FROM ${db}.${TABLE.joins} j ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` ASC LIMIT 1',
			[guildId, memberId]
		);
		return rows[0] as Join;
	}
	public async getPreviousJoinForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			`SELECT j.* FROM ${db}.${TABLE.joins} j ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 1,1',
			[guildId, memberId]
		);
		return rows[0] as Join;
	}
	public async getNewestJoinForMember(guildId: string, memberId: string) {
		type ExtendedJoin = Join & {
			inviterId: string;
			inviterName: string;
			inviterDiscriminator: string;
			channelId: string;
			channelName: string;
		};
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT j.*, m.`id` AS inviterId, m.`name` AS inviterName, m.`discriminator` AS inviterDiscriminator, ' +
				'c.`id` AS channelId, c.`name` AS channelName ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${BASE_TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				`LEFT JOIN ${db}.${BASE_TABLE.members} m ON m.\`id\` = ic.\`inviterId\` ` +
				`LEFT JOIN ${db}.${BASE_TABLE.channels} c ON c.\`id\` = ic.\`channelId\` ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 1',
			[guildId, memberId]
		);
		return rows[0] as ExtendedJoin;
	}
	public async getJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT j.*, ic.`inviterId` AS inviterId ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${BASE_TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 100',
			[guildId, memberId]
		);
		return rows as Array<Join & { inviterId: string }>;
	}
	public async getTotalJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			`SELECT COUNT(j.\`id\`) AS total FROM ${db}.${TABLE.joins} j WHERE j.\`guildId\` = ? AND j.\`memberId\` = ?`,
			[guildId, memberId]
		);
		return Number(rows[0].total);
	}
	public async getInvitedMembers(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT j.`memberId` AS memberId, MAX(j.`createdAt`) AS createdAt ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${BASE_TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				'WHERE j.`guildId` = ? AND `invalidatedReason` IS NULL AND ic.`inviterId` = ? ' +
				'GROUP BY j.`memberId` ' +
				'ORDER BY MAX(j.`createdAt`) DESC ',
			[guildId, memberId]
		);
		return rows as Array<{ memberId: string; createdAt: string }>;
	}
	public async updateJoinInvalidatedReason(
		newInvalidatedReason: JoinInvalidatedReason | string,
		guildId: string,
		search?: {
			invalidatedReason: JoinInvalidatedReason;
			memberId?: string;
			joinId?: number;
			ignoredJoinId?: number;
		}
	) {
		const vals: any[] = [guildId];
		let reasonQuery = '';
		if (search && typeof search.invalidatedReason !== 'undefined') {
			if (search.invalidatedReason === null) {
				reasonQuery = 'AND `invalidatedReason` IS NULL';
			} else {
				reasonQuery = 'AND `invalidatedReason` = ?';
				vals.push(search.invalidatedReason);
			}
		}
		let memberQuery = '';
		if (search && typeof search.memberId !== 'undefined') {
			memberQuery = 'AND `memberId` = ?';
			vals.push(search.memberId);
		}
		let joinQuery = '';
		if (search && typeof search.joinId !== 'undefined') {
			joinQuery = 'AND `id` = ?';
			vals.push(search.joinId);
		}
		let ignoredJoinQuery = '';
		if (search && typeof search.ignoredJoinId !== 'undefined') {
			ignoredJoinQuery = 'AND `id` != ?';
			vals.push(search.ignoredJoinId);
		}

		if (Object.values(JoinInvalidatedReason).includes(newInvalidatedReason as any)) {
			newInvalidatedReason = `'${newInvalidatedReason}'`;
		}
		const [db, pool] = this.db.getDbInfo(guildId);
		const [ok] = await pool.query<any>(
			`UPDATE ${db}.${TABLE.joins} SET \`invalidatedReason\` = ${newInvalidatedReason} WHERE \`guildId\` = ? ` +
				`${reasonQuery} ${memberQuery} ${joinQuery} ${ignoredJoinQuery}`,
			vals
		);
		return ok.affectedRows;
	}
	public async updateJoinClearedStatus(newCleared: boolean, guildId: string, exactMatchCodes: string[]) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const codeQuery = exactMatchCodes.length > 0 ? 'AND `exactMatchCode` IN(?)' : '';
		await pool.query(`UPDATE ${db}.${TABLE.joins} SET \`cleared\` = ? WHERE \`guildId\` = ? ${codeQuery}`, [
			newCleared,
			guildId,
			exactMatchCodes
		]);
	}
	public async saveJoin(join: Partial<Join>) {
		const res = await this.db.insertOrUpdate(
			TABLE.joins,
			['guildId', 'createdAt', 'memberId', 'exactMatchCode', 'invalidatedReason', 'cleared'],
			['exactMatchCode'],
			[join],
			(j) => j.guildId
		);
		return res[0].insertId;
	}

	public async saveLeave(leave: Partial<Leave>) {
		const res = await this.db.insertOrUpdate(
			TABLE.leaves,
			['guildId', 'memberId', 'joinId'],
			['joinId'],
			[leave],
			(l) => l.guildId
		);
		return res[0].insertId;
	}
	public async getLeavesPerDay(guildId: string, from: Date, to: Date) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				`FROM ${db}.${TABLE.leaves} ` +
				'WHERE `guildId` = ? AND `createdAt` >= ? AND `createdAt` <= ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`)',
			[guildId, from, to]
		);
		return rows as Array<{ year: number; month: number; day: number; total: number }>;
	}
	public async subtractLeaves(guildId: string, autoSubtractLeaveThreshold: number) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any>(
			`UPDATE ${db}.${TABLE.joins} j ` +
				`LEFT JOIN ${db}.${TABLE.leaves} l ON l.\`joinId\` = j.\`id\` SET \`invalidatedReason\` = ` +
				'CASE WHEN l.`id` IS NULL OR TIMESTAMPDIFF(SECOND, j.`createdAt`, l.`createdAt`) > ? THEN NULL ELSE "leave" END ' +
				'WHERE j.`guildId` = ? AND (j.`invalidatedReason` IS NULL OR j.`invalidatedReason` = "leave")',
			[autoSubtractLeaveThreshold, guildId]
		);
		return rows;
	}
}
