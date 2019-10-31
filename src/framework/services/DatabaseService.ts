import mysql, { OkPacket, Pool, RowDataPacket } from 'mysql2/promise';

import { IMClient } from '../../client';
import { BotSetting } from '../../models/BotSetting';
import { Channel } from '../../models/Channel';
import { CommandUsage } from '../../models/CommandUsage';
import { CustomInvite } from '../../models/CustomInvite';
import { DBStat } from '../../models/DBStat';
import { Guild } from '../../models/Guild';
import { GuildSetting } from '../../models/GuildSetting';
import { Incident } from '../../models/Incident';
import { InviteCode } from '../../models/InviteCode';
import { InviteCodeSetting } from '../../models/InviteCodeSetting';
import { Join, JoinInvalidatedReason } from '../../models/Join';
import { Leave } from '../../models/Leave';
import { Log } from '../../models/Log';
import { Member } from '../../models/Member';
import { MemberSetting } from '../../models/MemberSetting';
import { MusicNode } from '../../models/MusicNode';
import { PremiumSubscription } from '../../models/PremiumSubscription';
import { PremiumSubscriptionGuild } from '../../models/PremiumSubscriptionGuild';
import { Punishment } from '../../models/Punishment';
import { PunishmentConfig, PunishmentType } from '../../models/PunishmentConfig';
import { Rank } from '../../models/Rank';
import { Role } from '../../models/Role';
import { RolePermission } from '../../models/RolePermission';
import { ScheduledAction } from '../../models/ScheduledAction';
import { Strike } from '../../models/Strike';
import { StrikeConfig, ViolationType } from '../../models/StrikeConfig';
import { BotType } from '../../types';

export class DatabaseService {
	private client: IMClient;
	private pool: Pool;

	public constructor(client: IMClient) {
		this.client = client;
		this.pool = mysql.createPool(client.config.database);
	}

