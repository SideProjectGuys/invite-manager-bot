import { Guild as DiscordGuild } from 'eris';
import mysql, { OkPacket, Pool, RowDataPacket } from 'mysql2/promise';

import { IMClient } from '../../client';
import { CustomInvite } from '../../invites/models/CustomInvite';
import { Rank } from '../../invites/models/Rank';
import { Message } from '../../management/models/Message';
import { ReactionRole } from '../../management/models/ReactionRole';
import { Punishment } from '../../moderation/models/Punishment';
import { PunishmentConfig, PunishmentType } from '../../moderation/models/PunishmentConfig';
import { Strike } from '../../moderation/models/Strike';
import { StrikeConfig, ViolationType } from '../../moderation/models/StrikeConfig';
import { MusicNode } from '../../music/models/MusicNode';
import { BasicUser, BotType } from '../../types';
import { getShardIdForGuild } from '../../util';
import { BotSetting } from '../models/BotSetting';
import { Channel } from '../models/Channel';
import { CommandUsage } from '../models/CommandUsage';
import { Guild } from '../models/Guild';
import { GuildSetting } from '../models/GuildSetting';
import { Incident } from '../models/Incident';
import { InviteCode } from '../models/InviteCode';
import { InviteCodeSetting } from '../models/InviteCodeSetting';
import { Join, JoinInvalidatedReason } from '../models/Join';
import { Leave } from '../models/Leave';
import { Log } from '../models/Log';
import { Member } from '../models/Member';
import { MemberSetting } from '../models/MemberSetting';
import { PremiumSubscription } from '../models/PremiumSubscription';
import { PremiumSubscriptionGuild } from '../models/PremiumSubscriptionGuild';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { ScheduledAction, ScheduledActionType } from '../models/ScheduledAction';

import { IMService } from './Service';

const GLOBAL_SHARD_ID = 0;

enum TABLE {
	botSettings = '`botSettings`',
	channels = '`channels`',
	commandUsages = '`commandUsages`',
	customInvites = '`customInvites`',
	dbStats = '`dbStats`',
	guilds = '`guilds`',
	guildSettings = '`guildSettings`',
	incidents = '`incidents`',
	inviteCodes = '`inviteCodes`',
	inviteCodeSettings = '`inviteCodeSettings`',
	joins = '`joins`',
	leaves = '`leaves`',
	logs = '`logs`',
	members = '`members`',
	memberSettings = '`memberSettings`',
	messages = '`messages`',
	musicNodes = '`musicNodes`',
	premiumSubscriptionGuilds = '`premiumSubscriptionGuilds`',
	premiumSubscriptions = '`premiumSubscriptions`',
	punishmentConfigs = '`punishmentConfigs`',
	punishments = '`punishments`',
	ranks = '`ranks`',
	reactionRoles = '`reactionRoles`',
	rolePermissions = '`rolePermissions`',
	roles = '`roles`',
	scheduledActions = '`scheduledActions`',
	strikeConfigs = '`strikeConfigs`',
	strikes = '`strikes`'
}

export class DatabaseService extends IMService {
	private dbCount: number = 1;
	private pools: Map<number, Pool> = new Map();

	private guilds: Set<DiscordGuild> = new Set();
	private doneGuilds: Set<String> = new Set();

	private users: Set<BasicUser & { guildId: string }> = new Set();
	private doneUsers: Set<String> = new Set();

	private logActions: Partial<Log>[] = [];
	private cmdUsages: Partial<CommandUsage>[] = [];
	private incidents: Partial<Incident>[] = [];

	public constructor(client: IMClient) {
		super(client);

		for (const db of client.config.databases) {
			const range = db.range;
			delete db.range;

			const pool = mysql.createPool(db);
			for (let i = range.from; i <= range.to; i++) {
				this.pools.set(i, pool);
			}

			this.dbCount = Math.max(this.dbCount, range.to);
		}

		console.log(`We're connected to ${this.dbCount} db shards on ${client.config.databases.length} different servers`);

		setInterval(() => this.syncDB(), 10000);
	}

	private getDbInfo(dbShardOrGuildId: number | string): [string, Pool] {
		if (typeof dbShardOrGuildId === 'number') {
			return [`\`im_${dbShardOrGuildId}\``, this.pools.get(dbShardOrGuildId)];
		} else {
			const db = getShardIdForGuild(dbShardOrGuildId, this.dbCount);
			return [`\`im_${db}\``, this.pools.get(db)];
		}
	}

	public getDbShardForGuild(guildId: string) {
		return getShardIdForGuild(guildId, this.dbCount);
	}

