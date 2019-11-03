import { Guild as DiscordGuild } from 'eris';
import mysql, { OkPacket, Pool, RowDataPacket } from 'mysql2/promise';

import { IMClient } from '../../client';
import { CustomInvite } from '../../invites/models/CustomInvite';
import { Rank } from '../../invites/models/Rank';
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
import { DBStat } from '../models/DBStat';
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
import { ScheduledAction } from '../models/ScheduledAction';

const DB_COUNT = 128;

export class DatabaseService {
	private client: IMClient;
	private pools: Map<number, Pool> = new Map();

	private guilds: Set<DiscordGuild> = new Set();
	private doneGuilds: Set<String> = new Set();

	private users: Set<BasicUser> = new Set();
	private doneUsers: Set<String> = new Set();

	private logActions: Partial<Log>[] = [];
	private cmdUsages: Partial<CommandUsage>[] = [];
	private incidents: Partial<Incident>[] = [];

	public constructor(client: IMClient) {
		this.client = client;
		for (const db of client.config.databases) {
			const range = db.range;
			delete db.range;

			const pool = mysql.createPool(db);
			for (let i = range.from; i <= range.to; i++) {
				this.pools.set(i, pool);
			}
		}

		setInterval(() => this.syncDB(), 10000);
	}

	private getDbInfo(guildId: string): [number, Pool] {
		const dbId = getShardIdForGuild(guildId, DB_COUNT);
		return [dbId, this.pools.get(dbId)];
	}

