import chalk from 'chalk';
import { Client, Guild, Member, Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment, { Moment } from 'moment';

import { FaqModule } from './faq/FaqModule';
import { IMCache } from './framework/cache/Cache';
import { GuildSettingsCache } from './framework/cache/GuildSettings';
import { PremiumCache } from './framework/cache/Premium';
import { IMCommand } from './framework/commands/Command';
import { Cache, cacheInjections } from './framework/decorators/Cache';
import { Service, serviceInjections } from './framework/decorators/Service';
import { FrameworkModule } from './framework/FrameworkModule';
import { BaseBotSettings } from './framework/models/BotSettings';
import { LogAction } from './framework/models/Log';
import { IMModule } from './framework/Module';
import { IMRequestHandler } from './framework/other/RequestHandler';
import { DatabaseService } from './framework/services/Database';
import { MessagingService } from './framework/services/Messaging';
import { PremiumService } from './framework/services/Premium';
import { RabbitMqService } from './framework/services/RabbitMq';
import { IMService } from './framework/services/Service';
import { SettingsService } from './framework/services/Settings';
import { InviteModule } from './invites/InvitesModule';
import { ManagementModule } from './management/ManagementModule';
import { ModerationModule } from './moderation/ModerationModule';
import { MusicModule } from './music/MusicModule';
import { BotType, ChannelType } from './types';

i18n.configure({
	locales: ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pl', 'pt', 'pt_BR', 'ro', 'ru', 'tr'],
	defaultLocale: 'en',
	// syncFiles: true,
	directory: __dirname + '/../i18n/bot',
	objectNotation: true,
	logDebugFn: function (msg: string) {
		console.log('debug', msg);
	},
	logWarnFn: function (msg: string) {
		console.error('warn', msg);
	},
	logErrorFn: function (msg: string) {
		console.error('error', msg);
	}
});

export interface ClientOptions {
	version: string;
	token: string;
	type: BotType;
	instance: string;
	firstShard: number;
	lastShard: number;
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
	public settings: BaseBotSettings;
	public hasStarted: boolean = false;

	public firstShardId: number;
	public lastShardId: number;
	public shardCount: number;
	public requestHandler: IMRequestHandler;

	public modules: Map<new (client: IMClient) => IMModule, IMModule>;
	public services: Map<new (module: IMModule) => IMService, IMService>;
	public caches: Map<new (module: IMModule) => IMCache<any>, IMCache<any>>;
	public commands: Map<new (module: IMModule) => IMCommand, IMCommand>;

	public startedAt: Moment;
	public shardsConnected: Set<number> = new Set();
	public activityInterval: NodeJS.Timer;
	public stats: {
		shardConnects: number;
		shardDisconnects: number;
		shardResumes: number;
		wsEvents: number;
		wsWarnings: number;
		wsErrors: number;
		cmdProcessed: number;
		cmdErrors: number;
	};

	public disabledGuilds: Set<string> = new Set();

	private startingServices: IMService[];
	@Service() private dbService: DatabaseService;
	@Service() private rabbitMqService: RabbitMqService;
	@Service() private messageService: MessagingService;
	@Service() private premiumService: PremiumService;
	@Service() private settingsService: SettingsService;
	@Cache() private premiumCache: PremiumCache;
	@Cache() private guildSettingsCache: GuildSettingsCache;

	public constructor({
		version,
		token,
		type,
		instance,
		firstShard,
		lastShard,
		shardCount,
		flags,
		config
	}: ClientOptions) {
		super(token, {
			allowedMentions: {
				everyone: false,
				roles: true,
				users: true
			},
			firstShardID: firstShard - 1,
			lastShardID: lastShard - 1,
			maxShards: shardCount,
			disableEvents: {
				TYPING_START: true,
				PRESENCE_UPDATE: true,
				VOICE_STATE_UPDATE: true,
				USER_UPDATE: true
			},
			restMode: true,
			messageLimit: 2,
			getAllUsers: false,
			compress: true,
			guildCreateTimeout: 60000
		});

		this.stats = {
			shardConnects: 0,
			shardDisconnects: 0,
			shardResumes: 0,
			wsEvents: 0,
			wsWarnings: 0,
			wsErrors: 0,
			cmdProcessed: 0,
			cmdErrors: 0
		};

		this.firstShardId = firstShard;
		this.lastShardId = lastShard;
		this.shardCount = shardCount;

		// Override eris request handler so we can track some stats
		this.requestHandler = new IMRequestHandler(this);

		this.modules = new Map();
		this.services = new Map();
		this.caches = new Map();
		this.commands = new Map();
		this.startingServices = [];

		this.version = version;
		this.type = type;
		this.instance = instance;
		this.flags = flags;
		this.config = config;
	}

	public async init() {
		this.registerModule(FaqModule);
		this.registerModule(FrameworkModule);
		this.registerModule(InviteModule);
		this.registerModule(ManagementModule);
		this.registerModule(ModerationModule);
		this.registerModule(MusicModule);

		this.setupInjections(this);

		// Inject services, caches and commands
		this.services.forEach((srv) => this.setupInjections(srv));
		this.caches.forEach((cache) => this.setupInjections(cache));
		this.commands.forEach((cmd) => this.setupInjections(cmd));

		// Mark all services as starting
		[...this.services.values()].forEach((srv) => this.startingServices.push(srv));

		// Init services and commands
		await Promise.all([...this.modules.values()].map((mod) => mod.init()));
		await Promise.all([...this.services.values()].map((srv) => srv.init()));
		await Promise.all([...this.commands.values()].map((cmd) => cmd.init()));

		// Setup the injections for all command resolvers
		this.commands.forEach((cmd) => cmd.resolvers.forEach((res) => this.setupInjections(res)));

		this.on('ready', this.onClientReady);
		this.on('connect', this.onShardConnect);
		this.on('shardReady', this.onShardReady);
		this.on('shardResume', this.onShardResume);
		this.on('shardDisconnect', this.onShardDisconnect);
		this.on('guildCreate', this.onGuildCreate);
		this.on('guildDelete', this.onGuildDelete);
		this.on('guildUnavailable', this.onGuildUnavailable);
		this.on('guildMemberAdd', this.onGuildMemberAdd);
		this.on('guildMemberRemove', this.onGuildMemberRemove);
		this.on('warn', this.onWarn);
		this.on('error', this.onError);
		this.on('rawWS', this.onRawWS);
	}

	public async waitForStartupTicket() {
		const start = process.uptime();
		const interval = setInterval(
			() => console.log(`Waiting for ticket since ${chalk.blue(Math.floor(process.uptime() - start))} seconds...`),
			10000
		);
		await this.rabbitMqService.waitForStartupTicket();
		clearInterval(interval);
	}

	private async onShardReady(shardId: number) {
		console.log(chalk.green(`Shard ${chalk.blue(shardId + 1)} is ready`));
	}

	private async onClientReady(): Promise<void> {
		if (this.hasStarted) {
			console.error('BOT HAS ALREADY STARTED, IGNORING EXTRA READY EVENT');
			return;
		}

		console.log(chalk.green(`Client is ready`));

		// This is for convenience, the services could also subscribe to 'ready' event on client
		await Promise.all([...this.services.values()].map((s) => s.onClientReady()));

		this.hasStarted = true;
		this.startedAt = moment();

		const set = await this.settingsService.getBotSettings(this.user.id);
		this.settings = set ? set.value : this.settingsService.getBotDefaultSettings();

		console.log(chalk.green(`Client ready! Serving ${chalk.blue(this.guilds.size)} guilds.`));

		// Init all caches
		await Promise.all([...this.caches.values()].map((c) => c.init()));

		// Insert guilds into db
		await this.dbService.saveGuilds(
			this.guilds.map((g) => ({
				id: g.id,
				name: g.name,
				icon: g.iconURL,
				memberCount: g.memberCount,
				deletedAt: null,
				banReason: null
			}))
		);

		const bannedGuilds = await this.dbService.getBannedGuilds(this.guilds.map((g) => g.id));

		// Do some checks for all guilds
		this.guilds.forEach(async (guild) => {
			const bannedGuild = bannedGuilds.find((g) => g.id === guild.id);

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
					let premium = await this.premiumCache._get(guild.id);

					if (!premium) {
						// Let's try and see if this guild had pro before, and if maybe
						// the member renewed it, but it didn't update.
						const oldPremium = await this.dbService.getPremiumSubscriptionGuildForGuild(guild.id, false);
						if (oldPremium) {
							await this.premiumService.checkPatreon(oldPremium.memberId);
							premium = await this.premiumCache._get(guild.id);
						}

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
										'I will be leaving your server soon, thanks for having me!'
								)
								.catch(() => undefined);
							const onTimeout = async () => {
								// Check one last time before leaving
								if (await this.premiumCache._get(guild.id)) {
									return;
								}

								await guild.leave();
							};
							setTimeout(onTimeout, 3 * 60 * 1000);
						}
					}
					break;

				default:
					break;
			}
		});

		await this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 1 * 60 * 1000);
	}

	public serviceStartupDone(service: IMService) {
		this.startingServices = this.startingServices.filter((s) => s !== service);
		if (this.startingServices.length === 0) {
			console.log(chalk.green(`All services ready`));
			this.rabbitMqService.endStartup().catch((err) => console.error(err));
		}
	}

	private async onGuildCreate(guild: Guild): Promise<void> {
		const channel = await this.getDMChannel(guild.ownerID);
		const dbGuild = await this.dbService.getGuild(guild.id);

		if (!dbGuild) {
			await this.dbService.saveGuilds([
				{
					id: guild.id,
					name: guild.name,
					icon: guild.iconURL,
					memberCount: guild.memberCount,
					createdAt: new Date(guild.createdAt),
					deletedAt: null,
					banReason: null
				}
			]);

			const newSettings = this.settingsService.getGuildDefaultSettings<any>();

			// TODO: This is not very nice, and probably belongs in the invites module
			const defChannel = await this.getDefaultChannel(guild);
			if (defChannel) {
				newSettings.joinMessageChannel = defChannel.id;
			}
			// End hacky stuff

			await this.settingsService.saveGuildSettings({
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
						'I will be leaving your server soon, thanks for having me!'
				)
				.catch(() => undefined);
			await guild.leave();
			return;
		}

		// Clear the deleted timestamp if it's still set
		// We have to do this before checking premium or it will fail
		if (dbGuild && dbGuild.deletedAt) {
			dbGuild.deletedAt = null;
			await this.dbService.saveGuilds([dbGuild]);
		}

		// Check pro bot
		if (this.type === BotType.pro) {
			// We use a DB query instead of getting the value from the cache
			const premium = await this.premiumCache._get(guild.id);

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
				const onTimeout = async () => {
					if (await this.premiumCache._get(guild.id)) {
						return;
					}

					await guild.leave();
				};
				setTimeout(onTimeout, 2 * 60 * 1000);
				return;
			}
		}

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
		await this.dbService.saveGuilds([
			{
				id: guild.id,
				name: guild.name,
				icon: guild.iconURL,
				memberCount: guild.memberCount,
				deletedAt: new Date()
			}
		]);
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
		const gen = guild.channels.find((c) => c.name === 'general');
		if (gen) {
			return gen;
		}

		// First channel in order where the bot can speak
		return guild.channels
			.filter((c) => c.type === ChannelType.GUILD_TEXT /*&&
					c.permissionsOf(guild.self).has('SEND_MESSAGES')*/)
			.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))[0];
	}

	public flushCaches(guildId: string, caches?: string[]) {
		[...this.caches.entries()].forEach(
			([key, cache]) =>
				(!caches ||
					!caches.length ||
					caches.some((c) => c.toLowerCase() === key.name.toLowerCase().replace('cache', ''))) &&
				cache.flush(guildId)
		);
	}
	public getCacheSizes() {
		let channelCount = this.groupChannels.size + this.privateChannels.size;
		let roleCount = 0;

		this.guilds.forEach((g) => {
			channelCount += g.channels.size;
			roleCount += g.roles.size;
		});

		const res: any = {
			guilds: this.guilds.size,
			users: this.users.size,
			channels: channelCount,
			roles: roleCount
		};

		[...this.caches.entries()].forEach(
			([key, cache]) => (res[key.name.toLowerCase().replace('cache', '')] = cache.getSize())
		);

		return res;
	}

	public async logAction(guild: Guild, message: Message, action: LogAction, data: any) {
		const logChannelId = (await this.guildSettingsCache.get(guild.id)).logChannel;

		if (logChannelId) {
			const logChannel = guild.channels.get(logChannelId) as TextChannel;
			if (logChannel) {
				const content = message.content.substr(0, 1000) + (message.content.length > 1000 ? '...' : '');

				let json = JSON.stringify(data, null, 2);
				if (json.length > 1000) {
					json = json.substr(0, 1000) + '...';
				}

				const embed = this.messageService.createEmbed({
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
				await this.messageService.sendEmbed(logChannel, embed);
			}
		}

		this.dbService.saveLog(guild, message.author, {
			id: null,
			guildId: guild.id,
			memberId: message.author.id,
			action,
			message: message.content,
			data,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	public async setActivity() {
		const status = this.settings.activityStatus;

		if (!this.settings.activityEnabled) {
			this.editStatus(status);
			return;
		}

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

		const name = this.settings.activityMessage || `docs.invitemanager.co!`;
		const url = this.settings.activityUrl;

		this.editStatus(status, { name, type, url });
	}

	private async onShardConnect(shardId: number) {
		console.log(chalk.green(`Shard ${chalk.blue(shardId + 1)} is connected to the gateway`));
		this.shardsConnected.add(shardId + 1);
		this.stats.shardConnects++;

		await this.rabbitMqService.sendStatusToManager();
	}

	private async onShardResume(shardId: number) {
		console.log(chalk.green(`Shard ${chalk.blue(shardId + 1)} has resumed`));
		this.shardsConnected.add(shardId + 1);
		this.stats.shardResumes++;

		await this.rabbitMqService.sendStatusToManager();
	}

	private async onShardDisconnect(err: Error, shardId: number) {
		console.error(chalk.red(`Shard ${chalk.blue(shardId + 1)} was disconnected: ${err}`));
		this.shardsConnected.delete(shardId + 1);
		this.stats.shardDisconnects++;

		await this.rabbitMqService.sendStatusToManager(err);
	}

	private async onGuildUnavailable(guild: Guild) {
		console.error('DISCORD GUILD_UNAVAILABLE:', guild.id);
	}

	private async onWarn(warn: string) {
		console.error('DISCORD WARNING:', warn);
		this.stats.wsWarnings++;
	}

	private async onError(error: Error) {
		console.error('DISCORD ERROR:', error);
		this.stats.wsErrors++;
	}

	private async onRawWS() {
		this.stats.wsEvents++;
	}

	public registerModule<T extends IMModule>(module: new (client: IMClient) => T) {
		if (this.modules.has(module)) {
			throw new Error(`Module ${module.name} registered multiple times`);
		}
		this.modules.set(module, new module(this));
	}
	public registerService<T extends IMService>(module: IMModule, service: new (module: IMModule) => T) {
		if (this.services.has(service)) {
			throw new Error(`Service ${service.name} registered multiple times`);
		}
		this.services.set(service, new service(module));
	}
	public registerCache<P extends any, T extends IMCache<P>>(module: IMModule, cache: new (module: IMModule) => T) {
		if (this.caches.has(cache)) {
			throw new Error(`Cache ${cache.name} registered multiple times`);
		}
		this.caches.set(cache, new cache(module));
	}
	public registerCommand<T extends IMCommand>(module: IMModule, command: new (module: IMModule) => T) {
		if (this.commands.has(command)) {
			throw new Error(`Command ${command.name} (${new command(module).name}) registered multiple times`);
		}
		this.commands.set(command, new command(module));
	}
	public setupInjections(obj: any) {
		const objName = chalk.blue(obj.name || obj.constructor.name);

		let srvObj = obj.constructor;
		while (srvObj) {
			const serviceInjs = serviceInjections.get(srvObj) || new Map();
			for (const [key, getInjType] of serviceInjs) {
				const injConstr = getInjType();
				const injService = this.services.get(injConstr);
				if (!injService) {
					throw new Error(`Could not inject ${chalk.blue(injConstr.name)} into ${objName}:${chalk.blue(key)}`);
				}

				obj[key] = injService;
				console.debug(chalk.green(`Injected ${chalk.blue(injConstr.name)} into ${objName}:${chalk.blue(key)}`));
			}
			srvObj = Object.getPrototypeOf(srvObj);
		}

		let cacheObj = obj.constructor;
		while (cacheObj) {
			const cacheInjs = cacheInjections.get(cacheObj) || new Map();
			for (const [key, getInjType] of cacheInjs) {
				const injConstr = getInjType();
				const injCache = this.caches.get(injConstr);
				if (!injCache) {
					throw new Error(`Could not inject ${chalk.blue(injConstr.name)} into ${objName}:${chalk.blue(key)}`);
				}

				obj[key] = injCache;
				console.debug(chalk.green(`Injected ${chalk.blue(injConstr.name)} into ${objName}:${chalk.blue(key)}`));
			}
			cacheObj = Object.getPrototypeOf(cacheObj);
		}
	}
}