	private async findOne<T>(shard: number | string, table: TABLE, where: string, values: any[]): Promise<T> {
		const [db, pool] = this.getDbInfo(shard);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT ${table}.* FROM ${db}.${table} WHERE ${where} LIMIT 1`,
			values
		);
		return rows[0] as T;
	}
	private async findMany<T>(shard: number | string, table: TABLE, where: string, values: any[]): Promise<T[]> {
		const [db, pool] = this.getDbInfo(shard);
		const [rows] = await pool.query<RowDataPacket[]>(`SELECT ${table}.* FROM ${db}.${table} WHERE ${where}`, values);
		return rows as T[];
	}
	private async findManyOnSpecificShards<T, O = string>(
		table: TABLE,
		where: string,
		values: O[],
		selector: (obj: O) => number | string = (o) => o as any,
		dataSelector: (obj: O) => any = (o) => o
	): Promise<T[]> {
		const map: Map<Pool, Map<string, O[]>> = new Map();
		for (const value of values) {
			const [id, pool] = this.getDbInfo(selector(value));
			const poolData = map.get(pool);
			if (poolData) {
				const shardData = poolData.get(id);
				if (shardData) {
					shardData.push(dataSelector(value));
				} else {
					poolData.set(id, [dataSelector(value)]);
				}
			} else {
				const shardData = new Map<string, O[]>();
				shardData.set(id, [value]);
				map.set(pool, shardData);
			}
		}

		const promises: Promise<RowDataPacket[]>[] = [];
		for (const [pool, poolData] of map.entries()) {
			const queries: string[] = [];
			const poolValues: O[][] = [];
			for (const [db, vals] of poolData.entries()) {
				queries.push(`SELECT ${table}.* FROM ${db}.${table} WHERE ${where}`);
				poolValues.push(vals);
			}
			const query = queries.join(' UNION ');
			promises.push(pool.query<RowDataPacket[]>(query, poolValues).then(([rs]) => rs));
		}
		const rows = await Promise.all(promises);
		return rows.reduce((acc, val) => acc.concat(val as T[]), [] as T[]);
	}
	private async insertOrUpdate<T>(
		table: TABLE,
		cols: (keyof T)[],
		updateCols: (keyof T)[],
		values: Partial<T>[],
		selector: (obj: Partial<T>) => number | string
	) {
		const colQuery = cols.map((c) => `\`${c}\``).join(',');
		const updateQuery =
			updateCols.length > 0
				? `ON DUPLICATE KEY UPDATE ${updateCols.map((u) => `\`${u}\` = VALUES(\`${u}\`)`).join(',')}`
				: '';

		const map: Map<string, [Pool, Partial<T>[]]> = new Map();
		for (const value of values) {
			const [id, pool] = this.getDbInfo(selector(value));
			const poolData = map.get(id);
			if (poolData) {
				poolData[1].push(value);
			} else {
				map.set(id, [pool, [value]]);
			}
		}

		const oks: OkPacket[] = [];
		for (const [db, [pool, rawVals]] of map.entries()) {
			const vals = rawVals.map((val) =>
				cols.map((col) => {
					let v: any = val[col];
					if (v instanceof Date) {
						return v;
					} else if (typeof v === 'object' && v !== null) {
						v = JSON.stringify(v);
					}
					return v;
				})
			);

			const query = `INSERT INTO ${db}.${table} (${colQuery}) VALUES ? ${updateQuery}`;
			const [ok] = await pool.query<OkPacket>(query, [vals]);
			oks.push(ok);
		}

		return oks;
	}
	private async delete(shard: number | string, table: TABLE, where: string, values: any[]) {
		const [db, pool] = this.getDbInfo(shard);
		const [ok] = await pool.query<OkPacket>(`DELETE FROM ${db}.${table} WHERE ${where}`, values);
		return ok;
	}

	// ---------
	//   Guild
	// ---------
	public async getGuild(id: string) {
		return this.findOne<Guild>(id, TABLE.guilds, '`id` = ?', [id]);
	}
	public async getBannedGuilds(ids: string[]) {
		return await this.findManyOnSpecificShards<Guild>(TABLE.guilds, '`id` IN (?) AND `banReason` IS NOT NULL', ids);
	}
	public async saveGuilds(guilds: Partial<Guild>[]) {
		await this.insertOrUpdate(
			TABLE.guilds,
			['id', 'name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			['name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			guilds,
			(g) => g.id
		);
	}

	// ------------------
	//   Guild settings
	// ------------------
	public async getGuildSettings(guildId: string) {
		return this.findOne<GuildSetting>(guildId, TABLE.guildSettings, '`guildId` = ?', [guildId]);
	}
	public async saveGuildSettings(settings: Partial<GuildSetting>) {
		await this.insertOrUpdate(TABLE.guildSettings, ['guildId', 'value'], ['value'], [settings], (s) => s.guildId);
	}

	// ------------
	//   Channels
	// ------------
	public async saveChannels(channels: Partial<Channel>[]) {
		await this.insertOrUpdate(TABLE.channels, ['guildId', 'id', 'name'], ['name'], channels, (c) => c.guildId);
	}

	// -----------
	//   Members
	// -----------
	public async getMember(guildId: string, id: string) {
		return this.findOne<Member>(guildId, TABLE.members, '`id` = ?', [id]);
	}
	public async getMembersByName(guildId: string, name: string, discriminator?: string) {
		return this.findMany<Member>(
			guildId,
			TABLE.members,
			'`name` LIKE ?' + (discriminator ? ' AND `discriminator` LIKE ?' : ''),
			[`%${name}%`, `%${discriminator}%`]
		);
	}
	public async saveMembers(members: Array<Partial<Member> & { guildId: string }>) {
		await this.insertOrUpdate(
			TABLE.members,
			['id', 'name', 'discriminator'],
			['name', 'discriminator'],
			members,
			(m) => m.guildId
		);
	}

	// -------------------
	//   Member settings
	// -------------------
	public async getMemberSettingsForGuild(guildId: string) {
		return this.findMany<MemberSetting>(guildId, TABLE.memberSettings, '`guildId` = ?', [guildId]);
	}
	public async saveMemberSettings(settings: Partial<MemberSetting>) {
		await this.insertOrUpdate(
			TABLE.memberSettings,
			['guildId', 'memberId', 'value'],
			['value'],
			[settings],
			(s) => s.guildId
		);
	}

	// ---------
	//   Roles
	// ---------
	public async saveRoles(roles: Partial<Role>[]) {
		await this.insertOrUpdate(
			TABLE.roles,
			['id', 'createdAt', 'guildId', 'name', 'color'],
			['name', 'color'],
			roles,
			(r) => r.guildId
		);
	}

	// ---------
	//   Ranks
	// ---------
	public async getRanksForGuild(guildId: string) {
		return this.findMany<Rank>(guildId, TABLE.ranks, '`guildId` = ?', [guildId]);
	}
	public async saveRank(rank: Partial<Rank>) {
		await this.insertOrUpdate(
			TABLE.ranks,
			['guildId', 'roleId', 'numInvites', 'description'],
			['numInvites', 'description'],
			[rank],
			(r) => r.guildId
		);
	}
	public async removeRank(guildId: string, roleId: string) {
		await this.delete(guildId, TABLE.ranks, `\`roleId\` = ?`, [roleId]);
	}

	// --------------------
	//   Role permissions
	// --------------------
	public async getRolePermissions(guildId: string, roleId: string, cmd: string) {
		return this.findOne<RolePermission>(guildId, TABLE.rolePermissions, '`roleId` = ? AND `command` = ?', [
			roleId,
			cmd
		]);
	}
	public async getRolePermissionsForGuild(guildId: string, cmd?: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const cmdQuery = cmd ? `AND rp.\`command\` = ?` : '';
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT rp.*, r.name as roleName ` +
				`FROM ${db}.${TABLE.rolePermissions} rp  ` +
				`INNER JOIN ${db}.${TABLE.roles} r ON r.\`id\` = rp.\`roleId\` ` +
				`WHERE r.\`guildId\` = ? ${cmdQuery}`,
			[guildId, cmd]
		);
		return rows as Array<RolePermission & { roleName: string }>;
	}
	public async saveRolePermissions(guildId: string, rolePermissions: Partial<RolePermission>[]) {
		await this.insertOrUpdate(TABLE.rolePermissions, ['roleId', 'command'], [], rolePermissions, (rp) => guildId);
	}
	public async removeRolePermissions(guildId: string, roleId: string, command: string) {
		await this.delete(guildId, TABLE.rolePermissions, '`roleId` = ? AND `command` = ?', [roleId, command]);
	}

	// --------------
	//   InviteCode
	// --------------
	public async getAllInviteCodesForGuilds(guildIds: string[]) {
		return this.findManyOnSpecificShards<InviteCode>(TABLE.inviteCodes, '`guildId` IN(?)', guildIds);
	}
	public async getInviteCodesForGuild(guildId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT SUM(ic.`uses` - ic.`clearedAmount`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator ' +
				`FROM ${db}.${TABLE.inviteCodes} ic ` +
				`INNER JOIN ${db}.${TABLE.members} m ON m.\`id\` = ic.\`inviterId\` ` +
				'WHERE ic.`guildId` = ? AND ic.`uses` > ic.`clearedAmount` ' +
				'GROUP BY ic.`inviterId`',
			[guildId]
		);
		return rows as Array<{ total: string; id: string; name: string; discriminator: string }>;
	}
	public async getInviteCodesForMember(guildId: string, memberId: string) {
		return this.findMany<InviteCode>(
			guildId,
			TABLE.inviteCodes,
			'`guildId` = ? AND `inviterId` = ? ORDER BY `uses` DESC',
			[guildId, memberId]
		);
	}
	public async getInviteCodeTotalForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT SUM(\`uses\` - \`clearedAmount\`) AS total FROM ${db}.${TABLE.inviteCodes} WHERE \`guildId\` = ? AND \`inviterId\` = ? AND \`uses\` > 0`,
			[guildId, memberId]
		);
		if (rows.length > 0) {
			const num = Number(rows[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async updateInviteCodeClearedAmount(clearedAmount: number | string, guildId: string, memberId?: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const memberQuery = memberId ? 'AND `inviterId` = ?' : '';
		const clearColumn = typeof clearedAmount === 'number' ? '?' : '??';
		await pool.query(
			`UPDATE ${db}.${TABLE.inviteCodes} SET \`clearedAmount\` = ${clearColumn} WHERE \`guildId\` = ? ${memberQuery}`,
			[clearedAmount, guildId, memberId]
		);
	}
	public async incrementInviteCodesUse(guildId: string, codes: string[]) {
		const [db, pool] = this.getDbInfo(guildId);
		await pool.query(`UPDATE ${db}.${TABLE.inviteCodes} SET \`uses\` = \`uses\` + 1 WHERE \`code\` IN(?)`, [codes]);
	}
	public async saveInviteCodes(inviteCodes: Partial<InviteCode>[]) {
		await this.insertOrUpdate(
			TABLE.inviteCodes,
			[
				'guildId',
				'createdAt',
				'channelId',
				'code',
				'isVanity',
				'isWidget',
				'clearedAmount',
				'inviterId',
				'maxAge',
				'maxUses',
				'temporary',
				'uses'
			],
			['uses'],
			inviteCodes,
			(ic) => ic.guildId
		);
	}

	// -----------------------
	//   InviteCode settings
	// -----------------------
	public async getInviteCodeSettingsForGuild(guildId: string) {
		return this.findMany<InviteCodeSetting>(guildId, TABLE.inviteCodeSettings, '`guildId` = ?', [guildId]);
	}
	public async saveInviteCodeSettings(settings: Partial<InviteCodeSetting>) {
		await this.insertOrUpdate(
			TABLE.inviteCodeSettings,
			['guildId', 'inviteCode', 'value'],
			['value'],
			[settings],
			(s) => s.guildId
		);
	}

	// ----------------
	//   CustomInvite
	// ----------------
	public async getCustomInvitesForMember(guildId: string, memberId: string) {
		return this.findMany<CustomInvite>(guildId, TABLE.customInvites, '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}
	public async getCustomInvitesForGuild(guildId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT SUM(ci.`amount`) AS total, ci.`memberId` AS id, m.`name` AS name, m.`discriminator` AS discriminator ' +
				`FROM ${db}.${TABLE.customInvites} ci ` +
				`INNER JOIN ${db}.${TABLE.members} m ON m.\`id\` = ci.\`memberId\` ` +
				'WHERE ci.`guildId` = ? AND ci.`cleared` = 0 ' +
				'GROUP BY ci.`memberId`',
			[guildId]
		);
		return rows as Array<{ total: string; id: string; name: string; discriminator: string }>;
	}
	public async getCustomInviteTotalForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
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
		const res = await this.insertOrUpdate(
			TABLE.customInvites,
			['guildId', 'memberId', 'creatorId', 'amount', 'reason'],
			[],
			[customInvite],
			(c) => c.guildId
		);
		return res[0].insertId;
	}
	public async clearCustomInvites(cleared: boolean, guildId: string, memberId?: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const memberQuery = memberId ? 'AND `memberId` = ?' : '';
		await pool.query(`UPDATE ${db}.${TABLE.customInvites} SET \`cleared\` = ? WHERE \`guildId\` = ? ${memberQuery}`, [
			cleared ? 1 : 0,
			guildId,
			memberId
		]);
	}

	// --------
	//   Join
	// --------
	public async getJoinsForGuild(guildId: string) {
		type AccumulatedJoin = {
			total: string;
			id: string;
			name: string;
			discriminator: string;
			invalidatedReason: JoinInvalidatedReason;
		};
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT COUNT(j.`id`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator, ' +
				'j.`invalidatedReason` AS invalidatedReason ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				`INNER JOIN ${db}.${TABLE.members} m ON m.\`id\` = ic.\`inviterId\` ` +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 ' +
				'GROUP BY ic.`inviterId`, j.`invalidatedReason`',
			[guildId]
		);
		return rows as AccumulatedJoin[];
	}
	public async getMaxJoinIdsForGuild(guildId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT MAX(j.\`id\`) AS id FROM ${db}.${TABLE.joins} j WHERE j.\`guildId\` = ? GROUP BY j.\`exactMatchCode\`, j.\`memberId\``,
			[guildId]
		);
		return rows.map((r) => Number(r.id));
	}
	public async getInvalidatedJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT COUNT(j.`id`) AS total, j.`invalidatedReason` AS invalidatedReason ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 AND ic.`inviterId` = ? ' +
				'GROUP BY j.`invalidatedReason`',
			[guildId, memberId]
		);
		return rows as Array<{ total: string; invalidatedReason: JoinInvalidatedReason }>;
	}
	public async getJoinsPerDay(guildId: string, from: Date, to: Date) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				`FROM ${db}.${TABLE.joins} ` +
				'WHERE `guildId` = ? AND `createdAt` >= ? AND `createdAt` <= ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`)',
			[guildId, from, to]
		);
		return rows as Array<{ year: number; month: number; day: number; total: number }>;
	}
	public async getFirstJoinForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT j.* FROM ${db}.${TABLE.joins} j ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` ASC LIMIT 1',
			[guildId, memberId]
		);
		return rows[0] as Join;
	}
	public async getPreviousJoinForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
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
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT j.*, m.`id` AS inviterId, m.`name` AS inviterName, m.`discriminator` AS inviterDiscriminator, ' +
				'c.`id` AS channelId, c.`name` AS channelName ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				`LEFT JOIN ${db}.${TABLE.members} m ON m.\`id\` = ic.\`inviterId\` ` +
				`LEFT JOIN ${db}.${TABLE.channels} c ON c.\`id\` = ic.\`channelId\` ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 1',
			[guildId, memberId]
		);
		return rows[0] as ExtendedJoin;
	}
	public async getJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT j.*, ic.`inviterId` AS inviterId ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 100',
			[guildId, memberId]
		);
		return rows as Array<Join & { inviterId: string }>;
	}
	public async getTotalJoinsForMember(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT COUNT(j.\`id\`) AS total FROM ${db}.${TABLE.joins} j WHERE j.\`guildId\` = ? AND j.\`memberId\` = ?`,
			[guildId, memberId]
		);
		return Number(rows[0].total);
	}
	public async getInvitedMembers(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT j.`memberId` AS memberId, MAX(j.`createdAt`) AS createdAt ' +
				`FROM ${db}.${TABLE.joins} j ` +
				`INNER JOIN ${db}.${TABLE.inviteCodes} ic ON ic.\`code\` = j.\`exactMatchCode\` ` +
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
		const [db, pool] = this.getDbInfo(guildId);
		const [ok] = await pool.query<OkPacket>(
			`UPDATE ${db}.${TABLE.joins} SET \`invalidatedReason\` = ${newInvalidatedReason} WHERE \`guildId\` = ? ` +
				`${reasonQuery} ${memberQuery} ${joinQuery} ${ignoredJoinQuery}`,
			vals
		);
		return ok.affectedRows;
	}
	public async updateJoinClearedStatus(newCleared: boolean, guildId: string, exactMatchCodes: string[]) {
		const [db, pool] = this.getDbInfo(guildId);
		const codeQuery = exactMatchCodes.length > 0 ? 'AND `exactMatchCode` IN(?)' : '';
		await pool.query(`UPDATE ${db}.${TABLE.joins} SET \`cleared\` = ? WHERE \`guildId\` = ? ${codeQuery}`, [
			newCleared,
			guildId,
			exactMatchCodes
		]);
	}
	public async saveJoin(join: Partial<Join>) {
		const res = await this.insertOrUpdate(
			TABLE.joins,
			['guildId', 'createdAt', 'memberId', 'exactMatchCode', 'invalidatedReason', 'cleared'],
			['exactMatchCode'],
			[join],
			(j) => j.guildId
		);
		return res[0].insertId;
	}

	// ---------
	//   Leave
	// ---------
	public async saveLeave(leave: Partial<Leave>) {
		const res = await this.insertOrUpdate(
			TABLE.leaves,
			['guildId', 'memberId', 'joinId'],
			['joinId'],
			[leave],
			(l) => l.guildId
		);
		return res[0].insertId;
	}
	public async getLeavesPerDay(guildId: string, from: Date, to: Date) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				`FROM ${db}.${TABLE.leaves} ` +
				'WHERE `guildId` = ? AND `createdAt` >= ? AND `createdAt` <= ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`)',
			[guildId, from, to]
		);
		return rows as Array<{ year: number; month: number; day: number; total: number }>;
	}
	public async subtractLeaves(guildId: string, autoSubtractLeaveThreshold: number) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<OkPacket>(
			`UPDATE ${db}.${TABLE.joins} j ` +
				`LEFT JOIN ${db}.${TABLE.leaves} l ON l.\`joinId\` = j.\`id\` SET \`invalidatedReason\` = ` +
				'CASE WHEN l.`id` IS NULL OR TIMESTAMPDIFF(SECOND, j.`createdAt`, l.`createdAt`) > ? THEN NULL ELSE "leave" END ' +
				'WHERE j.`guildId` = ? AND (j.`invalidatedReason` IS NULL OR j.`invalidatedReason` = "leave")',
			[autoSubtractLeaveThreshold, guildId]
		);
		return rows;
	}

	// ----------------
	//   Bot settings
	// ----------------
	public async getBotSettings(botId: string) {
		return this.findOne<BotSetting>(GLOBAL_SHARD_ID, TABLE.botSettings, '`id` = ?', [botId]);
	}
	public async saveBotSettings(settings: Partial<BotSetting>) {
		await this.insertOrUpdate(TABLE.botSettings, ['id', 'value'], ['value'], [settings], () => GLOBAL_SHARD_ID);
	}

	// --------
	//   Logs
	// --------
	public saveLog(guild: DiscordGuild, user: BasicUser, action: Partial<Log>) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add({ ...user, guildId: guild.id });
		}

		this.logActions.push(action);
	}
	private async saveLogs(logs: Partial<Log>[]) {
		await this.insertOrUpdate(
			TABLE.logs,
			['guildId', 'memberId', 'action', 'message', 'data'],
			[],
			logs,
			(l) => l.guildId
		);
	}

	// ------------------
	//   Command usages
	// ------------------
	public saveCommandUsage(guild: DiscordGuild, user: BasicUser, cmdUsage: Partial<CommandUsage>) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add({ ...user, guildId: guild.id });
		}

		this.cmdUsages.push(cmdUsage);
	}
	private async saveCommandUsages(commandUsages: Partial<CommandUsage>[]) {
		await this.insertOrUpdate(
			TABLE.commandUsages,
			['guildId', 'memberId', 'command', 'args', 'time', 'errored'],
			[],
			commandUsages,
			(c) => c.guildId
		);
	}

	// -------------
	//   Incidents
	// -------------
	public saveIncident(guild: DiscordGuild, indicent: Partial<Incident>) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}
		this.incidents.push(indicent);
	}
	private async saveIncidents(indicents: Partial<Incident>[]) {
		await this.insertOrUpdate(TABLE.incidents, ['guildId', 'error', 'details'], [], indicents, (i) => i.guildId);
	}

	// ---------------
	//   Music nodes
	// ---------------
	public async getMusicNodes() {
		const typeFilter =
			this.client.type === BotType.custom ? 'isCustom' : this.client.type === BotType.pro ? 'isPremium' : 'isRegular';
		return this.findMany<MusicNode>(GLOBAL_SHARD_ID, TABLE.musicNodes, `${typeFilter} = 1`, []);
	}

	// ---------------------
	//   Scheduled actions
	// ---------------------
	public async getScheduledAction(guildId: string, id: number) {
		return this.findOne<ScheduledAction>(guildId, TABLE.scheduledActions, '`id` = ?', [id]);
	}
	public async getScheduledActionsForGuildByType(guildId: string, type: ScheduledActionType) {
		return this.findMany<ScheduledAction>(guildId, TABLE.scheduledActions, '`guildId` = ? AND `actionType` = ?', [
			guildId,
			type
		]);
	}
	public async getScheduledActionsForGuilds(guildIds: string[]) {
		return this.findManyOnSpecificShards<ScheduledAction>(TABLE.scheduledActions, '`guildId` IN (?)', guildIds);
	}
	public async saveScheduledAction(action: Partial<ScheduledAction>) {
		const res = await this.insertOrUpdate(
			TABLE.scheduledActions,
			['guildId', 'date', 'actionType', 'args', 'reason'],
			[],
			[action],
			(a) => a.guildId
		);
		return res[0].insertId;
	}
	public async removeScheduledAction(guildId: string, id: number) {
		await this.delete(guildId, TABLE.scheduledActions, '`id` = ?', [id]);
	}

	// ------------------------
	//   Premium subscription
	// ------------------------
	public async getPremiumSubscriptionsForMember(
		memberId: string,
		onlyActive: boolean = true,
		onlyFree: boolean = false
	) {
		return this.findMany<PremiumSubscription>(
			GLOBAL_SHARD_ID,
			TABLE.premiumSubscriptions,
			'`memberId` = ? ' + (onlyActive ? 'AND `validUntil` > NOW() ' : '') + (onlyFree ? 'AND `isFreeTier` = 1 ' : ''),
			[memberId]
		);
	}
	public async savePremiumSubscription(sub: Partial<PremiumSubscription>) {
		const res = await this.insertOrUpdate(
			TABLE.premiumSubscriptions,
			['memberId', 'validUntil', 'isFreeTier', 'isPatreon', 'isStaff', 'amount', 'maxGuilds', 'reason'],
			['validUntil'],
			[sub],
			() => GLOBAL_SHARD_ID
		);
		return res[0].insertId;
	}

	// ------------------------------
	//   Premium subscription guild
	// ------------------------------
	public async getPremiumSubscriptionGuildForGuild(guildId: string, onlyActive: boolean = true) {
		const [db, pool] = this.getDbInfo(GLOBAL_SHARD_ID);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT psg.* FROM ${db}.${TABLE.premiumSubscriptionGuilds} psg ` +
				`INNER JOIN ${db}.${TABLE.premiumSubscriptions} ps ON ps.\`memberId\` = psg.\`memberId\` ` +
				`WHERE psg.\`guildId\` = ? ` +
				(onlyActive ? `AND ps.\`validUntil\` > NOW() ` : '') +
				`ORDER BY ps.\`validUntil\` DESC ` +
				`LIMIT 1`,
			[guildId]
		);
		return rows[0] as PremiumSubscriptionGuild;
	}
	public async getPremiumSubscriptionGuildsForMember(memberId: string) {
		const [db, pool] = this.getDbInfo(GLOBAL_SHARD_ID);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT psg.* FROM ${db}.${TABLE.premiumSubscriptionGuilds} psg WHERE psg.\`memberId\` = ?`,
			[memberId]
		);
		const guilds = await this.findManyOnSpecificShards<Guild>(
			TABLE.guilds,
			`id IN(?)`,
			rows.map((r) => r.guildId)
		);
		return rows.map((r) => ({
			...r,
			guildName: (guilds.find((g) => g.id === r.guildId) || { name: r.guildId }).name
		})) as Array<PremiumSubscriptionGuild & { guildName: string }>;
	}
	public async savePremiumSubscriptionGuild(sub: Partial<PremiumSubscriptionGuild>) {
		await this.insertOrUpdate(
			TABLE.premiumSubscriptionGuilds,
			['guildId', 'memberId'],
			[],
			[sub],
			() => GLOBAL_SHARD_ID
		);
	}
	public async removePremiumSubscriptionGuild(memberId: string, guildId: string) {
		await this.delete(GLOBAL_SHARD_ID, TABLE.premiumSubscriptionGuilds, '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}

	// ----------
	//   Strike
	// ----------
	public async getStrike(guildId: string, id: number) {
		type ExtendedStrike = Strike & { memberName: string; memberDiscriminator: string; memberCreatedAt: string };
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT s.*, m.`name` as memberName, m.`discriminator` as memberDiscriminator, m.`createdAt` as memberCreatedAt ' +
				`FROM ${db}.${TABLE.strikes} s INNER JOIN ${db}.${TABLE.members} m ON m.\`id\` = s.\`memberId\` WHERE s.\`guildId\` = ? AND s.\`id\` = ?`,
			[guildId, id]
		);
		return rows[0] as ExtendedStrike;
	}
	public async getStrikesForMember(guildId: string, memberId: string) {
		return this.findMany<Strike>(guildId, TABLE.strikes, '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
	}
	public async getStrikeAmount(guildId: string, memberId: string) {
		const [db, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT SUM(amount) AS total FROM ${db}.${TABLE.strikes} WHERE \`guildId\` = ? AND \`memberId\` = ?`,
			[guildId, memberId]
		);
		if (rows.length > 0) {
			const num = Number(rows[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async saveStrike(strike: Partial<Strike>) {
		await this.insertOrUpdate(TABLE.strikes, ['guildId', 'memberId', 'type', 'amount'], [], [strike], (s) => s.guildId);
	}
	public async removeStrike(guildId: string, id: number) {
		await this.delete(guildId, TABLE.strikes, '`guildId` = ? AND `id` = ?', [guildId, id]);
	}

	// ------------------
	//   Strike configs
	// ------------------
	public async getStrikeConfigsForGuild(guildId: string) {
		return this.findMany<StrikeConfig>(guildId, TABLE.strikeConfigs, '`guildId` = ? ORDER BY `amount` DESC', [guildId]);
	}
	public async saveStrikeConfig(config: Partial<StrikeConfig>) {
		await this.insertOrUpdate(
			TABLE.strikeConfigs,
			['guildId', 'type', 'amount'],
			['amount'],
			[config],
			(c) => c.guildId
		);
	}
	public async removeStrikeConfig(guildId: string, type: ViolationType) {
		await this.delete(guildId, TABLE.strikeConfigs, '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	// --------------
	//   Punishment
	// --------------
	public async getPunishment(guildId: string, id: number) {
		return this.findOne<Punishment>(guildId, TABLE.punishments, '`guildId` = ? AND id = ?', [guildId, id]);
	}
	public async savePunishment(punishment: Partial<Punishment>) {
		await this.insertOrUpdate(
			TABLE.punishments,
			['guildId', 'type', 'amount', 'args', 'creatorId', 'memberId', 'reason'],
			[],
			[punishment],
			(p) => p.guildId
		);
	}
	public async removePunishment(guildId: string, id: number) {
		await this.delete(guildId, TABLE.punishments, '`guildId` = ? AND `id` = ?', [guildId, id]);
	}
	public async getPunishmentsForMember(guildId: string, memberId: string) {
		return this.findMany<Punishment>(guildId, TABLE.punishments, '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}

	// ----------------------
	//   Punishment configs
	// ----------------------
	public async getPunishmentConfigsForGuild(guildId: string) {
		return this.findMany<PunishmentConfig>(guildId, TABLE.punishmentConfigs, '`guildId` = ? ORDER BY `amount` DESC', [
			guildId
		]);
	}
	public async savePunishmentConfig(config: Partial<PunishmentConfig>) {
		await this.insertOrUpdate(
			TABLE.punishmentConfigs,
			['guildId', 'type', 'amount', 'args'],
			['amount', 'args'],
			[config],
			(c) => c.guildId
		);
	}
	public async removePunishmentConfig(guildId: string, type: PunishmentType) {
		await this.delete(guildId, TABLE.punishmentConfigs, '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	// ------------
	//   Messages
	// ------------
	public async getMessageById(guildId: string, messageId: string) {
		return this.findOne<Message>(guildId, TABLE.messages, '`guildId` = ? AND `id` = ?', [guildId, messageId]);
	}
	public async getMessagesForGuild(guildId: string) {
		return this.findMany<Message>(guildId, TABLE.messages, '`guildId` = ?', [guildId]);
	}
	public async saveMessage(message: Partial<Message>) {
		return this.insertOrUpdate(
			TABLE.messages,
			['guildId', 'channelId', 'id', 'content', 'embeds'],
			['content', 'embeds'],
			[message],
			(m) => m.guildId
		);
	}

	// ------------------
	//   Reaction roles
	// ------------------
	public async getReactionRolesForGuild(guildId: string) {
		return this.findMany<ReactionRole>(guildId, TABLE.reactionRoles, '`guildId` = ?', [guildId]);
	}
	public async saveReactionRole(reactionRole: Partial<ReactionRole>) {
		return this.insertOrUpdate(
			TABLE.reactionRoles,
			['guildId', 'channelId', 'messageId', 'emoji', 'roleId'],
			['roleId'],
			[reactionRole],
			(r) => r.guildId
		);
	}
	public async removeReactionRole(guildId: string, channelId: string, messageId: string, emoji: string) {
		await this.delete(
			guildId,
			TABLE.reactionRoles,
			'`guildId` = ? AND `channelId` = ? AND `messageId` = ? AND `emoji` = ?',
			[guildId, channelId, messageId, emoji]
		);
	}

	// ----------------------
	//   DB Sync
	// ----------------------
	private async syncDB() {
		if (this.logActions.length === 0 && this.cmdUsages.length === 0 && this.incidents.length === 0) {
			return;
		}

		console.time('syncDB');

		const newGuilds = [...this.guilds.values()];
		this.guilds.clear();
		if (newGuilds.length > 0) {
			await this.client.db.saveGuilds(
				newGuilds.map((guild) => ({
					id: guild.id,
					name: guild.name,
					icon: guild.iconURL,
					memberCount: guild.memberCount
				}))
			);
			newGuilds.forEach((g) => this.doneGuilds.add(g.id));
		}

		const newUsers = [...this.users.values()];
		this.users.clear();
		if (newUsers.length > 0) {
			await this.client.db.saveMembers(
				newUsers.map((user) => ({
					id: user.id,
					name: user.username,
					discriminator: user.discriminator,
					guildId: user.guildId
				}))
			);
			newUsers.forEach((u) => this.doneUsers.add(u.id));
		}

		const promises: Promise<any[]>[] = [];
		if (this.logActions.length > 0) {
			promises.push(this.saveLogs(this.logActions).then(() => (this.logActions = [])));
		}
		if (this.cmdUsages.length > 0) {
			promises.push(this.saveCommandUsages(this.cmdUsages).then(() => (this.cmdUsages = [])));
		}
		if (this.incidents.length > 0) {
			promises.push(this.saveIncidents(this.incidents).then(() => (this.incidents = [])));
		}

		await Promise.all(promises);

		console.timeEnd('syncDB');
	}
}
