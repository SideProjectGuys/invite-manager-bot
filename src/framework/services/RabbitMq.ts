import { Channel, connect, Connection, Message as MQMessage } from 'amqplib';
import { Message, TextChannel } from 'eris';
import moment from 'moment';

import { ClientCacheObject, IMClient } from '../../client';
import { ShardCommand } from '../../types';
import { FakeChannel } from '../../util';

interface ShardMessage {
	id: string;
	cmd: ShardCommand;

	[x: string]: any;
}

export class RabbitMqService {
	private client: IMClient;
	private conn: Connection;
	private connRetry: number = 0;

	private qName: string;
	private channel: Channel;
	private channelRetry: number = 0;
	private msgQueue: any[];

	public constructor(client: IMClient) {
		this.client = client;
		this.msgQueue = [];
	}

	public init() {
		if (this.client.flags.includes('--no-rabbitmq')) {
			return;
		}

		connect(this.client.config.rabbitmq)
			.then(async conn => {
				this.conn = conn;
				this.conn.on('close', async err => {
					console.error(err);
					this.conn = null;

					setTimeout(() => this.init(), this.connRetry * 30);
					this.connRetry++;
				});
				this.conn.on('error', async err => {
					console.error(err);
					this.conn = null;

					setTimeout(() => this.init(), this.connRetry * 30);
					this.connRetry++;
				});

				await this.initChannel();
			})
			.catch(err => {
				console.error(err);
				this.conn = null;

				setTimeout(() => this.init(), this.connRetry * 30);
				this.connRetry++;
			});
	}

	private async initChannel() {
		if (!this.conn) {
			return;
		}

		this.connRetry = 0;
		this.qName = `shard-${this.client.instance}-${this.client.shardId}`;

		try {
			this.channel = await this.conn.createChannel();
			this.channel.on('error', async err => {
				console.error(err);
				this.channel = null;

				setTimeout(() => this.initChannel(), this.channelRetry * 30);
				this.channelRetry++;
			});
			this.channel.on('close', async err => {
				console.error(err);
				this.channel = null;

				setTimeout(() => this.initChannel(), this.channelRetry * 30);
				this.channelRetry++;
			});

			while (this.msgQueue.length > 0) {
				await this.sendToManager(this.msgQueue.pop(), true);
			}

			await this.channel.assertQueue(this.qName, {
				durable: false,
				autoDelete: true
			});

			await this.channel.assertExchange('shards', 'fanout', {
				durable: true
			});

			await this.channel.bindQueue(this.qName, 'shards', '');

			await this.channel.prefetch(5);
			this.channel.consume(this.qName, msg => this.onShardCommand(msg), {
				noAck: false
			});

			this.channelRetry = 0;
		} catch (err) {
			console.error(err);
			this.channel = null;

			setTimeout(() => this.initChannel(), this.channelRetry * 30);
			this.channelRetry++;
		}
	}

