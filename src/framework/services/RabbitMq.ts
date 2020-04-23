import { captureException } from '@sentry/node';
import { Channel, connect, Connection, Message as MQMessage } from 'amqplib';
import chalk from 'chalk';
import moment from 'moment';

import { BotType } from '../../types';
import { GuildSettingsCache } from '../cache/GuildSettings';
import { PremiumCache } from '../cache/Premium';
import { Cache } from '../decorators/Cache';

import { IMService } from './Service';

interface ShardMessage {
	id: string;
	cmd: ShardCommand;

	[x: string]: any;
}

enum ShardCommand {
	CUSTOM = 'CUSTOM',
	DIAGNOSE = 'DIAGNOSE',
	FLUSH_CACHE = 'FLUSH_CACHE',
	LEAVE_GUILD = 'LEAVE_GUILD',
	STATUS = 'STATUS'
}

export class RabbitMqService extends IMService {
	private conn: Connection;
	private connRetry: number = 0;

	private qNameStartup: string;
	private channelStartup: Channel;
	private startTicket: MQMessage;
	private waitingForTicket: boolean;

	private qName: string;
	private channel: Channel;
	private channelRetry: number = 0;
	private msgQueue: any[] = [];

	@Cache() private guildSettingsCache: GuildSettingsCache;
	@Cache() private premiumCache: PremiumCache;

	public async init() {
		if (this.client.flags.includes('--no-rabbitmq')) {
			return;
		}

		await this.initConnection();
		await this.initChannel();
	}
	private async initConnection() {
		try {
			const conn = await connect(this.client.config.rabbitmq);
			this.conn = conn;
			this.conn.on('close', async (err) => {
				if (err) {
					console.error(err);
				}
				await this.shutdownConnection();

				setTimeout(() => this.initConnection(), this.connRetry * 30);
				this.connRetry++;
			});
		} catch (err) {
			console.error(err);

			await this.shutdownConnection();
			await this.initConnection();
		}
	}
	private async shutdownConnection() {
		await this.shutdownChannel();

		if (this.conn) {
			try {
				await this.conn.close();
			} catch {
				// NO-OP
			}
			this.conn = null;
		}
	}

	private async initChannel() {
		if (!this.conn) {
			return;
		}

		this.connRetry = 0;
		this.qName = `shard-${this.client.instance}-${this.client.firstShardId}-${this.client.lastShardId}`;

		try {
			this.channel = await this.conn.createChannel();
			this.channel.on('close', async (err) => {
				if (err) {
					console.error(err);
				}
				await this.shutdownChannel();

				setTimeout(() => this.initChannel(), this.channelRetry * 30);
				this.channelRetry++;
			});

			while (this.msgQueue.length > 0) {
				await this.sendToManager(this.msgQueue.pop(), true);
			}

			await this.channel.assertQueue(this.qName, { durable: false, autoDelete: true });

			await this.channel.assertExchange('shards_all', 'fanout', { durable: true });
			await this.channel.bindQueue(this.qName, 'shards_all', '');

			await this.channel.assertExchange('shards_one', 'topic', { durable: true });
			for (let i = this.client.firstShardId; i <= this.client.lastShardId; i++) {
				await this.channel.bindQueue(this.qName, 'shards_one', `${this.client.instance}.${i}`);
			}

			await this.channel.prefetch(5);
			this.channel.consume(this.qName, (msg) => this.onShardCommand(msg), { noAck: false });

			this.channelRetry = 0;
		} catch (err) {
			console.error(err);

			await this.shutdownChannel();
			await this.initChannel();
		}
	}
	private async shutdownChannel() {
		if (this.channel) {
			try {
				await this.channel.close();
			} catch {
				// NO-OP
			}

			this.channel = null;
		}
	}

	public async waitForStartupTicket() {
		if (!this.conn) {
			console.log(chalk.yellow('No connection available, this is ok for single installations or in dev mode.'));
			console.log(chalk.yellow('Skipping start ticket...'));
			return;
		}

		// Don't do this for custom bots
		if (this.client.type === BotType.custom) {
			return;
		}

		// const startupSuffix = this.client.shardCount > BOT_SHARDING ? `-${this.client.shardId % BOT_SHARDING}` : '';
		const startupSuffix = '';
		this.qNameStartup = `shard-${this.client.instance}-start${startupSuffix}`;

		this.channelStartup = await this.conn.createChannel();
		this.channelStartup.on('close', async (err) => {
			this.waitingForTicket = false;

			// If we have a ticket we are probably closing the channel after startup is complete
			if (this.startTicket) {
				return;
			}

			if (err) {
				captureException(err);
				console.error(err);
			}

			console.error('Could not aquire startup ticket');
			process.exit(1);
		});

		await this.channelStartup.prefetch(1);
		await this.channelStartup.assertQueue(this.qNameStartup, { durable: true, autoDelete: false, maxPriority: 10 });

		// Reset the ticket
		this.startTicket = null;
		this.waitingForTicket = true;

		// Return a promise that resolves when we aquire a start ticket (a rabbitmq message)
		return new Promise((resolve) => {
			// Start listening on the queue for one message (our start ticket)
			this.channelStartup.consume(
				this.qNameStartup,
				(msg) => {
					console.log(chalk.green(`Aquired start ticket!`));

					this.waitingForTicket = false;

					// Save the ticket so we can return it to the queue when our startup is done
					this.startTicket = msg;
					resolve();
				},
				{ noAck: false, priority: this.client.hasStarted ? 1 : 0 }
			);
		});
	}
	public async endStartup() {
		if (!this.channelStartup) {
			return;
		}

		// Nack the message, so that it gets returned to the queue for the next process to use
		this.channelStartup.nack(this.startTicket, false, true);

		// Close the channel because we don't want another ticket
		await this.channelStartup.close();
		this.channelStartup = null;

		this.startTicket = null;
	}

