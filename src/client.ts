import { Client, Guild, Lang, ListenerUtil, Message } from '@yamdbf/core';
import * as amqplib from 'amqplib';
import DBL from 'dblapi.js';
import {
	DMChannel,
	GuildMember,
	MessageEmbed,
	TextChannel,
	Util
} from 'discord.js';
import moment from 'moment';
import * as path from 'path';

import { createEmbed, sendEmbed } from './functions/Messaging';
import {
	channels,
	customInvites,
	CustomInvitesGeneratedReason,
	guilds,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	JoinAttributes,
	joins,
	Lang as SettingsLang,
	LeaveAttributes,
	LogAction,
	members,
	sequelize
} from './sequelize';
import { DBQueue } from './storage/DBQueue';
import { SettingsCache } from './storage/SettingsCache';
import { IMStorageProvider } from './storage/StorageProvider';
import { ShardCommand } from './types';
import {
	FakeChannel,
	getInviteCounts,
	InviteCounts,
	promoteIfQualified,
	sendCaptchaToUserOnJoin
} from './util';

const { on, once } = ListenerUtil;
const config = require('../config.json');

interface RabbitMqMember {
	id: string;
	nick?: string;
	user: {
		id: string;
		avatarUrl: string | null;
		createdAt: number;
		bot: boolean;
		discriminator: string;
		username: string;
	};
}

export class IMClient extends Client {
	public version: string;
	public config: any;

	public conn: amqplib.Connection;
	public qJoinsName: string;
	public channelJoins: amqplib.Channel;
	public qLeavesName: string;
	public channelLeaves: amqplib.Channel;
	public qCmdsName: string;
	public channelCmds: amqplib.Channel;

	public startedAt: moment.Moment;
	public dbQueue: DBQueue;
	public activityInterval: NodeJS.Timer;

	public numGuilds: number = 0;
	public guildsCachedAt: number = 0;

	public numMembers: number = 0;
	public membersCachedAt: number = 0;

	private dbl: DBL;

	public disabledGuilds: Set<string> = new Set();
	public pendingRabbitMqRequests: {
		[x: string]: (response: any) => void;
	} = {};

	public constructor(
		version: string,
		conn: amqplib.Connection,
		token: string,
		shardId: number,
		shardCount: number,
		_prefix: string
	) {
		super(
			{
				provider: IMStorageProvider,
				commandsDir: path.join(__dirname, 'commands'),
				localeDir: path.join(__dirname, 'locale'),
				token,
				owner: config.owners,
				pause: true,
				ratelimit: '2/5s',
				disableBase: [
					'setlang',
					'setprefix',
					'blacklist',
					'eval',
					'eval:ts',
					'limit',
					'reload',
					'help'
				],
				unknownCommandError: false
			},
			{
				disableEveryone: true,
				shardId: shardId - 1,
				shardCount,
				disabledEvents: ['TYPING_START', 'USER_UPDATE', 'PRESENCE_UPDATE'],
				messageCacheMaxSize: 2,
				messageCacheLifetime: 10,
				messageSweepInterval: 30,
				restWsBridgeTimeout: 20000,
				ws: {
					compress: true
				}
			}
		);

		this.version = version;
		this.conn = conn;
		this.config = config;
		this.startedAt = moment();

		this.dbQueue = new DBQueue(this);

		// Set fallback language to english
		Lang.setFallbackLang(SettingsLang.en);

		// Setup RabbitMQ channels
		const prefix = _prefix
			? _prefix + '-'
			: config.rabbitmq.prefix
				? config.rabbitmq.prefix + '-'
				: '';

		this.qJoinsName = prefix + 'joins-' + shardId + '-' + shardCount;
		conn.createChannel().then(async channel => {
			this.channelJoins = channel;

			await channel.assertQueue(this.qJoinsName, {
				durable: true
			});
		});

		this.qLeavesName = prefix + 'leaves-' + shardId + '-' + shardCount;
		conn.createChannel().then(async channel => {
			this.channelLeaves = channel;

			await channel.assertQueue(this.qLeavesName, {
				durable: true
			});
		});

		this.qCmdsName = prefix + 'cmds-' + shardId + '-' + shardCount;
		conn.createChannel().then(async channel => {
			this.channelCmds = channel;

			await channel.assertQueue(this.qCmdsName, {
				durable: true
			});
		});

		SettingsCache.init(this);
	}

