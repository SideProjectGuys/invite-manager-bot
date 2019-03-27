import * as amqplib from 'amqplib';
import { Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';
import { Op } from 'sequelize';

import { IMClient } from '../client';
import {
	channels,
	inviteCodes,
	JoinAttributes,
	JoinInvalidatedReason,
	joins,
	LeaveAttributes,
	members,
	SettingsKey
} from '../sequelize';
import { RabbitMqMember, ShardCommand } from '../types';
import { FakeChannel } from '../util';

interface ShardMessage {
	id: string;
	cmd: ShardCommand;

	[x: string]: any;
}

export class RabbitMqService {
	private client: IMClient;
	private shard: string;

	private qJoinsName: string;
	private channelJoins: amqplib.Channel;

	private qLeavesName: string;
	private channelLeaves: amqplib.Channel;

	private qCmdsName: string;
	private channelCmds: amqplib.Channel;

	public constructor(client: IMClient, conn: amqplib.Connection) {
		this.client = client;
		this.shard = client.config.rabbitmq.prefix
			? client.config.rabbitmq.prefix
			: this.client.shardId;

		// Setup RabbitMQ channels
		const prefix = client.config.rabbitmq.prefix
			? `${client.config.rabbitmq.prefix}-`
			: '';
		const suffix = `${this.client.shardId}-${this.client.shardCount}`;

		this.qJoinsName = `${prefix}joins-${suffix}`;
		conn.createChannel().then(async channel => {
			this.channelJoins = channel;

			await channel.assertQueue(this.qJoinsName, {
				durable: true
			});
		});

		this.qLeavesName = `${prefix}leaves-${suffix}`;
		conn.createChannel().then(async channel => {
			this.channelLeaves = channel;

			await channel.assertQueue(this.qLeavesName, {
				durable: true
			});
		});

		this.qCmdsName = `shard-${this.shard}-bot`;
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

			await channel.assertExchange(`shard-${this.shard}`, 'fanout', {
				durable: true
			});

			await channel.bindQueue(this.qCmdsName, `shard-${this.shard}`, '');
		});
	}

	public async init() {
		await this.channelJoins.prefetch(5);
		this.channelJoins.consume(
			this.qJoinsName,
			msg => this.onGuildMemberAdd(msg),
			{
				noAck: false
			}
		);

		await this.channelLeaves.prefetch(5);
		this.channelLeaves.consume(
			this.qLeavesName,
			msg => this.onGuildMemberRemove(msg),
			{
				noAck: false
			}
		);

		await this.channelCmds.prefetch(5);
		this.channelCmds.consume(this.qCmdsName, msg => this.onShardCommand(msg), {
			noAck: false
		});
	}

	private async onGuildMemberAdd(_msg: amqplib.Message): Promise<void> {
		const content = JSON.parse(_msg.content.toString());
		const guildId: string = content.guildId;
		const guild = this.client.guilds.get(guildId);
		const member: RabbitMqMember = content.member;
		const join: JoinAttributes = content.join;

		this.channelJoins.ack(_msg, false);

		if (member.user.bot) {
			return;
		}

		console.log(member.id + ' joined ' + guild.id);

		// Get settings
		const settings = await this.client.cache.settings.get(guild.id);
		const lang = settings.lang;
		const joinChannelId = settings.joinMessageChannel;

		const joinChannel = joinChannelId
			? (guild.channels.get(joinChannelId) as TextChannel)
			: undefined;
		// Check if it's a valid channel
		if (joinChannelId && !joinChannel) {
			console.error(
				`Guild ${guild.id} has invalid ` +
					`join message channel ${joinChannelId}`
			);
			// Reset the channel
			this.client.cache.settings.setOne(
				guild.id,
				SettingsKey.joinMessageChannel,
				null
			);
		}

		// Auto remove leaves if enabled
		if (settings.autoSubtractLeaves) {
			await joins.update(
				{
					invalidatedReason: null
				},
				{
					where: {
						guildId: guild.id,
						memberId: member.id,
						invalidatedReason: JoinInvalidatedReason.leave
					}
				}
			);
		}

		// Exit if we can't find the join
		if (!join) {
			console.log(
				`Could not find join for ${member.id} in ${guild.id}: ` +
					JSON.stringify(content)
			);
			if (joinChannel) {
				joinChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'messages.joinUnknownInviter' },
						{ id: member.id }
					)
				);
			}
			return;
		}

		const jn: any = await joins.findById(join.id, {
			include: [
				{
					model: inviteCodes,
					attributes: ['code', 'inviterId', 'channelId'],
					as: 'exactMatch',
					required: true,
					include: [
						{
							model: members,
							attributes: ['name', 'discriminator'],
							as: 'inviter',
							required: true
						},
						{
							model: channels,
							attributes: ['name']
						}
					]
				}
			],
			raw: true
		});

		// Exit if we can't find the join
		if (!jn) {
			console.log(
				`Could not fetch join ${join.id}: ` + JSON.stringify(content)
			);
			if (joinChannel) {
				joinChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'messages.joinUnknownInviter' },
						{ id: member.id }
					)
				);
			}
			return;
		}

		const inviterId = jn['exactMatch.inviterId'];

		// Auto remove fakes if enabled
		if (settings.autoSubtractFakes) {
			await joins.update(
				{
					invalidatedReason: JoinInvalidatedReason.fake
				},
				{
					where: {
						id: {
							[Op.ne]: jn.id
						},
						guildId,
						memberId: member.id,
						invalidatedReason: null,
						exactMatchCode: jn.exactMatchCode
					}
				}
			);
		}

		let inviter = guild.members.get(inviterId);
		if (!inviter) {
			inviter = await guild.getRESTMember(inviterId).catch(() => null);
		}
		const invites = await this.client.invs.getInviteCounts(guild.id, inviterId);

		// Add any roles for this invite code
		let mem = guild.members.get(member.id);
		if (!mem) {
			mem = await guild.getRESTMember(member.id);
		}
		if (mem) {
			const invCodeSettings = await this.client.cache.inviteCodes.getOne(
				guild.id,
				join.exactMatchCode
			);
			if (invCodeSettings && invCodeSettings.roles) {
				invCodeSettings.roles.forEach(r => mem.addRole(r));
			}
		}

		// Promote the inviter if required
		let me = guild.members.get(this.client.user.id);
		if (!me) {
			me = await guild.getRESTMember(this.client.user.id);
		}
		if (inviter && !inviter.user.bot) {
			await this.client.invs.promoteIfQualified(
				guild,
				inviter,
				me,
				invites.total
			);
		}

		const channelName = jn['exactMatch.channel.name'];
		const channelId = jn['exactMatch.channelId'];
		const inviterName = jn['exactMatch.inviter.name'];
		const inviterDiscriminator = jn['exactMatch.inviter.discriminator'];

		const joinMessageFormat = settings.joinMessage;
		if (joinChannel && joinMessageFormat) {
			const msg = await this.client.msg.fillJoinLeaveTemplate(
				joinMessageFormat,
				guild,
				member,
				jn.createdAt,
				jn.exactMatchCode,
				channelId,
				channelName,
				inviterId,
				inviterName,
				inviterDiscriminator,
				inviter,
				invites
			);

			await joinChannel.createMessage(
				typeof msg === 'string' ? msg : { embed: msg }
			);
		}
	}

	private async onGuildMemberRemove(_msg: amqplib.Message) {
		const content = JSON.parse(_msg.content.toString());
		const guildId: string = content.guildId;
		const guild = this.client.guilds.get(guildId);
		const member: RabbitMqMember = content.member;
		const join: any = content.join;
		const leave: LeaveAttributes = content.leave;

		this.channelLeaves.ack(_msg, false);

		if (member.user.bot) {
			return;
		}

		console.log(member.id + ' left ' + guild.id);

		// Get settings
		const settings = await this.client.cache.settings.get(guild.id);
		const lang = settings.lang;
		const leaveChannelId = settings.leaveMessageChannel;

		// Check if leave channel is valid
		const leaveChannel = leaveChannelId
			? (guild.channels.get(leaveChannelId) as TextChannel)
			: undefined;
		if (leaveChannelId && !leaveChannel) {
			console.error(
				`Guild ${guild.id} has invalid leave ` +
					`message channel ${leaveChannelId}`
			);
			// Reset the channel
			this.client.cache.settings.setOne(
				guild.id,
				SettingsKey.leaveMessageChannel,
				null
			);
		}

		// Exit if we can't find the join
		if (!join) {
			console.log(
				`Could not find join for ${member.id} in ` +
					`${guild.id} leaveId: ${leave.id}`
			);
			console.log(
				`RabbitMQ message for ${member.id} in ${guild.id} is: ` +
					JSON.stringify(content)
			);
			if (leaveChannel) {
				leaveChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'messages.leaveUnknownInviter' },
						{
							tag: member.user.username + '#' + member.user.discriminator
						}
					)
				);
			}
			return;
		}

		const inviteCode = join['exactMatch.code'];
		const channelName = join['exactMatch.channel.name'];
		const channelId = join['exactMatch.channelId'];

		const inviterId = join['exactMatch.inviterId'];
		const inviterName = join['exactMatch.inviter.name'];
		const inviterDiscriminator = join['exactMatch.inviter.discriminator'];

		// Auto remove leaves if enabled (and if we know the inviter)
		if (inviterId && settings.autoSubtractLeaves) {
			const threshold = Number(settings.autoSubtractLeaveThreshold);
			const timeDiff = moment
				.utc(join.createdAt)
				.diff(moment.utc(leave.createdAt), 's');
			if (timeDiff < threshold) {
				await joins.update(
					{
						invalidatedReason: JoinInvalidatedReason.leave
					},
					{
						where: { id: join.id }
					}
				);
			}
		}

		const leaveMessageFormat = settings.leaveMessage;
		if (leaveChannel && leaveMessageFormat) {
			const msg = await this.client.msg.fillJoinLeaveTemplate(
				leaveMessageFormat,
				guild,
				member,
				join.createdAt,
				inviteCode,
				channelId,
				channelName,
				inviterId,
				inviterName,
				inviterDiscriminator
			);

			leaveChannel.createMessage(
				typeof msg === 'string' ? msg : { embed: msg }
			);
		}
	}

	public async sendToManager(message: { id: string; [x: string]: any }) {
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
				sendResponse({
					connected: this.client.gatewayConnected,
					guildCount: this.client.guilds.size
				});
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
				let channelCount =
					this.client.groupChannels.size + this.client.privateChannels.size;
				let roleCount = 0;

				this.client.guilds.forEach(g => {
					channelCount += g.channels.size;
					roleCount += g.roles.size;
				});

				sendResponse({
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
					members: this.client.cache.members.getSize()
				});
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
}
