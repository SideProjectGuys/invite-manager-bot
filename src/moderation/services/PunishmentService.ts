import { Guild, TextChannel, User } from 'eris';
import i18n from 'i18n';

import { GuildSettingsCache } from '../../framework/cache/GuildSettings';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { DatabaseService } from '../../framework/services/Database';
import { MessagingService } from '../../framework/services/Messaging';
import { IMService } from '../../framework/services/Service';
import { BasicUser } from '../../types';
import { ModerationGuildSettings } from '../models/GuildSettings';
import { Punishment } from '../models/Punishment';
import { PunishmentConfig, PunishmentType } from '../models/PunishmentConfig';

import { ModerationService } from './Moderation';

enum TABLE {
	punishmentConfigs = '`punishmentConfigs`',
	punishments = '`punishments`'
}

type PunishmentFunctions = {
	[key in PunishmentType]: (guild: Guild, user: BasicUser, reason: string, args: any[]) => Promise<boolean>;
};

export class PunishmentService extends IMService {
	@Service() private db: DatabaseService;
	@Service() private mod: ModerationService;
	@Service() private msg: MessagingService;
	@Cache() private guildSettingsCache: GuildSettingsCache;

	private punishmentFunctions: PunishmentFunctions = {
		[PunishmentType.ban]: this.ban.bind(this),
		[PunishmentType.kick]: this.kick.bind(this),
		[PunishmentType.softban]: this.softban.bind(this),
		[PunishmentType.warn]: this.warn.bind(this),
		[PunishmentType.mute]: this.mute.bind(this)
	};

	public async getPunishment(guildId: string, id: number) {
		return this.db.findOne<Punishment>(guildId, TABLE.punishments, '`guildId` = ? AND id = ?', [guildId, id]);
	}
	public async savePunishment(punishment: Partial<Punishment>) {
		await this.db.insertOrUpdate(
			TABLE.punishments,
			['guildId', 'type', 'amount', 'args', 'creatorId', 'memberId', 'reason'],
			[],
			[punishment],
			(p) => p.guildId
		);
	}
	public async removePunishment(guildId: string, id: number) {
		await this.db.delete(guildId, TABLE.punishments, '`guildId` = ? AND `id` = ?', [guildId, id]);
	}
	public async getPunishmentsForMember(guildId: string, memberId: string) {
		return this.db.findMany<Punishment>(guildId, TABLE.punishments, '`guildId` = ? AND `memberId` = ?', [
			guildId,
			memberId
		]);
	}

	public async getPunishmentConfigsForGuild(guildId: string) {
		return this.db.findMany<PunishmentConfig>(
			guildId,
			TABLE.punishmentConfigs,
			'`guildId` = ? ORDER BY `amount` DESC',
			[guildId]
		);
	}
	public async savePunishmentConfig(config: Partial<PunishmentConfig>) {
		await this.db.insertOrUpdate(
			TABLE.punishmentConfigs,
			['guildId', 'type', 'amount', 'args'],
			['amount', 'args'],
			[config],
			(c) => c.guildId
		);
	}
	public async removePunishmentConfig(guildId: string, type: PunishmentType) {
		await this.db.delete(guildId, TABLE.punishmentConfigs, '`guildId` = ? AND `type` = ?', [guildId, type]);
	}

	public async punish(
		guild: Guild,
		user: BasicUser,
		type: PunishmentType,
		amount: number,
		modAndReason?: { user: User; reason: string },
		args?: any[],
		extras?: { name: string; value: string }[]
	) {
		const func = this.punishmentFunctions[type];
		if (!func) {
			return;
		}

		// Inform beforehand because we might be kicking/banning the user
		await this.informAboutPunishment(guild, user, type, amount, modAndReason);

		const punishmentResult = await func(
			guild,
			user,
			modAndReason ? modAndReason.reason : 'InviteManager AutoMod',
			args
		);
		if (!punishmentResult) {
			return;
		}

		await this.savePunishment({
			guildId: guild.id,
			memberId: user.id,
			type: type,
			amount: amount,
			args: args.join(','),
			reason: modAndReason ? modAndReason.reason : null,
			creatorId: null
		});

		await this.logPunishmentModAction(guild, user, type, amount, modAndReason, extras);
	}

	private async informAboutPunishment(
		guild: Guild,
		user: BasicUser,
		type: PunishmentType,
		amount: number,
		modAndReason?: { user: User; reason: string }
	) {
		const dmChannel = await this.client.getDMChannel(user.id);
		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);

		let message =
			i18n.__({ locale: settings.lang, phrase: `moderation.punishments.dm.${type}` }, { type, guild: guild.name }) +
			'\n';

		if (modAndReason) {
			message += i18n.__(
				{ locale: settings.lang, phrase: 'moderation.punishments.dm.reason' },
				{ reason: modAndReason.reason }
			);
		} else {
			message += i18n.__(
				{ locale: settings.lang, phrase: 'moderation.punishments.dm.amount' },
				{ amount: `${amount}` }
			);
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

	public async logPunishmentModAction(
		guild: Guild,
		user: BasicUser,
		type: PunishmentType,
		amount: number,
		modAndReason: { user: User; reason: string },
		extra?: { name: string; value: string }[]
	) {
		const logEmbed = this.mod.createBasicEmbed(modAndReason && modAndReason.user);
		logEmbed.color = 16711680; // orange

		const usr = `${user.username}#${user.discriminator}`;
		logEmbed.description = `**User**: ${usr} (ID: ${user.id})\n`;
		if (amount > 0) {
			logEmbed.description += `**Strikes**: ${amount}\n`;
		}
		if (modAndReason) {
			logEmbed.description += `**Reason**: ${modAndReason.reason}\n`;
		}
		logEmbed.description += `**Punishment**: ${type}\n`;

		if (extra) {
			extra
				.filter((e) => !!e.value)
				.forEach((e) => logEmbed.fields.push({ name: e.name, value: e.value.substr(0, 1000) }));
		}

		const modLogChannelId = (await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id)).modLogChannel;
		if (modLogChannelId) {
			const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
			if (logChannel) {
				await this.msg.sendEmbed(logChannel, logEmbed);
			}
		}
	}

	private async ban(guild: Guild, user: BasicUser, reason: string, args: any[]) {
		try {
			const days = args && args.length > 0 ? args[0] : 7;
			await guild.banMember(user.id, days, reason);
			return true;
		} catch (error) {
			return false;
		}
	}

	private async kick(guild: Guild, user: BasicUser, reason: string) {
		try {
			await guild.kickMember(user.id, reason);
			return true;
		} catch (error) {
			return false;
		}
	}

	private async softban(guild: Guild, user: BasicUser, reason: string, args: any[]) {
		try {
			const days = args && args.length > 0 ? args[0] : 7;
			await guild.banMember(user.id, days, reason);
			await guild.unbanMember(user.id, reason);
			return true;
		} catch (error) {
			return false;
		}
	}

	private async warn(guild: Guild, user: BasicUser, reason: string) {
		return true;
	}

	private async mute(guild: Guild, user: BasicUser, reason: string) {
		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);
		const mutedRole = settings.mutedRole;
		if (!mutedRole || !guild.roles.has(mutedRole)) {
			return false;
		}

		try {
			await guild.addMemberRole(user.id, mutedRole, encodeURIComponent(reason));
			return true;
		} catch (error) {
			return false;
		}
	}
}
