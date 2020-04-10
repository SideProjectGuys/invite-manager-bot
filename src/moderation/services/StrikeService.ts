import { Guild, TextChannel, User } from 'eris';
import i18n from 'i18n';

import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { DatabaseService, TABLE as BASE_TABLE } from '../../framework/services/Database';
import { MessagingService } from '../../framework/services/Messaging';
import { IMService } from '../../framework/services/Service';
import { GuildSettingsCache } from '../../settings/cache/GuildSettings';
import { BasicUser } from '../../types';
import { ModerationGuildSettings } from '../models/GuildSettings';
import { Strike } from '../models/Strike';
import { StrikeConfig, ViolationType } from '../models/StrikeConfig';

import { ModerationService } from './Moderation';

enum TABLE {
	strikeConfigs = '`strikeConfigs`',
	strikes = '`strikes`'
}

export class StrikeService extends IMService {
	@Service() private db: DatabaseService;
	@Service(() => ModerationService) private mod: ModerationService;
	@Service() private msg: MessagingService;
	@Cache() private guildSettingsCache: GuildSettingsCache;

	public async getStrike(guildId: string, id: number) {
		type ExtendedStrike = Strike & { memberName: string; memberDiscriminator: string; memberCreatedAt: string };
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
			'SELECT s.*, m.`name` as memberName, m.`discriminator` as memberDiscriminator, m.`createdAt` as memberCreatedAt ' +
				`FROM ${db}.${TABLE.strikes} s INNER JOIN ${db}.${BASE_TABLE.members} m ON m.\`id\` = s.\`memberId\` WHERE s.\`guildId\` = ? AND s.\`id\` = ?`,
			[guildId, id]
		);
		return rows[0] as ExtendedStrike;
	}
	public async getStrikesForMember(guildId: string, memberId: string) {
		return this.db.findMany<Strike>(guildId, TABLE.strikes, '`guildId` = ? AND `memberId` = ?', [guildId, memberId]);
	}
	public async getStrikeAmount(guildId: string, memberId: string) {
		const [db, pool] = this.db.getDbInfo(guildId);
		const [rows] = await pool.query<any[]>(
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
		await this.db.insertOrUpdate(
			TABLE.strikes,
			['guildId', 'memberId', 'type', 'amount'],
			[],
			[strike],
			(s) => s.guildId
		);
	}
	public async removeStrike(guildId: string, id: number) {
		await this.db.delete(guildId, TABLE.strikes, '`guildId` = ? AND `id` = ?', [guildId, id]);
	}

	public async getStrikeConfigsForGuild(guildId: string) {
		return this.db.findMany<StrikeConfig>(guildId, TABLE.strikeConfigs, '`guildId` = ? ORDER BY `amount` DESC', [
			guildId
		]);
	}
	public async saveStrikeConfig(config: Partial<StrikeConfig>) {
		await this.db.insertOrUpdate(
			TABLE.strikeConfigs,
			['guildId', 'type', 'amount'],
			['amount'],
			[config],
			(c) => c.guildId
		);
	}
	public async removeStrikeConfig(guildId: string, type: ViolationType) {
		await this.db.delete(guildId, TABLE.strikeConfigs, '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	public async strike(
		guild: Guild,
		user: BasicUser,
		type: ViolationType,
		amount: number,
		modAndReason?: { user: User; reason: string },
		extras?: { name: string; value: string }[]
	) {
		await this.informAboutStrike(guild, user, type, amount, modAndReason);

		const strikesBefore = await this.getStrikeAmount(guild.id, user.id);

		await this.saveStrike({
			guildId: guild.id,
			memberId: user.id,
			amount: amount,
			type
		});

		await this.logStrikeModAction(guild, user, type, amount, modAndReason, extras);

		return strikesBefore;
	}

	private async informAboutStrike(
		guild: Guild,
		user: BasicUser,
		type: ViolationType,
		amount: number,
		modAndReason?: { user: User; reason: string }
	) {
		const dmChannel = await this.client.getDMChannel(user.id);
		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);

		let message = i18n.__(
			{ locale: settings.lang, phrase: 'moderation.strikes.dm' },
			{ amount: `${amount}`, type, guild: guild.name }
		);

		if (modAndReason) {
			message += `\n\n**Reason**: ${modAndReason.reason}`;
		}

		return dmChannel.createMessage(message).catch(async () => {
			if (settings.modLogChannel) {
				const channel = guild.channels.get(settings.modLogChannel);
				if (channel && channel instanceof TextChannel) {
					const embed = this.msg.createEmbed({
						title: `Couldn't send DM to user`,
						fields: [
							{
								name: 'User',
								value: `${user.username}#${user.discriminator} ` + `(ID: ${user.id})`
							},
							{
								name: 'Message',
								value: message
							}
						]
					});
					await channel.createMessage({ embed });
				}
			}
		});
	}

	private async logStrikeModAction(
		guild: Guild,
		user: BasicUser,
		type: ViolationType,
		amount: number,
		modAndReason?: { user: User; reason: string },
		extra?: { name: string; value: string }[]
	) {
		const logEmbed = this.mod.createBasicEmbed(modAndReason && modAndReason.user);
		logEmbed.color = 16756480; // orange

		const usr = `${user.username}#${user.discriminator}`;
		logEmbed.description += `**User**: ${usr} (ID: ${user.id})\n`;
		logEmbed.description += `**Violation**: ${type}\n`;

		if (amount > 0) {
			logEmbed.description += `**Strikes given**: ${amount}\n`;
		} else {
			logEmbed.description += `No strikes given.\n`;
		}

		if (modAndReason) {
			logEmbed.description += `**Reason**: ${modAndReason.reason}\n`;
		}

		if (extra) {
			extra.filter((e) => !!e.value).forEach((e) => logEmbed.fields.push(e));
		}

		const modLogChannelId = (await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id)).modLogChannel;
		if (modLogChannelId) {
			const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
			if (logChannel) {
				await this.msg.sendEmbed(logChannel, logEmbed);
			}
		}
	}
}