	public getShardIdForGuild(guildId: any) {
		const bin = Util.idToBinary(guildId);
		const num = parseInt(bin.substring(0, bin.length - 22), 2);
		return (num % this.options.shardCount) + 1;
	}

	public sendCommandToShard(
		shardId: number,
		payload: { id: string; [x: string]: any }
	) {
		const shardCount = this.options.shardCount;

		const rabbitMqPrefix = this.config.rabbitmq.prefix
			? `${this.config.rabbitmq.prefix}-`
			: '';

		console.log(
			`SENDING MESSAGE TO SHARD ${shardId}/${shardCount}: ${payload}`
		);

		const queueName = `${rabbitMqPrefix}cmds-${shardId}-${shardCount}`;
		return {
			shard: shardId,
			result: this.channelCmds.sendToQueue(
				queueName,
				Buffer.from(JSON.stringify(payload))
			)
		};
	}

	public sendCommandToGuild(
		guildId: any,
		payload: { id: string; [x: string]: any }
	) {
		return this.sendCommandToShard(this.getShardIdForGuild(guildId), payload);
	}

	@once('pause')
	private async _onPause() {
		this.continue();
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);

		await this.channelJoins.prefetch(5);
		this.channelJoins.consume(
			this.qJoinsName,
			msg => this._onGuildMemberAdd(msg),
			{
				noAck: false
			}
		);

		await this.channelLeaves.prefetch(5);
		this.channelLeaves.consume(
			this.qLeavesName,
			msg => this._onGuildMemberRemove(msg),
			{
				noAck: false
			}
		);

		await this.channelCmds.prefetch(5);
		this.channelCmds.consume(this.qCmdsName, msg => this._onShardCommand(msg), {
			noAck: false
		});

		// Setup discord bots api
		if (config.discordBotsToken) {
			this.dbl = new DBL(config.discordBotsToken, this);
		}

		// Disable guilds of pro bot
		this.guilds.forEach(g => {
			if (g.members.has(config.proBotId)) {
				this.disabledGuilds.add(g.id);
			}
		});

