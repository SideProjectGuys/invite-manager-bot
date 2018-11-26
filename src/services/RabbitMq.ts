import * as amqplib from 'amqplib';
import { Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { IMClient } from '../client';
import {
	channels,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	JoinAttributes,
	joins,
	LeaveAttributes,
	members
} from '../sequelize';
import { RabbitMqMember, ShardCommand } from '../types';
import {
	FakeChannel,
	getInviteCounts,
	getShardIdForGuild,
	promoteIfQualified
} from '../util';

interface ShardMessageOptions {
	id: string;
	cmd: ShardCommand;
	[x: string]: any;
}

interface ShardMessage extends ShardMessageOptions {
	shardId: number;
}

export class RabbitMq {
	private client: IMClient;

	private qJoinsName: string;
	private channelJoins: amqplib.Channel;
	private qLeavesName: string;
	private channelLeaves: amqplib.Channel;
	private qCmdsName: string;
	private channelCmds: amqplib.Channel;
	private pendingRabbitMqRequests: Map<string, (response: any) => void>;

	public constructor(client: IMClient, conn: amqplib.Connection) {
		this.client = client;
		this.pendingRabbitMqRequests = new Map();

		// Setup RabbitMQ channels
		const prefix = client.config.rabbitmq.prefix
			? `${client.config.rabbitmq.prefix}-`
			: '';

		this.qJoinsName = `${prefix}joins-${this.client.shardId}-${
			this.client.shardCount
		}`;
		conn.createChannel().then(async channel => {
			this.channelJoins = channel;

			await channel.assertQueue(this.qJoinsName, {
				durable: true
			});
		});

		this.qLeavesName = `${prefix}leaves-${this.client.shardId}-${
			this.client.shardCount
		}`;
		conn.createChannel().then(async channel => {
			this.channelLeaves = channel;

			await channel.assertQueue(this.qLeavesName, {
				durable: true
			});
		});

		this.qCmdsName = `${prefix}cmds-${this.client.shardId}-${
			this.client.shardCount
		}`;
		conn.createChannel().then(async channel => {
			this.channelCmds = channel;

			await channel.assertQueue(this.qCmdsName, {
				durable: true
			});
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

	public sendCommandToShard(
		shardId: number,
		message: ShardMessageOptions,
		callback?: (response: any) => void
	) {
		// Attach our shard in case of responses
		message.shardId = this.client.shardId;

		const shardCount = this.client.shardCount;
		const rabbitMqPrefix = this.client.config.rabbitmq.prefix
			? `${this.client.config.rabbitmq.prefix}-`
			: '';

		if (callback) {
			this.client.rabbitmq.pendingRabbitMqRequests.set(message.id, callback);
		}

		console.log(
			`SENDING MESSAGE TO SHARD ${shardId}/${shardCount}: ` +
				JSON.stringify(message)
		);

		const queueName = `${rabbitMqPrefix}cmds-${shardId}-${shardCount}`;
		return {
			shard: shardId,
			result: this.channelCmds.sendToQueue(
				queueName,
				Buffer.from(JSON.stringify(message))
			)
		};
	}

	public sendCommandToGuild(
		guildId: any,
		message: ShardMessageOptions,
		callback?: (response: any) => void
	) {
		return this.sendCommandToShard(
			getShardIdForGuild(guildId, this.client.shardCount),
			message,
			callback
		);
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
		}

		// Auto remove leaves if enabled
		if (settings.autoSubtractLeaves) {
			// Delete removals for this member because the member rejoined
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				}
			});
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
			const numJoins = await joins.count({
				where: {
					memberId: member.id,
					guildId
				},
				include: [
					{
						model: inviteCodes,
						as: 'exactMatch',
						where: {
							inviterId
						},
						required: true
					}
				]
			});

			// Remove old custom invites
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					memberId: inviterId,
					reason: member.id
				}
			});

			// Add removals for duplicate invites
			await customInvites.insertOrUpdate({
				id: null,
				creatorId: null,
				guildId: guild.id,
				memberId: inviterId,
				amount: -(numJoins - 1),
				reason: member.id,
				generatedReason: CustomInvitesGeneratedReason.fake
			});
		}

		let inviter = guild.members.get(inviterId);
		if (!inviter) {
			inviter = await guild.getRESTMember(inviterId).catch(() => null);
		}
		const invites = await getInviteCounts(guild.id, inviterId);

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
			await promoteIfQualified(this.client, guild, inviter, me, invites.total);
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

			// Send the message now so it doesn't take too long
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
			// Delete any old entries for the leaving of this member
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				}
			});

			const threshold = Number(settings.autoSubtractLeaveThreshold);
			const timeDiff = moment
				.utc(join.createdAt)
				.diff(moment.utc(leave.createdAt), 's');
			if (timeDiff < threshold) {
				// Add removals for leaves
				await customInvites.create({
					id: null,
					creatorId: null,
					guildId: guild.id,
					memberId: inviterId,
					amount: -1,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				});
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

	private async onShardCommand(msg: amqplib.Message) {
		const content = JSON.parse(msg.content.toString()) as ShardMessage;
		const cmd = content.cmd;

		const guildId = content.guildId;
		const guild = this.client.guilds.get(guildId);

		console.log(`RECEIVED SHARD COMMAND: ${JSON.stringify(content)}`);

		this.channelCmds.ack(msg, false);

		const sendResponse = (message: { [x: string]: any }) =>
			this.sendCommandToShard(content.shardId, {
				id: content.id,
				cmd: ShardCommand.RESPONSE,
				...message
			});

		switch (cmd) {
			case ShardCommand.DIAGNOSE:
				if (!guild) {
					return sendResponse({
						error: 'Guild not found'
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

				sendResponse({
					owner,
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
				const user = await this.client.getRESTUser(content.userId);
				const userChannel = await user.getDMChannel();
				await userChannel.createMessage(content.message);
				sendResponse({ ok: true });
				break;

			case ShardCommand.USER_DM:
				const dmChannel = guild.channels.get(content.channelId) as TextChannel;
				const sender = content.user;

				const embed = this.client.createEmbed({
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

			case ShardCommand.RESPONSE:
				const id = content.id;
				if (this.pendingRabbitMqRequests.has(id)) {
					this.pendingRabbitMqRequests.get(id)(content);
				} else {
					console.error('NOT EXPECTING RESPONSE FOR ' + id);
				}
				break;

			default:
				console.error(`UNKNOWN COMMAND: ${cmd}`);
		}
	}
}
