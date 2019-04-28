import * as amqplib from 'amqplib';
import { Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import { ShardCommand } from '../../types';
import { FakeChannel } from '../../util';

interface ShardMessage {
	id: string;
	cmd: ShardCommand;

	[x: string]: any;
}

export class RabbitMqService {
	private client: IMClient;
	private shard: string;

	private qCmdsName: string;
	private channelCmds: amqplib.Channel;

	public constructor(client: IMClient, conn: amqplib.Connection) {
		this.client = client;
		this.shard = client.config.rabbitmq.prefix
			? client.config.rabbitmq.prefix
			: this.client.shardId;

		if (!conn) {
			return;
		}

		this.qCmdsName = `shard-${this.shard}`;
		conn.createChannel().then(async channel => {
			this.channelCmds = channel;

			await channel.assertQueue(this.qCmdsName, {
				durable: false,
				autoDelete: true
			});

			await channel.assertExchange('shards', 'fanout', {
				durable: true
			});

			await channel.bindQueue(this.qCmdsName, 'shards', '');
		});
	}

	public async init() {
		if (!this.channelCmds) {
			return;
		}

		await this.channelCmds.prefetch(5);
		this.channelCmds.consume(this.qCmdsName, msg => this.onShardCommand(msg), {
			noAck: false
		});
	}

	public async sendToManager(message: { id: string; [x: string]: any }) {
		if (!this.channelCmds) {
			console.log('Send message to RabbitMQ', message);
			return;
		}

		this.channelCmds.sendToQueue(
			'manager',
			Buffer.from(
				JSON.stringify({
					shard: this.shard,
					service: 'bot',
					...message
				})
			)
		);
	}

	public async sendStatusToManager(err?: Error) {
		this.sendToManager({
			id: 'status',
			cmd: ShardCommand.STATUS,
			connected: this.client.gatewayConnected,
			guilds: this.client.guilds.size,
			error: err ? err.message : null,
			tracking: {
				pendingGuilds: [...this.client.tracking.pendingGuilds.values()],
				initialPendingGuilds: this.client.tracking.initialPendingGuilds
			},
			cache: this.getCacheSizes()
		});
	}

	private async onShardCommand(msg: amqplib.Message) {
		const content = JSON.parse(msg.content.toString()) as ShardMessage;
		const cmd = content.cmd;

		const guildId = content.guildId;
		const guild = this.client.guilds.get(guildId);

		console.log(`RECEIVED SHARD COMMAND: ${JSON.stringify(content)}`);

		this.channelCmds.ack(msg, false);

		const sendResponse = (message: { [x: string]: any }) =>
			this.sendToManager({
				id: content.id,
				cmd: content.cmd,
				...message
			});

		switch (cmd) {
			case ShardCommand.STATUS:
				this.sendStatusToManager();
				break;

			case ShardCommand.CUSTOM:
				const self = await this.client.getSelf();

				sendResponse({
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
				sendResponse(this.getCacheSizes());
				break;

			case ShardCommand.DIAGNOSE:
				if (!guild) {
					return sendResponse({
						error: `Guild ${guildId} not found`
					});
				}

				const sets = await this.client.cache.settings.get(guildId);
				const perms = guild.members.get(this.client.user.id).permission.json;

				let joinChannelPerms: { [key: string]: boolean } = {};
				if (sets.joinMessageChannel) {
					const joinChannel = guild.channels.get(sets.joinMessageChannel);
					if (joinChannel) {
						joinChannelPerms = joinChannel.permissionsOf(this.client.user.id)
							.json;
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
						leaveChannelPerms = leaveChannel.permissionsOf(this.client.user.id)
							.json;
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
						annChannelPerms = annChannel.permissionsOf(this.client.user.id)
							.json;
					} else {
						annChannelPerms = { 'Invalid channel': true };
					}
				} else {
					annChannelPerms = { 'Not set': true };
				}

				const owner = await this.client
					.getRESTUser(guild.ownerID)
					.catch(() => undefined);

				const premium = await this.client.cache.premium.get(guildId);

				sendResponse({
					owner,
					premium,
					settings: sets,
					perms,
					joinChannelPerms,
					leaveChannelPerms,
					announceChannelPerms: annChannelPerms
				});
				break;

			case ShardCommand.FLUSH_CACHE:
				Object.values(this.client.cache).forEach(c => c.flush(guildId));
				break;

			case ShardCommand.LEAVE_GUILD:
				if (!guild) {
					return sendResponse({
						error: 'Guild not found'
					});
				}

				await guild.leave();
				sendResponse({});
				break;

			case ShardCommand.SUDO:
				if (!guild) {
					return sendResponse({
						error: 'Guild not found'
					});
				}

				const channel = new FakeChannel(
					{ id: 'fake', name: 'fake' },
					guild,
					100
				);
				this.client.channelGuildMap[channel.id] = guild.id;
				guild.channels.add(channel);

				channel.listener = data => {
					console.log(data);
					delete this.client.channelGuildMap[channel.id];
					guild.channels.remove(channel);
					sendResponse({ data });
				};

				const fakeMsg = new Message(
					{
						id: content.id,
						content: `<@!${this.client.user.id}>${
							content.sudoCmd
						} ${content.args.join(' ')}`,
						channel_id: channel.id,
						author: this.client.users.get(content.authorId),
						embeds: [],
						attachments: [],
						mentions: []
					},
					this.client
				);
				(fakeMsg as any).__sudo = true;
				this.client.cmds.onMessage(fakeMsg);
				break;

			case ShardCommand.OWNER_DM:
				try {
					const user = await this.client.getRESTUser(content.userId);
					const userChannel = await user.getDMChannel();
					await userChannel.createMessage(content.message);
					sendResponse({ ok: true });
				} catch (e) {
					sendResponse({ ok: false, error: e });
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

				dmChannel.createMessage({
					embed
				});
				break;

			default:
				console.error(`UNKNOWN COMMAND: ${cmd}`);
		}
	}

	private getCacheSizes() {
		let channelCount =
			this.client.groupChannels.size + this.client.privateChannels.size;
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
			settings: this.client.cache.settings.getSize(),
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