	public async sendToManager(message: { id: string; [x: string]: any }, isResend: boolean = false) {
		if (!this.conn) {
			console.log('Send message to RabbitMQ', message);
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
					shardId: this.client.shardId,
					shardCount: this.client.shardCount,
					service: 'bot',
					...message
				})
			)
		);
	}

	public async sendStatusToManager(err?: Error) {
		const req = (this.client as any).requestHandler;
		const queued = Object.keys(req.ratelimits).reduce(
			(acc, endpoint) => acc + (req.ratelimits[endpoint]._queue.length as number),
			0
		);

		await this.sendToManager({
			id: 'status',
			cmd: ShardCommand.STATUS,
			connected: this.client.gatewayConnected,
			guilds: this.client.guilds.size,
			error: err ? err.message : null,
			tracking: {
				pendingGuilds: this.client.tracking.pendingGuilds.size,
				initialPendingGuilds: this.client.tracking.initialPendingGuilds
			},
			music: {
				connections: this.client.music.getMusicConnectionGuildIds()
			},
			cache: this.getCacheSizes(),
			stats: {
				wsEvents: this.client.stats.wsEvents,
				wsWarnings: this.client.stats.wsWarnings,
				wsErrors: this.client.stats.wsErrors,
				cmdProcessed: this.client.stats.cmdProcessed,
				cmdErrors: this.client.stats.cmdErrors,
				cmdHttpErrors: [...this.client.stats.cmdHttpErrors.entries()].map(([code, count]) => ({ code, count })),
				httpRequestsQueued: queued
			}
		});
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
					guilds: this.client.guilds.map(g => ({
						id: g.id,
						name: g.name,
						icon: g.iconURL,
						memberCount: g.memberCount
					}))
				});
				break;

			case ShardCommand.CACHE:
				await sendResponse(this.getCacheSizes());
				break;

			case ShardCommand.DIAGNOSE:
				if (!guild) {
					return sendResponse({
						error: `Guild ${guildId} not found`
					});
				}

				const sets = await this.client.cache.guilds.get(guildId);
				const perms = guild.members.get(this.client.user.id).permission.json;

				let joinChannelPerms: { [key: string]: boolean } = {};
				if (sets.joinMessageChannel) {
					const joinChannel = guild.channels.get(sets.joinMessageChannel);
					if (joinChannel) {
						joinChannelPerms = joinChannel.permissionsOf(this.client.user.id).json;
					} else {
						joinChannelPerms = { 'Invalid channel': true };
					}
				} else {
					joinChannelPerms = { 'Not set': true };
				}

				let leaveChannelPerms: { [key: string]: boolean } = {};
				if (sets.leaveMessageChannel) {
					const leaveChannel = guild.channels.get(sets.leaveMessageChannel);
					if (leaveChannel) {
						leaveChannelPerms = leaveChannel.permissionsOf(this.client.user.id).json;
					} else {
						leaveChannelPerms = { 'Invalid channel': true };
					}
				} else {
					leaveChannelPerms = { 'Not set': true };
				}

				let annChannelPerms: { [key: string]: boolean } = {};
				if (sets.rankAnnouncementChannel) {
					const annChannel = guild.channels.get(sets.rankAnnouncementChannel);
					if (annChannel) {
						annChannelPerms = annChannel.permissionsOf(this.client.user.id).json;
					} else {
						annChannelPerms = { 'Invalid channel': true };
					}
				} else {
					annChannelPerms = { 'Not set': true };
				}

				const owner = await this.client.getRESTUser(guild.ownerID).catch(() => undefined);

				const premium = await this.client.cache.premium.get(guildId);

				const disabled = this.client.disabledGuilds.has(guildId);

				await sendResponse({
					owner,
					premium,
					disabled,
					settings: sets,
					perms,
					joinChannelPerms,
					leaveChannelPerms,
					announceChannelPerms: annChannelPerms
				});
				break;

			case ShardCommand.FLUSH_CACHE:
				const errors: string[] = [];
				const cacheNames = content.caches as (keyof ClientCacheObject)[];

				if (!content.caches) {
					Object.values(this.client.cache).forEach(c => c.flush(guildId));
				} else {
					for (const cacheName of cacheNames) {
						const cache = this.client.cache[cacheName];
						if (cache) {
							cache.flush(guildId);
						} else {
							errors.push('Invalid cache name ' + cacheName);
						}
					}
				}
				await sendResponse({ error: errors.join('\n') });
				break;

			case ShardCommand.RELOAD_MUSIC_NODES:
				await this.client.music.loadMusicNodes();
				await sendResponse({});
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

			case ShardCommand.SUDO:
				if (!guild) {
					return sendResponse({
						error: 'Guild not found'
					});
				}

				const channel = new FakeChannel({ id: 'fake', name: 'fake' }, guild, 100);
				this.client.channelGuildMap[channel.id] = guild.id;
				guild.channels.add(channel);

				channel.listener = async data => {
					console.log(data);
					delete this.client.channelGuildMap[channel.id];
					guild.channels.remove(channel);
					await sendResponse({ data });
				};

				const args = content.args ? content.args.join(' ') : '';
				const fakeMsg = new Message(
					{
						id: content.id,
						content: `<@!${this.client.user.id}>${content.sudoCmd} ${args}`,
						channel_id: channel.id,
						author: this.client.users.get(content.authorId),
						embeds: [],
						attachments: [],
						mentions: []
					},
					this.client
				);
				(fakeMsg as any).__sudo = true;
				await this.client.cmds.onMessage(fakeMsg);
				break;

			case ShardCommand.OWNER_DM:
				try {
					const user = await this.client.getRESTUser(content.userId);
					const userChannel = await user.getDMChannel();
					await userChannel.createMessage(content.message);
					await sendResponse({ ok: true });
				} catch (e) {
					await sendResponse({ ok: false, error: e });
				}
				break;

			case ShardCommand.USER_DM:
				const dmChannel = guild.channels.get(content.channelId) as TextChannel;
				const sender = content.user;

				const embed = this.client.msg.createEmbed({
					author: {
						name: `${sender.username}#${sender.discriminator}`,
						url: sender.avatarURL
					},
					description: content.message
				});
				embed.fields.push({
					name: 'User ID',
					value: sender.id,
					inline: true
				});
				embed.fields.push({
					name: 'Initial message',
					value: content.isInitial,
					inline: true
				});

				await dmChannel.createMessage({
					embed
				});
				break;

			default:
				console.error(`UNKNOWN COMMAND: ${cmd}`);
		}
	}

	private getCacheSizes() {
		let channelCount = this.client.groupChannels.size + this.client.privateChannels.size;
		let roleCount = 0;

		this.client.guilds.forEach(g => {
			channelCount += g.channels.size;
			roleCount += g.roles.size;
		});

		return {
			guilds: this.client.guilds.size,
			users: this.client.users.size,
			channels: channelCount,
			roles: roleCount,
			ranks: this.client.cache.ranks.getSize(),
			settings: this.client.cache.guilds.getSize(),
			premium: this.client.cache.premium.getSize(),
			permissions: this.client.cache.permissions.getSize(),
			strikes: this.client.cache.strikes.getSize(),
			punishments: this.client.cache.punishments.getSize(),
			inviteCodes: this.client.cache.inviteCodes.getSize(),
			members: this.client.cache.members.getSize(),
			messages: this.client.mod.getMessageCacheSize()
		};
	}
}
