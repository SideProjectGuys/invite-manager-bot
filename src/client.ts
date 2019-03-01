import * as amqplib from 'amqplib';
import DBL from 'dblapi.js';
import { Client, Embed, Guild, Member, Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';
import { Op, QueryTypes } from 'sequelize';

import { InviteCodeSettingsCache } from './cache/InviteCodeSettingsCache';
import { MemberSettingsCache } from './cache/MemberSettingsCache';
import { PermissionsCache } from './cache/PermissionsCache';
import { PremiumCache } from './cache/PremiumCache';
import { PunishmentCache } from './cache/PunishmentsCache';
import { SettingsCache } from './cache/SettingsCache';
import { StrikesCache } from './cache/StrikesCache';
import { dbStats, guilds, LogAction } from './sequelize';
import { CaptchaService } from './services/Captcha';
import { Commands } from './services/Commands';
import { DBQueue } from './services/DBQueue';
import { InvitesService } from './services/Invites';
import { Messaging } from './services/Messaging';
import { Moderation } from './services/Moderation';
import { RabbitMq } from './services/RabbitMq';
import { Scheduler } from './services/Scheduler';
import { ShardCommand } from './types';

const config = require('../config.json');

i18n.configure({
	locales: [
		'en',
		'de',
		'el',
		'en',
		'es',
		'fr',
		'it',
		'lt',
		'nl',
		'pt',
		'ro',
		'sr'
	],
	defaultLocale: 'en',
	// syncFiles: true,
	directory: __dirname + '/../locale',
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

export class IMClient extends Client {
	public version: string;
	public config: any;
	public isPro: boolean;

	public cache: {
		inviteCodes: InviteCodeSettingsCache;
		members: MemberSettingsCache;
		permissions: PermissionsCache;
		premium: PremiumCache;
		punishments: PunishmentCache;
		settings: SettingsCache;
		strikes: StrikesCache;
	};
	public dbQueue: DBQueue;

	public rabbitmq: RabbitMq;
	public shardId: number;
	public shardCount: number;

	public msg: Messaging;
	public mod: Moderation;
	public scheduler: Scheduler;
	public cmds: Commands;
	public captcha: CaptchaService;
	public invs: InvitesService;

	public startedAt: moment.Moment;
	public gatewayConnected: boolean;
	public activityInterval: NodeJS.Timer;

	private counts: {
		cachedAt: number;
		guilds: number;
		members: number;
	};
	public disabledGuilds: Set<string>;

	private dbl: DBL;

	public constructor(
		version: string,
		conn: amqplib.Connection,
		token: string,
		shardId: number,
		shardCount: number,
		_prefix: string
	) {
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
			cachedAt: 0,
			guilds: 0,
			members: 0
		};

		this.version = version;
		this.config = config;
		if (_prefix) {
			this.config.rabbitmq.prefix = _prefix;
		}

		this.cache = {
			inviteCodes: new InviteCodeSettingsCache(this),
			members: new MemberSettingsCache(this),
			permissions: new PermissionsCache(this),
			premium: new PremiumCache(this),
			punishments: new PunishmentCache(this),
			settings: new SettingsCache(this),
			strikes: new StrikesCache(this)
		};
		this.dbQueue = new DBQueue(this);

		this.shardId = shardId;
		this.shardCount = shardCount;
		this.rabbitmq = new RabbitMq(this, conn);

		this.msg = new Messaging(this);
		this.mod = new Moderation(this);
		this.scheduler = new Scheduler(this);
		this.cmds = new Commands(this);
		this.captcha = new CaptchaService(this);
		this.invs = new InvitesService(this);

		this.disabledGuilds = new Set();

		this.on('ready', this.onClientReady);
		this.on('guildCreate', this.onGuildCreate);
		this.on('guildUnavailable', this.onGuildUnavailable);
		this.on('guildMemberAdd', this.onGuildMemberAdd);
		this.on('guildMemberRemove', this.onGuildMemberRemove);
		this.on('connect', this.onConnect);
		this.on('disconnect', this.onDisconnect);
		this.on('warn', this.onWarn);
		this.on('error', this.onError);
	}

	private async onClientReady(): Promise<void> {
		this.isPro = this.user.id === this.config.proBotId;

		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);
		console.log(
			`This is the ${this.isPro ? 'PRO' : 'PUBLIC'} version of the bot.`
		);

		// Init all caches
		await Promise.all(Object.values(this.cache).map(c => c.init()));

		// Other services
		await this.rabbitmq.init();
		await this.cmds.init();

		const gs = await guilds.findAll({
			where: { id: this.guilds.map(g => g.id), banReason: { [Op.ne]: null } },
			paranoid: false
		});

		// Do some checks for all guilds
		this.guilds.forEach(async guild => {
			const dbGuild = gs.find(g => g.id === guild.id);

			// Check if the guild was banned
			if (dbGuild) {
				const dmChannel = await this.getDMChannel(guild.ownerID);
				await dmChannel
					.createMessage(
						'Hi! Thanks for inviting me to your server `' +
							guild.name +
							'`!\n\n' +
							'It looks like this guild was banned from using the InviteManager bot.\n' +
							'If you believe this was a mistake please contact staff on our support server.\n\n' +
							config.botSupport +
							'\n\n' +
							'I will be leaving your server now, thanks for having me!'
					)
					.catch(() => undefined);
				await guild.leave();
				return;
			}

			if (this.isPro) {
				// If this is the pro bot then leave any guilds that aren't pro
				const premium = await this.cache.premium.get(guild.id);
				if (!premium) {
					const dmChannel = await this.getDMChannel(guild.ownerID);
					await dmChannel
						.createMessage(
							'Hi! Thanks for inviting me to your server `' +
								guild.name +
								'`!\n\n' +
								'I am the pro version of InviteManager, and only available to people ' +
								'that support me on Patreon with the pro tier.\n\n' +
								'To purchase the pro tier visit https://www.patreon.com/invitemanager\n\n' +
								'I will be leaving your server now, thanks for having me!'
						)
						.catch(() => undefined);
					await guild.leave();
				}
			} else if (guild.members.has(this.config.proBotId)) {
				// Otherwise disable the guild if the pro bot is in it
				this.disabledGuilds.add(guild.id);
			}
		});

		// Setup discord bots api
		if (this.config.discordBotsToken) {
			this.dbl = new DBL(this.config.discordBotsToken, this);
		}

		this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 30000);
	}

	private async onGuildCreate(guild: Guild): Promise<void> {
		const channel = await this.getDMChannel(guild.ownerID);

		const dbGuild = await guilds.findById(guild.id, { paranoid: false });
		if (dbGuild.banReason !== null) {
			await channel
				.createMessage(
					'Hi! Thanks for inviting me to your server `' +
						guild.name +
						'`!\n\n' +
						'It looks like this guild was banned from using the InviteManager bot.\n' +
						'If you believe this was a mistake please contact staff on our support server.\n\n' +
						config.botSupport +
						'\n\n' +
						'I will be leaving your server now, thanks for having me!'
				)
				.catch(() => undefined);
			await guild.leave();
			return;
		}

		const premium = await this.cache.premium.get(guild.id);

		if (this.isPro && !premium) {
			await channel
				.createMessage(
					'Hi! Thanks for inviting me to your server `' +
						guild.name +
						'`!\n\n' +
						'I am the pro version of InviteManager, and only available to people ' +
						'that support me on Patreon with the pro tier.\n\n' +
						'To purchase the pro tier visit https://www.patreon.com/invitemanager\n\n' +
						'I will be leaving your server now, thanks for having me!'
				)
				.catch(() => undefined);
			await guild.leave();
			return;
		}

		// Send welcome message to owner with setup instructions

		channel.createMessage(
			'Hi! Thanks for inviting me to your server `' +
				guild.name +
				'`!\n\n' +
				'I am now tracking all invites on your server.\n\n' +
				'To get help setting up join messages or changing the prefix, please run the `!setup` command.\n\n' +
				'You can see a list of all commands using the `!help` command.\n\n' +
				`That's it! Enjoy the bot and if you have any questions feel free to join our support server!\n` +
				'https://discord.gg/2eTnsVM'
		);
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		const guildId = guild.id;

		// Ignore disabled guilds
		if (this.disabledGuilds.has(guildId)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our premium bot
			if (member.user.id === this.config.proBotId) {
				console.log(
					`DISABLING BOT FOR ${guildId} BECAUSE PRO VERSION IS ACTIVE`
				);
				this.disabledGuilds.add(guildId);
			}
			return;
		}
	}

	private async onGuildMemberRemove(guild: Guild, member: Member) {
		// If the pro version of our bot left, re-enable this version
		if (member.user.bot && member.user.id === this.config.proBotId) {
			this.disabledGuilds.delete(guild.id);
			console.log(`ENABLING BOT IN ${guild.id} BECAUSE PRO VERSION LEFT`);
		}
	}

	public async logModAction(guild: Guild, embed: Embed) {
		const modLogChannelId = (await this.cache.settings.get(guild.id))
			.modLogChannel;

		if (modLogChannelId) {
			const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
			if (logChannel) {
				this.msg.sendEmbed(logChannel, embed);
			}
		}
	}

	public async logAction(
		guild: Guild,
		message: Message,
		action: LogAction,
		data: any
	) {
		const logChannelId = (await this.cache.settings.get(guild.id)).logChannel;

		if (logChannelId) {
			const logChannel = guild.channels.get(logChannelId) as TextChannel;
			if (logChannel) {
				const content =
					message.content.substr(0, 1000) +
					(message.content.length > 1000 ? '...' : '');

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
				this.msg.sendEmbed(logChannel, embed);
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
			{
				id: guild.id,
				name: guild.name,
				icon: guild.iconURL,
				memberCount: guild.memberCount,
				banReason: null
			},
			{
				id: message.author.id,
				discriminator: message.author.discriminator,
				name: message.author.username
			}
		);
	}

	public async getCounts() {
		// If cached data is older than 12 hours, update it
		if (Date.now() - this.counts.cachedAt > 1000 * 60 * 60) {
			console.log('Fetching data counts from DB...');
			const rows = await dbStats.findAll({
				where: { key: ['guilds', 'members'] }
			});
			this.counts = {
				cachedAt: Date.now(),
				guilds: rows.find(r => r.key === 'guilds').value,
				members: rows.find(r => r.key === 'members').value
			};
		}

		return this.counts;
	}

	private async setActivity() {
		if (this.dbl) {
			this.dbl.postStats(this.guilds.size, this.shardId - 1, this.shardCount);
		}

		const counts = await this.getCounts();
		this.editStatus('online', {
			name: `invitemanager.co - ${counts.guilds} servers!`,
			type: 0
		});
	}

	private async onConnect() {
		console.error('DISCORD CONNECT');
		this.rabbitmq.sendToManager({
			id: 'status',
			cmd: ShardCommand.STATUS,
			connected: true
		});
		this.gatewayConnected = true;
	}

	private async onDisconnect() {
		console.error('DISCORD DISCONNECT');
		this.rabbitmq.sendToManager({
			id: 'status',
			cmd: ShardCommand.STATUS,
			connected: false
		});
		this.gatewayConnected = false;
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