	private async query<T>(query: string, values: any[]) {
		const [rows] = await this.pool.query<RowDataPacket[]>(query, values);
		return rows as T[];
	}
	private async execute<T>(query: string, values: any[]) {
		const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);
		return rows as T[];
	}
	private async findOne<T>(table: string, where: string, values: any[]): Promise<T> {
		const res = await this.execute<T>(`SELECT \`${table}\`.* FROM \`${table}\` WHERE ${where} LIMIT 1`, values);
		return res[0];
	}
	private async findMany<T>(table: string, where: string, values: any[]): Promise<T[]> {
		return this.query<T>(`SELECT \`${table}\`.* FROM \`${table}\` WHERE ${where}`, values);
	}
	private async insertOrUpdate<T>(table: string, cols: (keyof T)[], updateCols: (keyof T)[], values: Partial<T>[]) {
		const colQuery = cols.map(c => `\`${c}\``).join(',');
		const updateQuery =
			updateCols.length > 0
				? `ON DUPLICATE KEY UPDATE ${updateCols.map(u => `\`${u}\` = VALUES(\`${u}\`)`).join(',')}`
				: '';
		const query = `INSERT INTO \`${table}\` (${colQuery}) VALUES ? ${updateQuery}`;

		const vals = values.map(val =>
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

		const [ok] = await this.pool.query<OkPacket>(query, [vals]);
		return ok;
	}
	private async delete(table: string, where: string, values: any[]) {
		const [ok] = await this.pool.execute<OkPacket>(`DELETE FROM \`${table}\` WHERE ${where}`, values);
		return ok;
	}

	// ---------
	//   Guild
	// ---------
	public async getGuild(id: string) {
		return this.findOne<Guild>('guild', '`id` = ?', [id]);
	}
	public async getBannedGuilds(ids: string[]) {
		return this.findMany<Guild>('guild', '`id` IN (?) AND `banReason` IS NOT NULL', ids);
	}
	public async saveGuilds(guilds: Partial<Guild>[]) {
		await this.insertOrUpdate(
			'guild',
			['id', 'name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			['name', 'icon', 'memberCount', 'banReason', 'deletedAt'],
			guilds
		);
	}

	// ------------------
	//   Guild settings
	// ------------------
	public async getGuildSettings(guildId: string) {
		return this.findOne<GuildSetting>('guild_setting', '`guildId` = ?', [guildId]);
	}
	public async saveGuildSettings(settings: Partial<GuildSetting>) {
		await this.insertOrUpdate('guild_setting', ['guildId', 'value'], ['value'], [settings]);
	}

	// ------------
	//   Channels
	// ------------
	public async saveChannels(channels: Partial<Channel>[]) {
		await this.insertOrUpdate('channel', ['guildId', 'id', 'name'], ['name'], channels);
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
		return this.findMany<MemberSetting>('member_setting', '`guildId` = ?', [guildId]);
	}
	public async saveMemberSettings(settings: Partial<MemberSetting>) {
		await this.insertOrUpdate('member_setting', ['guildId', 'memberId', 'value'], ['value'], [settings]);
	}

	// ---------
	//   Roles
	// ---------
	public async getRole(id: string) {
		return this.findOne<Role>('role', '`id` = ?', [id]);
	}
	public async saveRoles(roles: Partial<Role>[]) {
		await this.insertOrUpdate('role', ['id', 'createdAt', 'guildId', 'name', 'color'], ['name', 'color'], roles);
	}

	// ---------
	//   Ranks
	// ---------
	public async getRanksForGuild(guildId: string) {
		return this.findMany<Rank>('rank', '`guildId` = ?', [guildId]);
	}
	public async saveRanks(ranks: Partial<Rank>[]) {
		await this.insertOrUpdate(
			'rank',
			['guildId', 'roleId', 'numInvites', 'description'],
			['numInvites', 'description'],
			ranks
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
		return this.findMany<InviteCode>('invite_code', '`guildId` = ? AND `inviterId` = ? ORDER BY `uses` DESC', [
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
		const memberQuery = memberId ? 'AND `memberId` = ?' : '';
		await this.query(`UPDATE invite_code SET \`clearedAmount\` = ?? WHERE \`guildId\` = ? ${memberQuery}`, [
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
			inviteCodes
		);
	}

	// -----------------------
	//   InviteCode settings
	// -----------------------
	public async getInviteCodeSettingsForGuild(guildId: string) {
		return this.findMany<InviteCodeSetting>('invite_code_setting', '`guildId` = ?', [guildId]);
	}
	public async saveInviteCodeSettings(settings: Partial<InviteCodeSetting>) {
		await this.insertOrUpdate('invite_code_setting', ['guildId', 'inviteCode', 'value'], ['value'], [settings]);
	}

	// ----------------
	//   CustomInvite
	// ----------------
	public async getCustomInvitesForMember(guildId: string, memberId: string) {
		return this.findMany<CustomInvite>('custom_invite', '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
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
		return this.query<{
			total: string;
			id: string;
			name: string;
			discriminator: string;
			invalidatedReason: JoinInvalidatedReason;
		}>(
			'SELECT COUNT(j.`id`) AS total, ic.`inviterId` AS id, m.`name` AS name, m.`discriminator` AS discriminator, j.`invalidatedReason` AS invalidatedReason ' +
				'FROM `join` j INNER JOIN `invite_code` ic ON ic.`code` = j.`exactMatchCode` INNER JOIN `member` m ON m.`id` = ic.`inviterId` ' +
				'WHERE j.`guildId` = ? AND j.`invalidatedReason` IS NOT NULL AND j.`cleared` = 0 GROUP BY ic.`inviterId`, j.`invalidatedReason`',
			[guildId]
		);
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
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, ' +
				'COUNT(`id`) AS total FROM `join` WHERE `guildId` = ? ORDER BY `MAX(createdAt)` GROUP BY ' +
				'YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`) LIMIT ?',
			[guildId, days]
		);
	}
	public async saveJoin(join: Partial<Join>) {
		const res = await this.insertOrUpdate(
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
		const res = await this.insertOrUpdate('leave', ['guildId', 'memberId', 'joinId'], [], [leave]);
		return res.insertId;
	}
	public async getLeavesPerDay(guildId: string, days: number) {
		return this.query<{ year: string; month: string; day: string; total: string }>(
			'SELECT YEAR(`createdAt`) AS year, MONTH(`createdAt`) AS month, DAY(`createdAt`) AS day, ' +
				'COUNT(`id`) AS total FROM `leave` WHERE `guildId` = ? ORDER BY `MAX(createdAt)` GROUP BY ' +
				'YEAR(`createdAt`), MONTH(`createdAt`), DAY(`createdAt`) LIMIT ?',
			[guildId, days]
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
	public async saveLogs(logs: Partial<Log>[]) {
		await this.insertOrUpdate('log', ['guildId', 'memberId', 'action', 'message', 'data'], [], logs);
	}

	// ------------------
	//   Command usages
	// ------------------
	public async saveCommandUsages(commandUsages: Partial<CommandUsage>[]) {
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
	public async saveIncidents(indicents: Partial<Incident>[]) {
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
		return this.findMany<PremiumSubscriptionGuild>('premium_subscription_guild', '`subscriptionId` = ?', [
			subscriptionId
		]);
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
		await this.insertOrUpdate('premium_subscription_guild', ['guildId', 'subscriptionId'], [], [sub]);
	}
	public async removePremiumSubscriptionGuild(guildId: string, subscriptionId: number) {
		await this.delete('premium_subscription_guild', '`guildId` = ? AND `subscriptionId` = ?', [
			guildId,
			subscriptionId
		]);
	}

	// ----------
	//   Strike
	// ----------
	public async getStrike(guildId: string, id: number) {
		return this.findOne<Strike>('strike', '`guildId` = ? AND `id` = ?', [guildId, id]);
	}
	public async getStrikesForMember(guildId: string, memberId: string) {
		return this.findMany<Strike>('strike', '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
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
		await this.insertOrUpdate('strike', ['guildId', 'memberId', 'type', 'amount'], [], [strike]);
	}
	public async removeStrike(guildId: string, id: number) {
		await this.delete('strike', '`guildId` = ? AND `id` = ?', [guildId, id]);
	}

	// ------------------
	//   Strike configs
	// ------------------
	public async getStrikeConfigsForGuild(guildId: string) {
		return this.findMany<StrikeConfig>('strike_config', '`guildId` = ? ORDER BY `amount` DESC', [guildId]);
	}
	public async saveStrikeConfig(config: Partial<StrikeConfig>) {
		await this.insertOrUpdate('strike_config', ['guildId', 'type', 'amount'], ['amount'], [config]);
	}
	public async removeStrikeConfig(guildId: string, type: ViolationType) {
		await this.delete('strike_config', '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	// --------------
	//   Punishment
	// --------------
	public async getPunishment(guildId: string, id: number) {
		return this.findOne<Punishment>('punishment', '`guildId` = ? AND id = ?', [guildId, id]);
	}
	public async savePunishment(punishment: Partial<Punishment>) {
		await this.insertOrUpdate(
			'punishment',
			['guildId', 'type', 'amount', 'args', 'creatorId', 'memberId', 'reason'],
			[],
			[punishment]
		);
	}
	public async removePunishment(guildId: string, id: number) {
		await this.delete('punishment', '`guildId` = ? AND `id` = ?', [guildId, id]);
	}
	public async getPunishmentsForMember(guildId: string, memberId: string) {
		return this.findMany<Punishment>('punishment', '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
	}

	// ----------------------
	//   Punishment configs
	// ----------------------
	public async getPunishmentConfigsForGuild(guildId: string) {
		return this.findMany<PunishmentConfig>('punishment_config', '`guildId` = ? ORDER BY `amount` DESC', [guildId]);
	}
	public async savePunishmentConfig(config: Partial<PunishmentConfig>) {
		await this.insertOrUpdate('punishment_config', ['guildId', 'type', 'amount', 'args'], ['amount', 'args'], [config]);
	}
	public async removePunishmentConfig(guildId: string, type: PunishmentType) {
		await this.delete('punishment_config', '`guildId` = ? AND `type` = ?', [guildId, type]);
	}
}