		this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 30000);
	}

	@on('guildCreate')
	private async _onGuildCreate(guild: Guild): Promise<void> {
		// Send welcome message to owner with setup instructions
		let owner = guild.owner;
		// TODO: I don't think we have to translate this, right?
		// The default lang is en_us, so at this point it will always be that
		owner.send(
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

	@on('command')
	private async _onCommand(
		name: string,
		args: any[],
		execTime: number,
		message: Message
	) {
		// Ignore messages that are not in guild chat or from disabled guilds
		if (!message.guild || this.disabledGuilds.has(message.guild.id)) {
			return;
		}

		// We have to add the guild and members too, in case our DB does not have them yet
		this.dbQueue.addCommandUsage(
			{
				id: null,
				guildId: message.guild.id,
				memberId: message.author.id,
				command: name,
				args: args.join(' '),
				time: execTime,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: message.guild.id,
				name: message.guild.name,
				icon: message.guild.iconURL(),
				memberCount: message.guild.memberCount
			},
			{
				id: message.author.id,
				name: message.author.username,
				discriminator: message.author.discriminator
			}
		);
	}

	@on('message')
	private async _onMessage(message: Message) {
		// Skip if this is our own message, bot message or empty messages
		if (
			message.author.id === this.user.id ||
			message.author.bot ||
			!message.content.length
		) {
			return;
		}

		// Skip if this is a valid bot command
		// (technically we ignore all prefixes, but bot only responds to default one)
		const cmd = message.content.split(' ')[0].toLowerCase();
		if (this.commands.get(cmd) || this.commands.get(cmd.substring(1))) {
			return;
		}

		if (message.channel instanceof DMChannel) {
			const user = message.author;
			const dmChannel = this.channels.get(config.dmChannel) as TextChannel;

			let oldMessages = await message.channel.messages.fetch({ limit: 2 });
			const isInitialMessage = oldMessages.size <= 1;
			if (isInitialMessage) {
				const initialMessage =
					`Hi there, thanks for writing me!\n\n` +
					`To invite me to your own server, just click here: https://invitemanager.co/add-bot?origin=initial-dm \n\n` +
					`If you need help, you can either write me here (try "help") or join our discord support server: ` +
					`https://discord.gg/Z7rtDpe.\n\nHave a good day!`;
				const embed = createEmbed(this);
				embed.setDescription(initialMessage);
				await sendEmbed(user, embed);
			}

			if (dmChannel) {
				const embed = createEmbed(this);
				embed.setAuthor(
					`${user.username}-${user.discriminator}`,
					user.avatarURL()
				);
				embed.addField('User ID', user.id, true);
				embed.addField('Initial message', isInitialMessage, true);
				embed.setDescription(message.content);
				await sendEmbed(dmChannel, embed);
			}
		}
	}

	private async _onGuildMemberAdd(_msg: amqplib.Message): Promise<void> {
		const content = JSON.parse(_msg.content.toString());
		const guildId: string = content.guildId;
		const guild = this.guilds.get(guildId);
		const member: RabbitMqMember = content.member;
		const join: JoinAttributes = content.join;

		this.channelJoins.ack(_msg, false);

		if (member.user.bot) {
			return;
		}

		console.log(member.id + ' joined ' + guild.id);

		const js = await this.findJoins(guild.id, member.id);

		// Get settings
		const settings = await SettingsCache.get(guild.id);
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

		// Auto remove fakes if enabled
		if (settings.autoSubtractFakes === 'true') {
			// Delete old duplicate removals
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.fake
				}
			});
			// Add removals for duplicate invites
			await customInvites.bulkCreate(
				js.filter((j: any) => parseInt(j.numJoins, 10) > 1).map((j: any) => ({
					id: null,
					creatorId: null,
					guildId: guild.id,
					memberId: j['exactMatch.inviterId'],
					amount: -(parseInt(j.numJoins, 10) - 1),
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.fake
				})),
				{
					updateOnDuplicate: ['amount', 'updatedAt']
				}
			);
		}

		// Auto remove leaves if enabled
		if (settings.autoSubtractLeaves === 'true') {
			// Delete removals for this member because the member rejoined
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				}
			});
		}

		const jn = js.find(j => j.newestId === join.id);

		// Exit if we can't find the join
		if (!jn) {
			console.error(
				`Could not find join for ${member.id} in ` +
					`${guild.id} joinId ${join.id}`
			);
			console.error(
				`RabbitMQ message for ${member.id} in ${guild.id} is: ` +
					JSON.stringify(content)
			);
			if (joinChannel) {
				joinChannel.send(
					Lang.res(lang, 'JOIN_INVITED_BY_UNKNOWN', { id: member.id })
				);
			}
			return;
		}

		const inviteCode = jn['exactMatch.code'];
		const channelName = jn['exactMatch.channel.name'];
		const channelId = jn['exactMatch.channelId'];

		const inviterId = jn['exactMatch.inviterId'];
		const inviterName = jn['exactMatch.inviter.name'];
		const inviterDiscriminator = jn['exactMatch.inviter.discriminator'];
		const inviter: GuildMember = await guild.members
			.fetch(inviterId)
			.catch(() => undefined);
		const invites = await getInviteCounts(guild.id, inviterId);

		// Add any roles for this invite code
		const mem: GuildMember = await guild.members
			.fetch(member.id)
			.catch(() => undefined);
		if (mem) {
			const roleSet = await inviteCodeSettings.find({
				where: {
					guildId: guild.id,
					inviteCode,
					key: InviteCodeSettingsKey.roles
				},
				raw: true
			});
			if (roleSet && roleSet.value) {
				const roles = roleSet.value.split(',');
				mem.roles.add(roles);
			}
		}

		// Promote the inviter if required
		if (inviter && !inviter.user.bot) {
			await promoteIfQualified(guild, inviter, invites.total);
		}

		const joinMessageFormat = settings.joinMessage;
		if (joinChannel && joinMessageFormat) {
			const msg = await this.fillJoinLeaveTemplate(
				joinMessageFormat,
				guild,
				member,
				jn.createdAt,
				inviteCode,
				channelId,
				channelName,
				inviterId,
				inviterName,
				inviterDiscriminator,
				inviter,
				invites
			);

			// Send the message now so it doesn't take too long
			await joinChannel.send(msg);
		}
	}

	private async _onGuildMemberRemove(_msg: amqplib.Message) {
		const content = JSON.parse(_msg.content.toString());
		const guildId: string = content.guildId;
		const guild = this.guilds.get(guildId);
		const member: RabbitMqMember = content.member;
		const join: any = content.join;
		const leave: LeaveAttributes = content.leave;

		this.channelLeaves.ack(_msg, false);

		if (member.user.bot) {
			return;
		}

		console.log(member.id + ' left ' + guild.id);

		// Get settings
		const settings = await SettingsCache.get(guild.id);
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
			console.error(
				`Could not find join for ${member.id} in ` +
					`${guild.id} leaveId: ${leave.id}`
			);
			console.error(
				`RabbitMQ message for ${member.id} in ${guild.id} is: ` +
					JSON.stringify(content)
			);
			if (leaveChannel) {
				leaveChannel.send(
					Lang.res(lang, 'LEAVE_INVITED_BY_UNKNOWN', {
						tag: member.user.username + '#' + member.user.discriminator
					})
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
		if (inviterId && settings.autoSubtractLeaves === 'true') {
			// Delete any old entries for the leaving of this member
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				}
			});

			const threshold = settings.autoSubtractLeaveThreshold;
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
			const msg = await this.fillJoinLeaveTemplate(
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

			leaveChannel.send(msg);
		}
	}

	private async _onShardCommand(msg: amqplib.Message) {
		const content = JSON.parse(msg.content.toString());
		const cmd: ShardCommand = content.cmd;
		const id: string = content.id;

		const guildId = content.guildId;
		const guild = this.guilds.get(guildId);
		const originGuildId = content.originGuildId;

		console.log(`RECEIVED SHARD COMMAND: ${JSON.stringify(content)}`);

		this.channelCmds.ack(msg, false);

		switch (cmd) {
			case ShardCommand.DIAGNOSE:
				console.log(`DIAGNOSING ${guildId}`);

				if (!guild) {
					return this.sendCommandToGuild(originGuildId, {
						cmd: ShardCommand.RESPONSE,
						id,
						error: 'Guild not found'
					});
				}

				const sets = await SettingsCache.get(guildId);
				const perms = guild.me.permissions.toArray();

				let joinChannelPerms: string[] = [];
				if (sets.joinMessageChannel) {
					const joinChannel = guild.channels.get(sets.joinMessageChannel);
					if (joinChannel) {
						joinChannelPerms = joinChannel.permissionsFor(guild.me).toArray();
					} else {
						joinChannelPerms = ['Invalid channel'];
					}
				}

				let leaveChannelPerms: string[] = [];
				if (sets.leaveMessageChannel) {
					const leaveChannel = guild.channels.get(sets.leaveMessageChannel);
					if (leaveChannel) {
						leaveChannelPerms = leaveChannel.permissionsFor(guild.me).toArray();
					} else {
						leaveChannelPerms = ['Invalid channel'];
					}
				}

				let annChannelPerms: string[] = [];
				if (sets.rankAnnouncementChannel) {
					const annChannel = guild.channels.get(sets.rankAnnouncementChannel);
					if (annChannel) {
						annChannelPerms = annChannel.permissionsFor(guild.me).toArray();
					} else {
						annChannelPerms = ['Invalid channel'];
					}
				}

				this.sendCommandToGuild(originGuildId, {
					cmd: ShardCommand.RESPONSE,
					id,
					owner: guild.owner.toJSON(),
					settings: sets,
					perms,
					joinChannelPerms,
					leaveChannelPerms,
					announceChannelPerms: annChannelPerms
				});
				break;

			case ShardCommand.FLUSH_PREMIUM_CACHE:
				console.log(`FLUSHING PREMIUM FOR ${guildId}`);
				SettingsCache.flushPremium(guildId);
				break;

			case ShardCommand.FLUSH_SETTINGS_CACHE:
				console.log(`FLUSHING SETTINGS FOR ${guildId}`);
				SettingsCache.flush(guildId);
				break;

			case ShardCommand.SUDO:
				if (!guild) {
					return this.sendCommandToGuild(originGuildId, {
						cmd: ShardCommand.RESPONSE,
						id,
						error: 'Guild not found'
					});
				}

				const cmdName = content.sudoCmd;
				const sudoCmd = this.commands.resolve(cmdName);
				const channel = new FakeChannel(guild, {});

				channel.listener = data => {
					this.sendCommandToGuild(originGuildId, {
						cmd: ShardCommand.RESPONSE,
						id,
						data
					});
				};

				const fakeMsg = new Message(
					this,
					{
						id,
						content:
							`<@!${this.user.id}>` +
							content.sudoCmd +
							' ' +
							content.args.join(' '),
						author: await this.users.fetch(content.authorId),
						embeds: [],
						attachments: []
					},
					channel
				);
				(fakeMsg as any).__sudo = true;
				sudoCmd.action(fakeMsg, content.args);
				break;

			case ShardCommand.RESPONSE:
				if (this.pendingRabbitMqRequests[id]) {
					this.pendingRabbitMqRequests[id](content);
				} else {
					console.error('NOT EXPECTING RESPONSE FOR ' + id);
				}
				break;

			default:
				console.error(`UNKNOWN COMMAND: ${cmd}`);
		}
	}

	public async logAction(message: Message, action: LogAction, data: any) {
		const logChannelId = (await SettingsCache.get(message.guild.id)).logChannel;

		if (logChannelId) {
			const logChannel = message.guild.channels.get(
				logChannelId
			) as TextChannel;
			if (logChannel) {
				const content =
					message.content.substr(0, 1000) +
					(message.content.length > 1000 ? '...' : '');

				let json = JSON.stringify(data, null, 2);
				if (json.length > 1000) {
					json = json.substr(0, 1000) + '...';
				}

				const embed = createEmbed(message.client);
				embed.setTitle('Log Action');
				embed.addField('Action', action, true);
				embed.addField('Cause', `<@${message.author.id}>`, true);
				embed.addField('Command', content);

				embed.addField('Data', '`' + json + '`');
				sendEmbed(logChannel, embed);
			}
		}

		this.dbQueue.addLogAction(
			{
				id: null,
				guildId: message.guild.id,
				memberId: message.author.id,
				action,
				message: message.content,
				data,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: message.guild.id,
				name: message.guild.name,
				icon: message.guild.iconURL(),
				memberCount: message.guild.memberCount
			},
			{
				id: message.author.id,
				discriminator: message.author.discriminator,
				name: message.author.username
			}
		);
	}

	public async fillJoinLeaveTemplate(
		template: any,
		guild: Guild,
		member: RabbitMqMember,
		joinedAt: number,
		inviteCode: string,
		channelId: string,
		channelName: string,
		inviterId: string,
		inviterName: string,
		inviterDiscriminator: string,
		inviter?: GuildMember,
		invites: InviteCounts = {
			total: 0,
			regular: 0,
			custom: 0,
			fake: 0,
			leave: 0
		}
	): Promise<string | MessageEmbed> {
		if (!inviter && template.indexOf('{inviterName}') >= 0) {
			inviter = await guild.members.fetch(inviterId).catch(() => undefined);
		}
		// Override the inviter name with the display name, if the member is still here
		inviterName =
			inviter && inviter.displayName ? inviter.displayName : inviterName;

		// Total invites is only zero if it's set by default value
		if (
			(invites.total === 0 && template.indexOf('{numInvites}') >= 0) ||
			template.indexOf('{numRegularInvites}') >= 0 ||
			template.indexOf('{numBonusInvites}') >= 0 ||
			template.indexOf('{numFakeInvites}') >= 0 ||
			template.indexOf('{numLeaveInvites}') >= 0
		) {
			invites = await getInviteCounts(guild.id, inviterId);
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') >= 0) {
			numJoins = await joins.count({
				where: {
					guildId: guild.id,
					memberId: member.id
				}
			});
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'ASC']]
			});
			if (temp) {
				firstJoin = moment(temp.createdAt);
			}
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'DESC']],
				offset: 1
			});
			if (temp) {
				prevJoin = moment(temp.createdAt);
			}
		}

		const lang = (await SettingsCache.get(guild.id)).lang;
		const unknown = Lang.res(lang, 'TEMPLATE_UNKNOWN');

		const memberFullName =
			member.user.username + '#' + member.user.discriminator;
		const inviterFullName = inviter
			? inviter.user.username + '#' + inviter.user.discriminator
			: inviterName
				? inviterName + '#' + inviterDiscriminator
				: unknown;

		let memberName = member.nick ? member.nick : member.user.username;
		memberName = JSON.stringify(memberName).substring(1, memberName.length + 1);
		let invName = inviterName ? inviterName : unknown;
		invName = JSON.stringify(invName).substring(1, invName.length + 1);

		const _joinedAt = moment(joinedAt);
		const createdAt = moment(member.user.createdAt);

		return this.fillTemplate(
			guild,
			template,
			{
				inviteCode: inviteCode ? inviteCode : unknown,
				memberId: member.id,
				memberName: memberName,
				memberFullName: memberFullName,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarUrl,
				numJoins: `${numJoins}`,
				inviterId: inviterId ? inviterId : unknown,
				inviterName: invName,
				inviterFullName: inviterFullName,
				inviterMention: inviterId ? `<@${inviterId}>` : unknown,
				inviterImage: inviter ? inviter.user.avatarURL() : undefined,
				numInvites: `${invites.total}`,
				numRegularInvites: `${invites.regular}`,
				numBonusInvites: `${invites.custom}`,
				numFakeInvites: `${invites.fake}`,
				numLeaveInvites: `${invites.leave}`,
				memberCount: `${guild.memberCount}`,
				channelMention: channelId ? `<#${channelId}>` : unknown,
				channelName: channelName ? channelName : unknown
			},
			{
				memberCreated: createdAt,
				firstJoin: firstJoin,
				previousJoin: prevJoin,
				joinedAt: _joinedAt
			}
		);
	}

	public async fillTemplate(
		guild: Guild,
		template: string,
		strings?: { [x: string]: string },
		dates?: { [x: string]: moment.Moment | string }
	) {
		let msg: any = template;

		if (strings) {
			Object.keys(strings).forEach(
				k => (msg = msg.replace(new RegExp(`{${k}}`, 'g'), strings[k]))
			);
		}

		if (dates) {
			Object.keys(dates).forEach(
				k => (msg = this.fillDatePlaceholder(msg, k, dates[k]))
			);
		}

		try {
			const temp = JSON.parse(msg);
			if (await SettingsCache.isPremium(guild.id)) {
				msg = createEmbed(this, temp);
			} else {
				const lang = (await SettingsCache.get(guild.id)).lang;
				msg += '\n\n' + Lang.res(lang, 'JOIN_LEAVE_EMBEDS_IS_PREMIUM');
			}
		} catch (e) {
			//
		}

		return msg;
	}

	private fillDatePlaceholder(
		msg: string,
		name: string,
		value: moment.Moment | string
	) {
		const date = typeof value === 'string' ? value : value.calendar();
		const duration =
			typeof value === 'string'
				? value
				: moment.duration(value.diff(moment())).humanize();
		const timeAgo = typeof value === 'string' ? value : value.fromNow();

		return msg
			.replace(new RegExp(`{${name}:date}`, 'g'), date)
			.replace(new RegExp(`{${name}:duration}`, 'g'), duration)
			.replace(new RegExp(`{${name}:timeAgo}`, 'g'), timeAgo);
	}

	private async findJoins(guildId: string, memberId: string): Promise<any[]> {
		return await joins.findAll({
			attributes: [
				[sequelize.fn('MAX', sequelize.col('join.id')), 'newestId'],
				[sequelize.fn('COUNT', sequelize.col('exactMatch.code')), 'numJoins'],
				[sequelize.fn('MAX', sequelize.col('join.createdAt')), 'newestJoinAt']
			],
			where: {
				memberId,
				guildId
			},
			group: [sequelize.col('exactMatch.code')],
			include: [
				{
					attributes: ['code', 'inviterId', 'channelId'],
					model: inviteCodes,
					as: 'exactMatch',
					required: true,
					include: [
						{
							attributes: ['name', 'discriminator'],
							model: members,
							as: 'inviter',
							required: true
						},
						{
							attributes: ['name'],
							model: channels
						}
					]
				}
			],
			raw: true
		});
	}

	public async getMembersCount() {
		// If cached member count is older than 5 minutes, update it
		if (Date.now() - this.membersCachedAt > 1000 * 60 * 5) {
			console.log('Fetching guild & member count from DB...');
			this.numMembers = await members.count();
			this.membersCachedAt = Date.now();
		}
		return this.numMembers;
	}

	public async getGuildsCount() {
		// If cached guild count is older than 5 minutes, update it
		if (Date.now() - this.guildsCachedAt > 1000 * 60 * 5) {
			console.log('Fetching guild & member count from DB...');
			this.numGuilds = await guilds.count({
				where: {
					deletedAt: null
				}
			});
			this.guildsCachedAt = Date.now();
		}
		return this.numGuilds;
	}

	private async setActivity() {
		if (this.dbl) {
			this.dbl.postStats(
				this.guilds.size,
				this.options.shardId,
				this.options.shardCount
			);
		}

		const numGuilds = await this.getGuildsCount();
		this.user.setActivity(`invitemanager.co - ${numGuilds} servers!`, {
			type: 'PLAYING'
		});
	}

	@on('guildMemberAdd')
	private async _onGuildMemberAddOrig(member: GuildMember) {
		const guildId = member.guild.id;

		// Ignore disabled guilds
		if (this.disabledGuilds.has(guildId)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our premium bot
			if (member.user.id === config.proBotId) {
				console.log(
					`DISABLING BOT FOR ${guildId} BECAUSE PRO VERSION IS ACTIVE`
				);
				this.disabledGuilds.add(guildId);
			}
			return;
		}

		if (await SettingsCache.isPremium(guildId)) {
			sendCaptchaToUserOnJoin(this, member);
		}
	}

	@on('guildMemberRemove')
	private async _onGuildMemberRemoveOrig(member: GuildMember) {
		const guildId = member.guild.id;

		// If the pro version of our bot left, re-enable this version
		if (member.user.bot && member.user.id === config.proBotId) {
			this.disabledGuilds.delete(guildId);
			console.log(`ENABLING BOT IN ${guildId} BECAUSE PRO VERSION LEFT`);
		}
	}

	@on('reconnecting')
	private async _onReconnecting() {
		console.log('DISCORD RECONNECTING:');
	}

	@on('disconnect')
	private async _onDisconnect() {
		console.log('DISCORD DISCONNECT:');
	}

	@on('resume')
	private async _onResume(replayed: number) {
		console.log('DISCORD RESUME:', replayed);
	}

	@on('guildUnavailable')
	private async _onGuildUnavailable(guild: Guild) {
		console.log('DISCORD GUILD_UNAVAILABLE:', guild.id);
	}

	@on('warn')
	private async _onWarn(info: string) {
		console.log('DISCORD WARNING:', info);
	}

	@on('error')
	private async _onError(error: Error) {
		console.log('DISCORD ERROR:', error);
	}
}