	private async findOne<T>(guildId: string, table: string, where: string, values: any[]): Promise<T> {
		const [dbId, pool] = this.getDbInfo(guildId);
		const [rows] = await pool.execute<RowDataPacket[]>(
			`SELECT \`${table}\`.* FROM \`im_${dbId}\`.\`${table}\` WHERE ${where} LIMIT 1`,
			values
		);
		return rows[0] as T;
	}
	private async findMany<T, O>(table: string, where: string, values: O[], selector: (obj: O) => string): Promise<T[]> {
		const map: Map<number, [Pool, O[]]> = new Map();
		for (const value of values) {
			const id = getShardIdForGuild(selector(value), DB_COUNT);
			const poolData = map.get(id);
			if (poolData) {
				poolData[1].push(value);
			} else {
				map.set(id, [this.pools.get(id), [value]]);
			}
		}
		let rows: T[] = [];
		for (const [dbId, [pool, vals]] of map.entries()) {
			const [newRows] = await pool.query<RowDataPacket[]>(
				`SELECT \`${table}\`.* FROM \`im_${dbId}\`.\`${table}\` WHERE ${where}`,
				vals
			);
			rows = rows.concat(newRows as T[]);
		}
		return rows;
	}
	private async insertOrUpdate<T>(
		table: string,
		cols: (keyof T)[],
		updateCols: (keyof T)[],
		values: Partial<T>[],
		selector: (obj: Partial<T>) => string
	) {
		const colQuery = cols.map(c => `\`${c}\``).join(',');
		const updateQuery =
			updateCols.length > 0
				? `ON DUPLICATE KEY UPDATE ${updateCols.map(u => `\`${u}\` = VALUES(\`${u}\`)`).join(',')}`
				: '';

		const map: Map<number, [Pool, Partial<T>[]]> = new Map();
		for (const value of values) {
			const id = getShardIdForGuild(selector(value), DB_COUNT);
			const poolData = map.get(id);
			if (poolData) {
				poolData[1].push(value);
			} else {
				map.set(id, [this.pools.get(id), [value]]);
			}
		}

		const oks: OkPacket[] = [];
		for (const [dbId, [pool, rawVals]] of map.entries()) {
			const vals = rawVals.map(val =>
				cols.map(col => {
					let v: any = val[col];
					if (v instanceof Date) {
						v = v
							.toISOString()
							.slice(0, 19)
							.replace('T', ' ');
					} else if (typeof v === 'object' && v !== null) {
						v = JSON.stringify(v);
					}
					return v;
				})
			);

			const query = `INSERT INTO \`im_${dbId}\`.\`${table}\` (${colQuery}) VALUES ? ${updateQuery}`;
			const [ok] = await pool.query<OkPacket>(query, [vals]);
			oks.push(ok);
		}

		return oks;
	}
	private async delete(guildId: string, table: string, where: string, values: any[]) {
		const [dbId, pool] = this.getDbInfo(guildId);
		const [ok] = await pool.query<OkPacket>(`DELETE FROM \`im_${dbId}\`.\`${table}\` WHERE ${where}`, values);
		return ok;
	}

	// ---------
	//   Guild
	// ---------
	public async getGuild(id: string) {
		return this.findOne<Guild>(id, 'guild', '`id` = ?', [id]);
	}
	public async getBannedGuilds(ids: string[]) {
		return await this.findMany<Guild, string>('guild', '`id` IN (?) AND `banReason` IS NOT NULL', ids, id => id);
	}
	public async saveGuilds(guilds: Partial<Guild>[]) {
		await this.insertOrUpdate(
			'guild',
			['id', 'name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			['name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			guilds,
			g => g.id
		);
	}

	// ------------------
	//   Guild settings
	// ------------------
	public async getGuildSettings(guildId: string) {
		return this.findOne<GuildSetting>(guildId, 'guild_setting', '`guildId` = ?', [guildId]);
	}
	public async saveGuildSettings(settings: Partial<GuildSetting>) {
		await this.insertOrUpdate('guild_setting', ['guildId', 'value'], ['value'], [settings], s => s.guildId);
	}

	// ------------
	//   Channels
	// ------------
	public async saveChannels(channels: Partial<Channel>[]) {
		await this.insertOrUpdate('channel', ['guildId', 'id', 'name'], ['name'], channels, c => c.guildId);
	}

	// -----------
	//   Members
	// -----------
	public async getMember(id: string) {
		return this.findOne<Member>('member', '`id` = ?', [id]);
	}
	public async getMembersByName(name: string, discriminator?: string) {
		return this.findMany<Member>('member', '`name` LIKE ?' + (discriminator ? ' AND `discriminator` LIKE ?' : ''), [
			`%${name}%`,
			`%${discriminator}%`
		]);
	}
	public async saveMembers(members: Partial<Member>[]) {
		await this.insertOrUpdate('member', ['id', 'name', 'discriminator'], ['name', 'discriminator'], members);
	}

	// -------------------
	//   Member settings
	// -------------------
	public async getMemberSettingsForGuild(guildId: string) {
		return this.findMany<MemberSetting, string>('member_setting', '`guildId` = ?', [guildId], id => id);
	}
	public async saveMemberSettings(settings: Partial<MemberSetting>) {
		await this.insertOrUpdate(
			'member_setting',
			['guildId', 'memberId', 'value'],
			['value'],
			[settings],
			s => s.guildId
		);
	}

	// ---------
	//   Roles
	// ---------
	public async getRole(id: string) {
		return this.findOne<Role>('role', '`id` = ?', [id]);
	}
	public async saveRoles(roles: Partial<Role>[]) {
		await this.insertOrUpdate(
			roles[0].guildId,
			'role',
			['id', 'createdAt', 'guildId', 'name', 'color'],
			['name', 'color'],
			roles
		);
	}

	// ---------
	//   Ranks
	// ---------
	public async getRanksForGuild(guildId: string) {
		return this.findMany<Rank, string>('rank', '`guildId` = ?', [guildId], id => id);
	}
	public async saveRank(rank: Partial<Rank>) {
		await this.insertOrUpdate(
			'rank',
			['guildId', 'roleId', 'numInvites', 'description'],
			['numInvites', 'description'],
			[rank],
			r => r.guildId
		);
	}
	public async removeRank(roleId: string) {
		await this.delete('rank', `\`roleId\` = ?`, [roleId]);
	}

	// --------------------
	//   Role permissions
	// --------------------
	public async getRolePermissions(roleId: string, cmd: string) {
		return this.findOne<RolePermission>('role_permission', '`roleId` = ? AND `command` = ?', [roleId, cmd]);
	}
	public async getRolePermissionsForGuild(guildId: string, cmd?: string) {
		const cmdQuery = cmd ? `AND rp.\`command\` = ?` : '';
		return this.query<RolePermission & { roleName: string }>(
			`SELECT rp.*, r.name as roleName FROM \`role_permission\` rp INNER JOIN \`role\` r ON r.id = rp.roleId WHERE r.\`guildId\` = ? ${cmdQuery}`,
			[guildId, cmd]
		);
	}
	public async saveRolePermissions(rolePermissions: Partial<RolePermission>[]) {
		await this.insertOrUpdate('role_permission', ['roleId', 'command'], [], rolePermissions);
	}
	public async removeRolePermissions(roleId: string, command: string) {
		await this.delete('role_permission', '`roleId` = ? AND `command` = ?', [roleId, command]);
	}

	// --------------
	//   InviteCode
	// --------------
	public async getAllInviteCodesForGuilds(guildIds: string[]) {
		return this.findMany<InviteCode>('invite_code', '`guildId` IN(?)', [guildIds]);
	}
	public async getInviteCodesForGuild(guildId: string) {
		return this.query<{ total: string; id: string; name: string; discriminator: string }>(
			'SELECT SUM(ic.`uses` - ic.`clearedAmount`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator ' +
				'FROM `invite_code` ic INNER JOIN `member` m ON m.`id` = ic.`inviterId` ' +
				'WHERE ic.`guildId` = ? AND ic.`uses` > ic.`clearedAmount` GROUP BY ic.`inviterId`',
			[guildId]
		);
	}
	public async getInviteCodesForMember(guildId: string, memberId: string) {
		return this.findMany<InviteCode>(guildId, 'invite_code', '`guildId` = ? AND `inviterId` = ? ORDER BY `uses` DESC', [
			guildId,
			memberId
		]);
	}
	public async getInviteCodeTotalForMember(guildId: string, memberId: string) {
		const res = await this.query<{ total: string }>(
			'SELECT SUM(`uses` - `clearedAmount`) AS total FROM `invite_code` WHERE `guildId` = ? AND `inviterId` = ? AND `uses` > 0',
			[guildId, memberId]
		);
		if (res.length > 0) {
			const num = Number(res[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async updateInviteCodeClearedAmount(clearedAmount: number | string, guildId: string, memberId?: string) {
		const memberQuery = memberId ? 'AND `inviterId` = ?' : '';
		const clearColumn = typeof clearedAmount === 'number' ? '?' : '??';
		await this.query(`UPDATE invite_code SET \`clearedAmount\` = ${clearColumn} WHERE \`guildId\` = ? ${memberQuery}`, [
			clearedAmount,
			guildId,
			memberId
		]);
	}
	public async incrementInviteCodesUse(codes: string[]) {
		await this.query('UPDATE invite_code SET `uses` = `uses` + 1 WHERE `code` IN(?)', [codes]);
	}
	public async saveInviteCodes(inviteCodes: Partial<InviteCode>[]) {
		await this.insertOrUpdate(
			'invite_code',
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
			ic => ic.guildId
		);
	}

	// -----------------------
	//   InviteCode settings
	// -----------------------
	public async getInviteCodeSettingsForGuild(guildId: string) {
		return this.findMany<InviteCodeSetting, string>('invite_code_setting', '`guildId` = ?', [guildId], id => id);
	}
	public async saveInviteCodeSettings(settings: Partial<InviteCodeSetting>) {
		await this.insertOrUpdate(
			'invite_code_setting',
			['guildId', 'inviteCode', 'value'],
			['value'],
			[settings],
			s => s.guildId
		);
	}

	// ----------------
	//   CustomInvite
	// ----------------
	public async getCustomInvitesForMember(guildId: string, memberId: string) {
		return this.findMany<CustomInvite, string>('custom_invite', '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}
	public async getCustomInvitesForGuild(guildId: string) {
		return this.query<{ total: string; id: string; name: string; discriminator: string }>(
			'SELECT SUM(ci.`amount`) AS total, ci.`memberId` AS id, m.`name` AS name, m.`discriminator` AS discriminator ' +
				'FROM `custom_invite` ci INNER JOIN `member` m ON m.`id` = ci.`memberId` ' +
				'WHERE ci.`guildId` = ? AND ci.`cleared` = 0 GROUP BY ci.`memberId`',
			[guildId]
		);
	}
	public async getCustomInviteTotalForMember(guildId: string, memberId: string) {
		const res = await this.query<{ total: string }>(
			'SELECT SUM(`amount`) AS total FROM `custom_invite` WHERE `guildId` = ? AND `memberId` = ? AND `cleared` = 0',
			[guildId, memberId]
		);
		if (res.length > 0) {
			const num = Number(res[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async saveCustomInvite(customInvite: Partial<CustomInvite>) {
		const res = await this.insertOrUpdate(
			customInvite.guildId,
			'custom_invite',
			['guildId', 'memberId', 'creatorId', 'amount', 'reason'],
			[],
			[customInvite]
		);
		return res.insertId;
	}
	public async clearCustomInvites(cleared: boolean, guildId: string, memberId?: string) {
		const memberQuery = memberId ? 'AND `memberId` = ?' : '';
		await this.query(`UPDATE \`custom_invite\` SET \`cleared\` = ? WHERE \`guildId\` = ? ${memberQuery}`, [
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
		return this.query<AccumulatedJoin>(
			'SELECT COUNT(j.`id`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator, ' +
				'j.`invalidatedReason` AS invalidatedReason ' +
				'FROM `join` j INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` INNER JOIN `member` m ON m.`id` = ic.`inviterId` ' +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 GROUP BY ic.`inviterId`, j.`invalidatedReason`',
			[guildId]
		);
	}
	public async getMaxJoinIdsForGuild(guildId: string) {
		const res = await this.execute<{ id: string }>(
			'SELECT MAX(j.`id`) AS id FROM `join` j WHERE j.`guildId` = ? GROUP BY j.`exactMatchCode`, j.`memberId`',
			[guildId]
		);
		return res.map(r => Number(r.id));
	}
	public async getInvalidatedJoinsForMember(guildId: string, memberId: string) {
		return this.query<{ total: string; invalidatedReason: JoinInvalidatedReason }>(
			'SELECT COUNT(j.`id`) AS total, j.`invalidatedReason` AS invalidatedReason FROM `join` j ' +
				'INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` WHERE j.`guildId` = ? AND ' +
				'j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 AND ic.`inviterId` = ? GROUP BY j.`invalidatedReason`',
			[guildId, memberId]
		);
	}
	public async getJoinsPerDay(guildId: string, days: number) {
		return this.query<{ year: string; month: string; day: string; total: string }>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				'FROM `join` ' +
				'WHERE `guildId` = ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`) ' +
				'ORDER BY MAX(`createdAt`) ASC ' +
				'LIMIT ? ',
			[guildId, days]
		);
	}
	public async getFirstJoinForMember(guildId: string, memberId: string) {
		const res = await this.execute<Join>(
			'SELECT j.* FROM `join` j ' +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` ASC LIMIT 1',
			[guildId, memberId]
		);
		return res[0];
	}
	public async getPreviousJoinForMember(guildId: string, memberId: string) {
		const res = await this.execute<Join>(
			'SELECT j.* FROM `join` j ' +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 1,1',
			[guildId, memberId]
		);
		return res[0];
	}
	public async getNewestJoinForMember(guildId: string, memberId: string) {
		type ExtendedJoin = Join & {
			inviterId: string;
			inviterName: string;
			inviterDiscriminator: string;
			channelId: string;
			channelName: string;
		};
		const res = await this.execute<ExtendedJoin>(
			'SELECT j.*, m.`id` AS inviterId, m.`name` AS inviterName, m.`discriminator` AS inviterDiscriminator, ' +
				'c.`id` AS channelId, c.`name` AS channelName ' +
				'FROM `join` j ' +
				'INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` ' +
				'INNER JOIN `member` m ON m.`id` = ic.`inviterId` ' +
				'INNER JOIN `channel` c ON c.`id` = ic.`channelId` ' +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ' +
				'ORDER BY j.`createdAt` DESC LIMIT 1',
			[guildId, memberId]
		);
		return res[0];
	}
	public async getJoinsForMember(guildId: string, memberId: string) {
		return this.execute<Join & { inviterId: string }>(
			'SELECT j.*, ic.`inviterId` AS inviterId FROM `join` j INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` ' +
				'WHERE j.`guildId` = ? AND j.`memberId` = ? ORDER BY j.`createdAt` DESC LIMIT 100',
			[guildId, memberId]
		);
	}
	public async getTotalJoinsForMember(guildId: string, memberId: string) {
		const res = await this.execute<{ total: string }>(
			'SELECT COUNT(j.`id`) AS total FROM `join` j WHERE j.`guildId` = ? AND j.`memberId` = ?',
			[guildId, memberId]
		);
		return Number(res[0].total);
	}
	public async getInvitedMembers(guildId: string, memberId: string) {
		return this.execute<{ memberId: string; createdAt: string }>(
			'SELECT j.`memberId` AS memberId, MAX(j.`createdAt`) AS createdAt FROM `join` j ' +
				'INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` ' +
				'WHERE j.`guildId` = ? AND `invalidatedReason` IS NULL AND ic.`inviterId` = ? ' +
				'GROUP BY j.`memberId` ' +
				'ORDER BY MAX(j.`createdAt`) DESC ',
			[guildId, memberId]
		);
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
		if (search && search.memberId) {
			reasonQuery = 'AND `invalidatedReason` = ?';
			vals.push(search.invalidatedReason);
		}
		let memberQuery = '';
		if (search && search.memberId) {
			memberQuery = 'AND `memberId` = ?';
			vals.push(search.memberId);
		}
		let joinQuery = '';
		if (search && search.memberId) {
			joinQuery = 'AND `id` = ?';
			vals.push(search.joinId);
		}
		let ignoredJoinQuery = '';
		if (search && search.memberId) {
			ignoredJoinQuery = 'AND `id` != ?';
			vals.push(search.ignoredJoinId);
		}

		if (Object.values(JoinInvalidatedReason).includes(newInvalidatedReason as any)) {
			newInvalidatedReason = `'${newInvalidatedReason}'`;
		}
		const [dbId, pool] = this.getDbInfo(guildId);
		const [ok] = await pool.query<OkPacket>(
			`UPDATE \`im_${dbId}\`.\`join\` SET \`invalidatedReason\` = ${newInvalidatedReason} WHERE \`guildId\` = ? ` +
				`${reasonQuery} ${memberQuery} ${joinQuery} ${ignoredJoinQuery}`,
			vals
		);
		return ok.affectedRows;
	}
	public async updateJoinClearedStatus(newCleared: boolean, guildId: string, exactMatchCodes: string[]) {
		const codeQuery = exactMatchCodes.length > 0 ? 'AND `exactMatchCode` IN(?)' : '';
		await this.query(`UPDATE \`join\` SET \`cleared\` = ? WHERE \`guildId\` = ? ${codeQuery}`, [
			newCleared,
			guildId,
			exactMatchCodes
		]);
	}
	public async saveJoin(join: Partial<Join>) {
		const res = await this.insertOrUpdate(
			join.guildId,
			'join',
			['guildId', 'createdAt', 'memberId', 'exactMatchCode', 'invalidatedReason', 'cleared'],
			[],
			[join]
		);
		return res.insertId;
	}

	// ---------
	//   Leave
	// ---------
	public async saveLeave(leave: Partial<Leave>) {
		const res = await this.insertOrUpdate(leave.guildId, 'leave', ['guildId', 'memberId', 'joinId'], [], [leave]);
		return res.insertId;
	}
	public async getLeavesPerDay(guildId: string, days: number) {
		return this.query<{ year: string; month: string; day: string; total: string }>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, COUNT(`id`) AS total ' +
				'FROM `leave` ' +
				'WHERE `guildId` = ? ' +
				'GROUP BY YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`) ' +
				'ORDER BY MAX(`createdAt`) ASC ' +
				'LIMIT ? ',
			[guildId, days]
		);
	}
	public async subtractLeaves(guildId: string, autoSubtractLeaveThreshold: number) {
		return this.query(
			'UPDATE `join` j LEFT JOIN `leave` l ON l.`joinId` = j.`id` SET `invalidatedReason` = ' +
				'CASE WHEN l.`id` IS NULL OR TIMESTAMPDIFF(SECOND, j.`createdAt`, l.`createdAt`) > ? THEN NULL ELSE "leave" END ' +
				'WHERE j.`guildId` = ? AND (j.`invalidatedReason` IS NULL OR j.`invalidatedReason` = "leave")',
			[guildId, autoSubtractLeaveThreshold]
		);
	}

	// ----------------
	//   Bot settings
	// ----------------
	public async getBotSettings(botId: string) {
		return this.findOne<BotSetting>('bot_setting', '`id` = ?', [botId]);
	}
	public async saveBotSettings(settings: Partial<BotSetting>) {
		await this.insertOrUpdate('bot_setting', ['id', 'value'], ['value'], [settings]);
	}

	// --------
	//   Logs
	// --------
	public saveLog(guild: DiscordGuild, user: BasicUser, action: Partial<Log>) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add(user);
		}

		this.logActions.push(action);
	}
	private async saveLogs(logs: Partial<Log>[]) {
		await this.insertOrUpdate('log', ['guildId', 'memberId', 'action', 'message', 'data'], [], logs);
	}

	// ------------------
	//   Command usages
	// ------------------
	public saveCommandUsage(guild: DiscordGuild, user: BasicUser, cmdUsage: Partial<CommandUsage>) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add(user);
		}

		this.cmdUsages.push(cmdUsage);
	}
	private async saveCommandUsages(commandUsages: Partial<CommandUsage>[]) {
		await this.insertOrUpdate(
			'command_usage',
			['guildId', 'memberId', 'command', 'args', 'time', 'errored'],
			[],
			commandUsages
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
		await this.insertOrUpdate('incident', ['guildId', 'error', 'details'], [], indicents);
	}

	// ------------
	//   DB stats
	// ------------
	public async getDbStats() {
		const stats = await this.findMany<DBStat>('db_stat', '`key` IN(?)', [['guilds', 'members']]);
		return {
			guilds: stats.find(stat => stat.key === 'guilds').value,
			members: stats.find(stat => stat.key === 'members').value
		};
	}

	// ---------------
	//   Music nodes
	// ---------------
	public async getMusicNodes() {
		const typeFilter =
			this.client.type === BotType.custom ? 'isCustom' : this.client.type === BotType.pro ? 'isPremium' : 'isRegular';
		return this.findMany<MusicNode>('music_node', `${typeFilter} = 1`, []);
	}

	// ---------------------
	//   Scheduled actions
	// ---------------------
	public async getScheduledAction(id: number) {
		return this.findOne<ScheduledAction>('scheduled_action', '`id` = ?', [id]);
	}
	public async getScheduledActionsForGuilds(guildIds: string[]) {
		return this.findMany<ScheduledAction>('scheduled_action', '`guildId` IN (?)', [guildIds]);
	}
	public async saveScheduledAction(action: Partial<ScheduledAction>) {
		const res = await this.insertOrUpdate(
			action.guildId,
			'scheduled_action',
			['guildId', 'date', 'actionType', 'args', 'reason'],
			[],
			[action]
		);
		return res.insertId;
	}
	public async removeScheduledAction(id: number) {
		await this.delete('scheduled_action', '`id` = ?', [id]);
	}

	// ------------------------
	//   Premium subscription
	// ------------------------
	public async getActivePremiumSubscriptionForMember(memberId: string) {
		return this.findOne<PremiumSubscription>('premium_subscription', '`memberId` = ? AND `validUntil` > NOW()', [
			memberId
		]);
	}
	public async savePremiumSubscription(sub: Partial<PremiumSubscription>) {
		const res = await this.insertOrUpdate(
			'premium_subscription',
			['memberId', 'validUntil', 'isFreeTier', 'amount', 'maxGuilds', 'reason'],
			['validUntil'],
			[sub]
		);
		return res.insertId;
	}

	// ------------------------------
	//   Premium subscription guild
	// ------------------------------
	public async getFreePremiumSubscriptionGuildForGuild(guildId: string) {
		const res = await this.query<PremiumSubscriptionGuild>(
			`SELECT psg.* FROM \`premium_subscription_guild\` psg INNER JOIN \`premium_subscription\` ps ON ps.\`id\` = psg.\`subscriptionId\`` +
				` WHERE psg.\`guildId\` = ? AND ps.\`isFreeTier\` = 1 LIMIT 1`,
			[guildId]
		);
		return res[0];
	}
	public async getPremiumSubscriptionGuildsForSubscription(subscriptionId: number) {
		return this.execute<PremiumSubscriptionGuild & { guildName: string }>(
			'SELECT psg.*, g.`name` as guildName FROM `premium_subscription_guild` psg ' +
				'INNER JOIN `guild` g ON g.`id` = psg.`guildId` WHERE psg.`subscriptionId` = ?',
			[subscriptionId]
		);
	}
	public async getActivePremiumSubscriptionGuildForGuild(guildId: string) {
		const res = await this.query<PremiumSubscriptionGuild>(
			`SELECT psg.* FROM \`premium_subscription_guild\` psg INNER JOIN \`premium_subscription\` ps ON ps.\`id\` = psg.\`subscriptionId\`` +
				` WHERE psg.\`guildId\` = ? AND ps.\`validUntil\` > NOW() LIMIT 1`,
			[guildId]
		);
		return res[0];
	}
	public async savePremiumSubscriptionGuild(sub: Partial<PremiumSubscriptionGuild>) {
		await this.insertOrUpdate(sub.guildId, 'premium_subscription_guild', ['guildId', 'subscriptionId'], [], [sub]);
	}
	public async removePremiumSubscriptionGuild(guildId: string, subscriptionId: number) {
		await this.delete(guildId, 'premium_subscription_guild', '`guildId` = ? AND `subscriptionId` = ?', [
			guildId,
			subscriptionId
		]);
	}

	// ----------
	//   Strike
	// ----------
	public async getStrike(guildId: string, id: number) {
		type ExtendedStrike = Strike & { memberName: string; memberDiscriminator: string; memberCreatedAt: string };
		const res = await this.execute<ExtendedStrike>(
			'SELECT s.*, m.`name` as memberName, m.`discriminator` as memberDiscriminator, m.`createdAt` as memberCreatedAt ' +
				'FROM `strike` s INNER JOIN `member` m ON m.`id` = s.`memberId` WHERE s.`guildId` = ? AND s.`id` = ?',
			[guildId, id]
		);
		return res[0];
	}
	public async getStrikesForMember(guildId: string, memberId: string) {
		return this.findMany<Strike>(guildId, 'strike', '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
	}
	public async getStrikeAmount(guildId: string, memberId: string) {
		const res = await this.query<{ total: string }>(
			'SELECT SUM(amount) AS total FROM `strike` WHERE `guildId` = ? AND `memberId` = ?',
			[guildId, memberId]
		);
		if (res.length > 0) {
			const num = Number(res[0].total);
			return isFinite(num) ? num : 0;
		}
		return 0;
	}
	public async saveStrike(strike: Partial<Strike>) {
		await this.insertOrUpdate(strike.guildId, 'strike', ['guildId', 'memberId', 'type', 'amount'], [], [strike]);
	}
	public async removeStrike(guildId: string, id: number) {
		await this.delete(guildId, 'strike', '`guildId` = ? AND `id` = ?', [guildId, id]);
	}

	// ------------------
	//   Strike configs
	// ------------------
	public async getStrikeConfigsForGuild(guildId: string) {
		return this.findMany<StrikeConfig>(guildId, 'strike_config', '`guildId` = ? ORDER BY `amount` DESC', [guildId]);
	}
	public async saveStrikeConfig(config: Partial<StrikeConfig>) {
		await this.insertOrUpdate(config.guildId, 'strike_config', ['guildId', 'type', 'amount'], ['amount'], [config]);
	}
	public async removeStrikeConfig(guildId: string, type: ViolationType) {
		await this.delete(guildId, 'strike_config', '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	// --------------
	//   Punishment
	// --------------
	public async getPunishment(guildId: string, id: number) {
		return this.findOne<Punishment>(guildId, 'punishment', '`guildId` = ? AND id = ?', [guildId, id]);
	}
	public async savePunishment(punishment: Partial<Punishment>) {
		await this.insertOrUpdate(
			punishment.guildId,
			'punishment',
			['guildId', 'type', 'amount', 'args', 'creatorId', 'memberId', 'reason'],
			[],
			[punishment]
		);
	}
	public async removePunishment(guildId: string, id: number) {
		await this.delete(guildId, 'punishment', '`guildId` = ? AND `id` = ?', [guildId, id]);
	}
	public async getPunishmentsForMember(guildId: string, memberId: string) {
		return this.findMany<Punishment>(guildId, 'punishment', '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
	}

	// ----------------------
	//   Punishment configs
	// ----------------------
	public async getPunishmentConfigsForGuild(guildId: string) {
		return this.findMany<PunishmentConfig>(guildId, 'punishment_config', '`guildId` = ? ORDER BY `amount` DESC', [
			guildId
		]);
	}
	public async savePunishmentConfig(config: Partial<PunishmentConfig>) {
		await this.insertOrUpdate(
			config.guildId,
			'punishment_config',
			['guildId', 'type', 'amount', 'args'],
			['amount', 'args'],
			[config]
		);
	}
	public async removePunishmentConfig(guildId: string, type: PunishmentType) {
		await this.delete(guildId, 'punishment_config', '`guildId` = ? AND `type` = ?', [guildId, type]);
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
				newGuilds.map(guild => ({
					id: guild.id,
					name: guild.name,
					icon: guild.icon,
					memberCount: guild.memberCount
				}))
			);
			newGuilds.forEach(g => this.doneGuilds.add(g.id));
		}

		const newUsers = [...this.users.values()];
		this.users.clear();
		if (newUsers.length > 0) {
			await this.client.db.saveMembers(
				newUsers.map(user => ({
					id: user.id,
					name: user.username,
					discriminator: user.discriminator
				}))
			);
			newUsers.forEach(u => this.doneUsers.add(u.id));
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
