import { Guild as DiscordGuild } from 'eris';
import mysql, { OkPacket, Pool, RowDataPacket } from 'mysql2/promise';

import { IMClient } from '../../client';
import { BasicUser } from '../../types';
import { getShardIdForGuild } from '../../util';
import { Channel } from '../models/Channel';
import { CommandUsage } from '../models/CommandUsage';
import { Guild } from '../models/Guild';
import { Incident } from '../models/Incident';
import { InviteCode } from '../models/InviteCode';
import { Log } from '../models/Log';
import { Member } from '../models/Member';
import { PremiumSubscription } from '../models/PremiumSubscription';
import { PremiumSubscriptionGuild } from '../models/PremiumSubscriptionGuild';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { ScheduledAction, ScheduledActionType } from '../models/ScheduledAction';

import { IMService } from './Service';

export const GLOBAL_SHARD_ID = 0;

export enum TABLE {
	channels = '`channels`',
	commandUsages = '`commandUsages`',
	dbStats = '`dbStats`',
	guilds = '`guilds`',
	incidents = '`incidents`',
	inviteCodes = '`inviteCodes`',
	logs = '`logs`',
	members = '`members`',
	premiumSubscriptionGuilds = '`premiumSubscriptionGuilds`',
	premiumSubscriptions = '`premiumSubscriptions`',
	rolePermissions = '`rolePermissions`',
	roles = '`roles`',
	scheduledActions = '`scheduledActions`'
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

	public getDbInfo(dbShardOrGuildId: number | string): [string, Pool] {
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

	public async findOne<T>(shard: number | string, table: string, where: string, values: any[]): Promise<T> {
		const [db, pool] = this.getDbInfo(shard);
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT ${table}.* FROM ${db}.${table} WHERE ${where} LIMIT 1`,
			values
		);
		return rows[0] as T;
	}
	public async findMany<T>(shard: number | string, table: string, where: string, values: any[]): Promise<T[]> {
		const [db, pool] = this.getDbInfo(shard);
		const [rows] = await pool.query<RowDataPacket[]>(`SELECT ${table}.* FROM ${db}.${table} WHERE ${where}`, values);
		return rows as T[];
	}
	public async findManyOnSpecificShards<T, O = string>(
		table: string,
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
	public async insertOrUpdate<T>(
		table: string,
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
	public async delete(shard: number | string, table: string, where: string, values: any[]) {
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
		return this.findManyOnSpecificShards<InviteCode>(
			TABLE.inviteCodes,
			'`guildId` IN(?) AND (maxUses = 0 OR uses < maxUses)',
			guildIds
		);
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
		return this.findManyOnSpecificShards<ScheduledAction>(
			TABLE.scheduledActions,
			'`guildId` IN (?) AND date IS NOT NULL',
			guildIds
		);
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
			await this.saveGuilds(
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
			await this.saveMembers(
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