	public async sendToManager(message: { id: string; [x: string]: any }, isResend: boolean = false) {
		if (!this.conn) {
			console.log('Send message to RabbitMQ', JSON.stringify(message, null, 2));
			return;
		}

		if (!this.channel) {
			if (!isResend) {
				this.msgQueue.push(message);
			}
			return;
		}

		this.channel.sendToQueue(
			'manager',
			Buffer.from(
				JSON.stringify({
					timestamp: moment().unix(),
					type: this.client.type,
					instance: this.client.instance,
					firstShardId: this.client.firstShardId,
					lastShardId: this.client.lastShardId,
					shardCount: this.client.shardCount,
					service: 'bot',
					...message
				})
			)
		);
	}

	public async sendStatusToManager(err?: Error) {
		const req = this.client.requestHandler;
		let channelCount = this.client.groupChannels.size + this.client.privateChannels.size;
		let roleCount = 0;

		this.client.guilds.forEach((g) => {
			channelCount += g.channels.size;
			roleCount += g.roles.size;
		});

		const data: any = {
			id: 'status',
			cmd: ShardCommand.STATUS,
			state: this.waitingForTicket
				? 'waiting'
				: !this.client.hasStarted
				? 'init'
				: !!this.startTicket
				? 'starting'
				: 'running',
			startedAt: this.client.startedAt?.toISOString(),
			gateway: [...this.client.shardsConnected],
			error: err ? err.message : null,
			metrics: {
				...this.client.stats,
				httpRequests: [...req.requestStats.entries()].map(([url, stats]) => ({ url, stats })),
				httpRequestsQueued: Object.keys(req.ratelimits)
					.filter((endpoint) => req.ratelimits[endpoint]._queue.length > 0)
					.reduce((acc, endpoint) => acc.concat([{ endpoint, count: req.ratelimits[endpoint]._queue.length }]), [])
			},
			service: {},
			cache: {
				guilds: this.client.guilds.size,
				users: this.client.users.size,
				channels: channelCount,
				roles: roleCount
			}
		};

		for (const [clazz, service] of this.client.services) {
			data.service[clazz.name.toLowerCase().replace('service', '')] = service.getStatus();
		}

		for (const [clazz, cache] of this.client.caches) {
			data.cache[clazz.name.toLowerCase().replace('cache', '')] = cache.getSize();
		}

		await this.sendToManager(data);
	}

	private async onShardCommand(msg: MQMessage) {
		const content = JSON.parse(msg.content.toString()) as ShardMessage;
		const cmd = content.cmd;

		const guildId = content.guildId;
		const guild = this.client.guilds.get(guildId);

		console.log(`RECEIVED SHARD COMMAND: ${JSON.stringify(content)}`);

		this.channel.ack(msg, false);

		const sendResponse = (message: { [x: string]: any }) =>
			this.sendToManager({
				id: content.id,
				cmd: content.cmd,
				...message
			});

		switch (cmd) {
			case ShardCommand.STATUS:
				await this.sendStatusToManager();
				break;

			case ShardCommand.CUSTOM:
				const self = await this.client.getSelf();

				await sendResponse({
					self,
					guilds: this.client.guilds.map((g) => ({
						id: g.id,
						name: g.name,
						icon: g.iconURL,
						memberCount: g.memberCount
					}))
				});
				break;

			case ShardCommand.DIAGNOSE:
				if (!guild) {
					return sendResponse({
						error: `Guild ${guildId} not found`
					});
				}

				const owner = await this.client.getRESTUser(guild.ownerID).catch(() => undefined);
				const settings = await this.guildSettingsCache.get(guild.id);
				const perms = guild.members.get(this.client.user.id).permission.json;
				const premium = await this.premiumCache.get(guildId);
				const disabled = this.client.disabledGuilds.has(guildId);

				const data: any = {
					owner,
					settings,
					perms,
					premium,
					disabled,
					service: {}
				};

				for (const [clazz, service] of this.client.services) {
					data.service[clazz.name.toLowerCase().replace('service', '')] = await service.getDiagnose(guild);
				}

				await sendResponse(data);
				break;

			case ShardCommand.FLUSH_CACHE:
				const errors: string[] = [];

				this.client.flushCaches(guildId, content.caches);

				await sendResponse({ error: errors.join('\n') });
				break;

			case ShardCommand.LEAVE_GUILD:
				if (!guild) {
					return sendResponse({
						error: 'Guild not found'
					});
				}

				await guild.leave();
				await sendResponse({});
				break;

			default:
				console.error(`UNKNOWN COMMAND: ${cmd}`);
		}
	}
}
