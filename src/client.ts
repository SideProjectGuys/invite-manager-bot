import { Client, Embed, Guild, Member, Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment, { Moment } from 'moment';
import { getRepository, In, Not, Repository } from 'typeorm';

import { MemberSettingsCache } from './framework/cache/MemberSettingsCache';
import { PermissionsCache } from './framework/cache/PermissionsCache';
import { PremiumCache } from './framework/cache/PremiumCache';
import { SettingsCache } from './framework/cache/SettingsCache';
import { CommandsService } from './framework/services/Commands';
import { DBQueueService } from './framework/services/DBQueue';
import { MessagingService } from './framework/services/Messaging';
import { RabbitMqService } from './framework/services/RabbitMq';
import { SchedulerService } from './framework/services/Scheduler';
import { BotSetting } from './models/BotSetting';
import { Channel } from './models/Channel';
import { CommandUsage } from './models/CommandUsage';
import { CustomInvite } from './models/CustomInvite';
import { DBStat } from './models/DBStat';
import { Guild as DBGuild } from './models/Guild';
import { GuildSetting, GuildSettingsKey } from './models/GuildSetting';
import { Incident } from './models/Incident';
import { InviteCode } from './models/InviteCode';
import { InviteCodeSetting } from './models/InviteCodeSetting';
import { Join } from './models/Join';
import { Leave } from './models/Leave';
import { Log, LogAction } from './models/Log';
import { Member as DBMember } from './models/Member';
import { MemberSetting } from './models/MemberSetting';
import { MusicNode } from './models/MusicNode';
import { PremiumSubscription } from './models/PremiumSubscription';
import { PremiumSubscriptionGuild } from './models/PremiumSubscriptionGuild';
import { Punishment } from './models/Punishment';
import { PunishmentConfig } from './models/PunishmentConfig';
import { Rank } from './models/Rank';
import { Role } from './models/Role';
import { RolePermission } from './models/RolePermission';
import { ScheduledAction } from './models/ScheduledAction';
import { Strike } from './models/Strike';
import { StrikeConfig } from './models/StrikeConfig';
import { InviteCodeSettingsCache } from './modules/invites/cache/InviteCodeSettingsCache';
import { InvitesCache } from './modules/invites/cache/InvitesCache';
import { RanksCache } from './modules/invites/cache/RanksCache';
import { CaptchaService } from './modules/invites/services/Captcha';
import { InvitesService } from './modules/invites/services/Invites';
import { TrackingService } from './modules/invites/services/Tracking';
import { PunishmentCache } from './modules/mod/cache/PunishmentsCache';
import { StrikesCache } from './modules/mod/cache/StrikesCache';
import { ModerationService } from './modules/mod/services/Moderation';
import { MusicCache } from './modules/music/cache/MusicCache';
import { MusicService } from './modules/music/services/MusicService';
import { botDefaultSettings, BotSettingsObject, guildDefaultSettings } from './settings';
import { BotType, ChannelType, GatewayInfo, LavaPlayerManager } from './types';

i18n.configure({
	locales: ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pl', 'pt', 'pt_BR', 'ro', 'ru', 'tr'],
	defaultLocale: 'en',
	// syncFiles: true,
	directory: __dirname + '/../i18n/bot',
	objectNotation: true,
	logDebugFn: function(msg: string) {
		console.log('debug', msg);
	},
	logWarnFn: function(msg: string) {
		console.error('warn', msg);
	},
	logErrorFn: function(msg: string) {
		console.error('error', msg);
	}
});

export interface ClientOptions {
	version: string;
	token: string;
	type: BotType;
	instance: string;
	shardId: number;
	shardCount: number;
	flags: string[];
	config: any;
}

export class IMClient extends Client {
	public version: string;
	public config: any;
	public flags: string[];
	public type: BotType;
	public instance: string;
	public settings: BotSettingsObject;
	public hasStarted: boolean = false;

	public repo: {
		botSetting: Repository<BotSetting>;
		channel: Repository<Channel>;
		commandUsage: Repository<CommandUsage>;
		customInvite: Repository<CustomInvite>;
		dbStat: Repository<DBStat>;
		guild: Repository<DBGuild>;
		incident: Repository<Incident>;
		inviteCode: Repository<InviteCode>;
		inviteCodeSetting: Repository<InviteCodeSetting>;
		join: Repository<Join>;
		leave: Repository<Leave>;
		log: Repository<Log>;
		member: Repository<DBMember>;
		memberSetting: Repository<MemberSetting>;
		musicNode: Repository<MusicNode>;
		punishment: Repository<Punishment>;
		punishmentConfig: Repository<PunishmentConfig>;
		rank: Repository<Rank>;
		role: Repository<Role>;
		rolePermission: Repository<RolePermission>;
		scheduledAction: Repository<ScheduledAction>;
		setting: Repository<GuildSetting>;
		strike: Repository<Strike>;
		strikeConfig: Repository<StrikeConfig>;
		premiumSubscription: Repository<PremiumSubscription>;
		premiumSubscriptionGuild: Repository<PremiumSubscriptionGuild>;
	};
	public cache: {
		inviteCodes: InviteCodeSettingsCache;
		invites: InvitesCache;
		ranks: RanksCache;
		members: MemberSettingsCache;
		permissions: PermissionsCache;
		premium: PremiumCache;
		punishments: PunishmentCache;
		settings: SettingsCache;
		strikes: StrikesCache;
		music: MusicCache;
	};
	public dbQueue: DBQueueService;

	public rabbitmq: RabbitMqService;
	public shardId: number;
	public shardCount: number;

	public msg: MessagingService;
	public mod: ModerationService;
	public scheduler: SchedulerService;
	public cmds: CommandsService;
	public captcha: CaptchaService;
	public invs: InvitesService;
	public music: MusicService;
	public tracking: TrackingService;

	public startedAt: Moment;
	public gatewayConnected: boolean;
	public gatewayInfo: GatewayInfo;
	public gatewayInfoCachedAt: Moment;
	public activityInterval: NodeJS.Timer;
	public voiceConnections: LavaPlayerManager;

	private counts: {
		cachedAt: Moment;
		guilds: number;
		members: number;
	};
	public disabledGuilds: Set<string>;

	public constructor({ version, token, type, instance, shardId, shardCount, flags, config }: ClientOptions) {
		super(token, {
			disableEveryone: true,
			firstShardID: shardId - 1,
			lastShardID: shardId - 1,
			maxShards: shardCount,
			disableEvents: {
				TYPING_START: true,
				USER_UPDATE: true,
				PRESENCE_UPDATE: true
			},
			restMode: true,
			messageLimit: 2,
			getAllUsers: false,
			compress: true,
			guildCreateTimeout: 60000
		});

		this.startedAt = moment();
		this.counts = {
			cachedAt: moment.unix(0),
			guilds: 0,
			members: 0
		};

		this.version = version;
		this.type = type;
		this.instance = instance;
		this.shardId = shardId;
		this.shardCount = shardCount;
		this.flags = flags;
		this.config = config;
		this.shardId = shardId;
		this.shardCount = shardCount;

		this.repo = {
			botSetting: getRepository(BotSetting),
			channel: getRepository(Channel),
			commandUsage: getRepository(CommandUsage),
			customInvite: getRepository(CustomInvite),
			dbStat: getRepository(DBStat),
			guild: getRepository(DBGuild),
			incident: getRepository(Incident),
			inviteCode: getRepository(InviteCode),
			inviteCodeSetting: getRepository(InviteCodeSetting),
			join: getRepository(Join),
			leave: getRepository(Leave),
			log: getRepository(Log),
			member: getRepository(DBMember),
			memberSetting: getRepository(MemberSetting),
			musicNode: getRepository(MusicNode),
			punishment: getRepository(Punishment),
			punishmentConfig: getRepository(PunishmentConfig),
			rank: getRepository(Rank),
			role: getRepository(Role),
			rolePermission: getRepository(RolePermission),
			scheduledAction: getRepository(ScheduledAction),
			setting: getRepository(GuildSetting),
			strike: getRepository(Strike),
			strikeConfig: getRepository(StrikeConfig),
			premiumSubscription: getRepository(PremiumSubscription),
			premiumSubscriptionGuild: getRepository(PremiumSubscriptionGuild)
		};
		this.cache = {
			inviteCodes: new InviteCodeSettingsCache(this),
			invites: new InvitesCache(this),
			ranks: new RanksCache(this),
			members: new MemberSettingsCache(this),
			permissions: new PermissionsCache(this),
			premium: new PremiumCache(this),
			punishments: new PunishmentCache(this),
			settings: new SettingsCache(this),
			strikes: new StrikesCache(this),
			music: new MusicCache(this)
		};
		this.dbQueue = new DBQueueService(this);
		this.rabbitmq = new RabbitMqService(this);
		this.msg = new MessagingService(this);
		this.mod = new ModerationService(this);
		this.scheduler = new SchedulerService(this);
		this.cmds = new CommandsService(this);
		this.captcha = new CaptchaService(this);
		this.invs = new InvitesService(this);
		this.tracking = new TrackingService(this);
		this.music = new MusicService(this);

		// Services
		this.cmds.init();

		this.disabledGuilds = new Set();

		this.on('ready', this.onClientReady);
		this.on('guildCreate', this.onGuildCreate);
		this.on('guildDelete', this.onGuildDelete);
		this.on('guildUnavailable', this.onGuildUnavailable);
		this.on('guildMemberAdd', this.onGuildMemberAdd);
		this.on('guildMemberRemove', this.onGuildMemberRemove);
		this.on('connect', this.onConnect);
		this.on('shardDisconnect', this.onDisconnect);
		this.on('warn', this.onWarn);
		this.on('error', this.onError);
	}

	private async onClientReady(): Promise<void> {
		if (this.hasStarted) {
			console.error('BOT HAS ALREADY STARTED, IGNORING EXTRA READY EVENT');
			return;
		}

		// Setup remaining services
		await this.rabbitmq.init();
		await this.scheduler.init();

		this.hasStarted = true;

		const set = await this.repo.botSetting.findOne({ where: { botId: this.user.id } });
		this.settings = set ? set.value : { ...botDefaultSettings };

		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);
		console.log(`This is the ${this.type} version of the bot.`);

		// Init all caches
		await Promise.all(Object.values(this.cache).map(c => c.init()));

		// Insert guilds into db
		await this.repo.guild
			.createQueryBuilder()
			.insert()
			.values(
				this.guilds.map(g => ({
					id: g.id,
					name: g.name,
					icon: g.iconURL,
					memberCount: g.memberCount,
					deletedAt: null,
					banReason: null
				}))
			)
			.orUpdate({ overwrite: ['name', 'icon', 'memberCount', 'deletedAt'] })
			.execute();

		const bannedGuilds = await this.repo.guild.find({
			where: {
				id: In(this.guilds.map(g => g.id)),
				banReason: Not(null)
			}
		});

		// Do some checks for all guilds
		this.guilds.forEach(async guild => {
			const bannedGuild = bannedGuilds.find(g => g.id === guild.id);

			// Check if the guild was banned
			if (bannedGuild) {
				const dmChannel = await this.getDMChannel(guild.ownerID);
				await dmChannel
					.createMessage(
						`Hi! Thanks for inviting me to your server \`${guild.name}\`!\n\n` +
							'It looks like this guild was banned from using the InviteManager bot.\n' +
							'If you believe this was a mistake please contact staff on our support server.\n\n' +
							`${this.config.bot.links.support}\n\n` +
							'I will be leaving your server now, thanks for having me!'
					)
					.catch(() => undefined);
				await guild.leave();
				return;
			}

			switch (this.type) {
				case BotType.regular:
					if (guild.members.has(this.config.bot.ids.pro)) {
						// Otherwise disable the guild if the pro bot is in it
						this.disabledGuilds.add(guild.id);
					}
					break;

				case BotType.pro:
					// If this is the pro bot then leave any guilds that aren't pro
					const premium = await this.cache.premium._get(guild.id);

					if (!premium) {
						const dmChannel = await this.getDMChannel(guild.ownerID);
						await dmChannel
							.createMessage(
								'Hi!' +
									`Thanks for inviting me to your server \`${guild.name}\`!\n\n` +
									'I am the pro version of InviteManager, and only available to people ' +
									'that support me on Patreon with the pro tier.\n\n' +
									'To purchase the pro tier visit https://www.patreon.com/invitemanager\n\n' +
									'If you purchased premium run `!premium check` and then `!premium activate` in the server\n\n' +
									'I will be leaving your server now, thanks for having me!'
							)
							.catch(() => undefined);
						await guild.leave();
					}
					break;

				default:
					break;
			}
		});

		await this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 1 * 60 * 1000);
	}

	private async onGuildCreate(guild: Guild): Promise<void> {
		const channel = await this.getDMChannel(guild.ownerID);

		const dbGuild = await this.repo.guild.findOne(guild.id);
		if (!dbGuild) {
			await this.repo.guild.save({
				id: guild.id,
				name: guild.name,
				icon: guild.iconURL,
				memberCount: guild.memberCount,
				createdAt: moment(guild.createdAt).toDate(),
				deletedAt: null,
				banReason: null
			});

			const defChannel = await this.getDefaultChannel(guild);
			const newSettings = {
				...guildDefaultSettings,
				[GuildSettingsKey.joinMessageChannel]: defChannel ? defChannel.id : null
			};

			await this.repo.setting.save({
				guildId: guild.id,
				value: newSettings
			});
		} else if (dbGuild.banReason !== null) {
			await channel
				.createMessage(
					`Hi! Thanks for inviting me to your server \`${guild.name}\`!\n\n` +
						'It looks like this guild was banned from using the InviteManager bot.\n' +
						'If you believe this was a mistake please contact staff on our support server.\n\n' +
						`${this.config.bot.links.support}\n\n` +
						'I will be leaving your server now, thanks for having me!'
				)
				.catch(() => undefined);
			await guild.leave();
			return;
		}

		// Clear the deleted timestamp if it's still set
		// We have to do this before checking premium or it will fail
		if (dbGuild && dbGuild.deletedAt) {
			dbGuild.deletedAt = null;
			await this.repo.guild.save(dbGuild);
		}

		// Check pro bot
		if (this.type === BotType.pro) {
			// We use a DB query instead of getting the value from the cache
			const premium = await this.cache.premium._get(guild.id);

			if (!premium) {
				await channel
					.createMessage(
						`Hi! Thanks for inviting me to your server \`${guild.name}\`!\n\n` +
							'I am the pro version of InviteManager, and only available to people ' +
							'that support me on Patreon with the pro tier.\n\n' +
							'To purchase the pro tier visit https://www.patreon.com/invitemanager\n\n' +
							'If you purchased premium run `!premium check` and then `!premium activate` in the server\n\n' +
							'I will be leaving your server soon, thanks for having me!'
					)
					.catch(() => undefined);
				setTimeout(() => guild.leave().catch(() => undefined), 5 * 60 * 1000);
				return;
			}
		}

		// Insert tracking data
		await this.tracking.insertGuildData(guild);

		// Send welcome message to owner with setup instructions
		channel
			.createMessage(
				'Hi! Thanks for inviting me to your server `' +
					guild.name +
					'`!\n\n' +
					'I am now tracking all invites on your server.\n\n' +
					'To get help setting up join messages or changing the prefix, please run the `!setup` command.\n\n' +
					'You can see a list of all commands using the `!help` command.\n\n' +
					`That's it! Enjoy the bot and if you have any questions feel free to join our support server!\n` +
					'https://discord.gg/2eTnsVM'
			)
			.catch(() => undefined);
	}

	private async onGuildDelete(guild: Guild): Promise<void> {
		// If we're disabled it means the pro bot is in that guild,
		// so don't delete the guild
		if (this.disabledGuilds.has(guild.id)) {
			return;
		}

		// If this is the pro bot and the guild has the regular bot do nothing
		if (this.type === BotType.pro && guild.members.has(this.config.bot.ids.regular)) {
			return;
		}

		// Remove the guild (only sets the 'deletedAt' timestamp)
		await this.repo.guild.update({ id: guild.id }, { deletedAt: new Date() });
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		const guildId = guild.id;

		// Ignore disabled guilds
		if (this.disabledGuilds.has(guildId)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our pro bot
			if (this.type === BotType.regular && member.user.id === this.config.bot.ids.pro) {
				console.log(`DISABLING BOT FOR ${guildId} BECAUSE PRO VERSION IS ACTIVE`);
				this.disabledGuilds.add(guildId);
			}
			return;
		}
	}

	private async onGuildMemberRemove(guild: Guild, member: Member) {
		// If the pro version of our bot left, re-enable this version
		if (this.type === BotType.regular && member.user.id === this.config.bot.ids.pro) {
			this.disabledGuilds.delete(guild.id);
			console.log(`ENABLING BOT IN ${guild.id} BECAUSE PRO VERSION LEFT`);
		}
	}

	private async getDefaultChannel(guild: Guild) {
		// get "original" default channel
		if (guild.channels.has(guild.id)) {
			return guild.channels.get(guild.id);
		}

		// Check for a "general" channel, which is often default chat
		const gen = guild.channels.find(c => c.name === 'general');
		if (gen) {
			return gen;
		}

		// First channel in order where the bot can speak
		return guild.channels
			.filter(c => c.type === ChannelType.GUILD_TEXT /*&&
					c.permissionsOf(guild.self).has('SEND_MESSAGES')*/)
			.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))[0];
	}

	public async logModAction(guild: Guild, embed: Embed) {
		const modLogChannelId = (await this.cache.settings.get(guild.id)).modLogChannel;

		if (modLogChannelId) {
			const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
			if (logChannel) {
				await this.msg.sendEmbed(logChannel, embed);
			}
		}
	}

	public async logAction(guild: Guild, message: Message, action: LogAction, data: any) {
		const logChannelId = (await this.cache.settings.get(guild.id)).logChannel;

		if (logChannelId) {
			const logChannel = guild.channels.get(logChannelId) as TextChannel;
			if (logChannel) {
				const content = message.content.substr(0, 1000) + (message.content.length > 1000 ? '...' : '');

				let json = JSON.stringify(data, null, 2);
				if (json.length > 1000) {
					json = json.substr(0, 1000) + '...';
				}

				const embed = this.msg.createEmbed({
					title: 'Log Action',
					fields: [
						{
							name: 'Action',
							value: action,
							inline: true
						},
						{
							name: 'Cause',
							value: `<@${message.author.id}>`,
							inline: true
						},
						{
							name: 'Command',
							value: content
						},
						{
							name: 'Data',
							value: '`' + json + '`'
						}
					]
				});
				await this.msg.sendEmbed(logChannel, embed);
			}
		}

		this.dbQueue.addLogAction(
			{
				id: null,
				guildId: guild.id,
				memberId: message.author.id,
				action,
				message: message.content,
				data,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			guild,
			message.author
		);
	}

	public async getCounts() {
		// If cached data is older than 12 hours, update it
		if (
			moment()
				.subtract(4, 'hours')
				.isAfter(this.counts.cachedAt)
		) {
			console.log('Fetching data counts from DB...');
			const rows = await this.repo.dbStat.find({
				where: { key: In(['guilds', 'members']) }
			});
			this.counts = {
				cachedAt: moment(),
				guilds: rows.find(r => r.key === 'guilds').value,
				members: rows.find(r => r.key === 'members').value
			};
		}

		return this.counts;
	}

	private async updateGatewayInfo() {
		if (
			moment()
				.subtract(4, 'hours')
				.isAfter(this.gatewayInfoCachedAt)
		) {
			console.log('Fetching gateway info...');
			this.gatewayInfo = (await this.getBotGateway()) as GatewayInfo;
			this.gatewayInfoCachedAt = moment();
		}
	}

	public async setActivity() {
		await this.updateGatewayInfo();

		const status = this.settings.activityStatus;

		if (!this.settings.activityEnabled) {
			this.editStatus(status);
			return;
		}

		const counts = await this.getCounts();

		const type =
			this.settings.activityType === 'playing'
				? 0
				: this.settings.activityType === 'streaming'
				? 1
				: this.settings.activityType === 'listening'
				? 2
				: this.settings.activityType === 'watching'
				? 3
				: 0;

		let name = `invitemanager.co - ${counts.guilds} servers!`;
		if (this.settings.activityMessage) {
			name = this.settings.activityMessage.replace(/{serverCount}/gi, counts.guilds.toString());
		}

		const url = this.settings.activityUrl;

		this.editStatus(status, { name, type, url });
	}

	private async onConnect() {
		console.error('DISCORD CONNECT');
		this.gatewayConnected = true;
		await this.rabbitmq.sendStatusToManager();
	}

	private async onDisconnect(err: Error) {
		console.error('DISCORD DISCONNECT');
		this.gatewayConnected = false;
		await this.rabbitmq.sendStatusToManager(err);

		if (err) {
			console.error(err);
		}
	}

	private async onGuildUnavailable(guild: Guild) {
		console.error('DISCORD GUILD_UNAVAILABLE:', guild.id);
	}

	private async onWarn(warn: string) {
		console.error('DISCORD WARNING:', warn);
	}

	private async onError(error: Error) {
		console.error('DISCORD ERROR:', error);
	}
}
