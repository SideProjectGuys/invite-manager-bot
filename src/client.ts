import * as amqplib from 'amqplib';
import DBL from 'dblapi.js';
import { Client, Embed, Guild, Member, Message, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { Command } from './commands/Command';
import { createEmbed, sendEmbed, sendReply } from './functions/Messaging';
import {
	channels,
	customInvites,
	CustomInvitesGeneratedReason,
	defaultSettings,
	guilds,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	JoinAttributes,
	joins,
	LeaveAttributes,
	LogAction,
	members,
	sequelize
} from './sequelize';
import { DBCache } from './storage/DBCache';
import { DBQueue } from './storage/DBQueue';
import { ShardCommand } from './types';
import {
	getInviteCounts,
	idToBinary,
	InviteCounts,
	promoteIfQualified
} from './util';

const config = require('../config.json');
const idRegex: RegExp = /^(?:<@!?)?(\d+)>? ?(.*)$/;

i18n.configure({
	locales: ['en', 'de', 'el', 'en', 'es', 'fr', 'it', 'nl', 'pt', 'ro'],
	defaultLocale: 'en',
	syncFiles: true,
	directory: __dirname + '/../locale',
	objectNotation: true,
	logDebugFn: function(msg: string) {
		console.log('debug', msg);
	},
	logWarnFn: function(msg: string) {
		console.log('warn', msg);
	},
	logErrorFn: function(msg: string) {
		console.log('error', msg);
	}
});

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

	public cache: DBCache;
	public commands: Command[];

	public conn: amqplib.Connection;
	public qJoinsName: string;
	public channelJoins: amqplib.Channel;
	public qLeavesName: string;
	public channelLeaves: amqplib.Channel;
	public qCmdsName: string;
	public channelCmds: amqplib.Channel;

	public shardId: number;
	public numShards: number;
	public startedAt: moment.Moment;
	public dbQueue: DBQueue;
	public activityInterval: NodeJS.Timer;

	public numGuilds: number = 0;
	public guildsCachedAt: number = 0;

	public numMembers: number = 0;
	public membersCachedAt: number = 0;

	private dbl: DBL;

	public disabledGuilds: Set<string> = new Set();
	public pendingRabbitMqRequests: Map<string, (response: any) => void>;

	public constructor(
		version: string,
		conn: amqplib.Connection,
		token: string,
		shardId: number,
		shardCount: number
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
			messageLimit: 2
		});

		this.version = version;
		this.conn = conn;
		this.config = config;
		this.shardId = shardId;
		this.numShards = shardCount;
		this.startedAt = moment();

		this.cache = new DBCache(this);
		this.dbQueue = new DBQueue(this);
		this.pendingRabbitMqRequests = new Map();

		// Setup RabbitMQ channels
		const prefix = config.rabbitmq.prefix ? config.rabbitmq.prefix + '-' : '';

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

		this.commands = [];

		let clazz = require('./commands/info/botInfo').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/info/getBot').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/info/members').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/invites/invites').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/info/help').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/config/config').default;
		this.commands.push(new clazz(this));

		clazz = require('./commands/ranks/addRank').default;
		this.commands.push(new clazz(this));

		this.on('ready', this._onClientReady);
		this.on('guildCreate', this._onGuildCreate);
		this.on('messageCreate', this._onMessage);
		this.on('guildMemberAdd', this._onGuildMemberAddOrig);
		this.on('guildMemberRemove', this._onGuildMemberRemoveOrig);
		this.on('guildUnavailable', this._onGuildUnavailable);
		this.on('disconnect', this._onDisconnect);
		this.on('connect', this._onConnect);
		this.on('warn', this._onWarn);
		this.on('error', this._onError);
	}

	public getShardIdForGuild(guildId: any) {
		const bin = idToBinary(guildId);
		const num = parseInt(bin.substring(0, bin.length - 22), 2);
		return (num % this.numShards) + 1;
	}

	public sendCommandToShard(
		shardId: number,
		payload: { id: string; [x: string]: any }
	) {
		const shardCount = this.numShards;

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

	private async _onClientReady(): Promise<void> {
		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);

		await this.cache.init();

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

	private async _onGuildCreate(guild: Guild): Promise<void> {
		// Send welcome message to owner with setup instructions
		const owner = await guild.getRESTMember(guild.ownerID);
		// TODO: I don't think we have to translate this, right?
		// The default lang is en_us, so at this point it will always be that
		const channel = await owner.user.getDMChannel();
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

	/*private async _onCommand(
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
	}*/

	private async _onMessage(message: Message) {
		// Skip if this is our own message, bot message or empty messages
		if (
			message.author.id === this.user.id ||
			message.author.bot ||
			!message.content.length
		) {
			return;
		}

		const channel = message.channel;
		const guild = (channel as TextChannel).guild;

		if (guild) {
			// Check if this guild is disabled due to the pro bot
			if (
				this.disabledGuilds.has(guild.id) &&
				!message.content.startsWith(`<@${this.user.id}>`) &&
				!message.content.startsWith(`<@!${this.user.id}>`)
			) {
				return;
			}
		}

		console.log(
			`${guild ? guild.name : 'DM'} (${message.author.username}): ` +
				`${message.content}`
		);

		// Figure out which command is being run
		let content = message.content.trim();
		const sets = guild ? await this.cache.get(guild.id) : defaultSettings;
		const t = (key: string, replacements?: { [key: string]: string }) =>
			i18n.__({ locale: lang, phrase: key }, replacements);

		if (idRegex.test(content)) {
			const matches = content.match(idRegex);

			if (matches[1] !== this.user.id) {
				return;
			}

			content = matches[2];
		} else {
			// Check for prefix if this is in a guild
			if (guild) {
				if (!content.startsWith(sets.prefix)) {
					return;
				}

				content = content.substring(sets.prefix.length);
			}
		}

		console.log(content);
		const splits = content.split(' ');
		const cmdStr = splits[0];

		// Find the command
		let cmd: Command = this.commands.find(
			c => c.name.toLowerCase() === cmdStr || c.aliases.indexOf(cmdStr) >= 0
		);

		console.log(cmd ? cmd.name : 'INVALID COMMAND: ' + cmdStr);

		// Command not found, or not allowed in DM
		if (!cmd || (cmd.guildOnly && !guild)) {
			return;
		}

		let me: Member = undefined;
		const lang = sets.lang;

		// Guild only stuff
		if (guild) {
			// Check permissions for guilds
			let member = message.member;
			if (!member) {
				member = guild.members.get(message.author.id);
			}
			if (!member) {
				member = await guild.getRESTMember(message.author.id);
			}
			if (!member) {
				console.error(
					`Could not get member ${message.author.id} for ${guild.id}`
				);
				sendReply(this, message, t('permissions.memberError'));
				return;
			}

			// Always allow admins
			if (!message.member.permission.has('ADMINISTRATOR')) {
				const perms = (await this.cache.getPermissions(guild.id))[cmd.name];

				if (perms && perms.length > 0) {
					// Check that we have at least one of the required roles
					if (!perms.some(p => message.member.roles.indexOf(p) >= 0)) {
						sendReply(
							this,
							message,
							t('permissions.role', {
								roles: perms.map(p => `<@&${p}>`).join(', ')
							})
						);
						return;
					}
				}

				// Allow commands that require no roles, if strict is not true
				if (cmd.strict) {
					sendReply(this, message, t('permissions.adminOnly'));
					return;
				}
			}

			// Add self context
			me = guild.members.get(this.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.user.id);
			}
		}

		const context = {
			guild,
			me,
			t,
			settings: sets
		};

		// Resolve arguments
		const rawArgs = splits.slice(1);
		const args: any[] = [];
		let i = 0;
		for (const arg of cmd.args) {
			const resolver = cmd.resolvers[i];
			const val = await resolver.resolve(rawArgs[i], context, args);
			if (typeof val === typeof undefined && arg.required) {
				sendReply(
					this,
					message,
					t('arguments.missingRequired', {
						name: arg.name,
						help: resolver.getHelp(context)
					})
				);
				return;
			}
			args.push(val);
			i++;
		}

		console.log(args);

		await cmd.action(message, args, context);

		// Skip if this is a valid bot command
		// (technically we ignore all prefixes, but bot only responds to default one)
		/*const cmd = message.content.split(' ')[0].toLowerCase();
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
				embed.fields.push('User ID', user.id, true);
				embed.fields.push('Initial message', isInitialMessage, true);
				embed.setDescription(message.content);
				await sendEmbed(dmChannel, embed);
			}
		}*/
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
		const settings = await this.cache.get(guild.id);
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
				joinChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'JOIN_INVITED_BY_UNKNOWN' },
						{ id: member.id }
					)
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
		let inviter = guild.members.get(inviterId);
		if (!inviter) {
			inviter = await guild.getRESTMember(inviterId);
		}
		const invites = await getInviteCounts(guild.id, inviterId);

		// Add any roles for this invite code
		let mem = guild.members.get(member.id);
		if (!mem) {
			mem = await guild.getRESTMember(member.id);
		}
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
				roles.forEach(r => mem.addRole(r));
			}
		}

		// Promote the inviter if required
		let me = guild.members.get(this.user.id);
		if (!me) {
			me = await guild.getRESTMember(this.user.id);
		}
		if (inviter && !inviter.user.bot) {
			await promoteIfQualified(this, guild, inviter, me, invites.total);
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
			await joinChannel.createMessage(msg);
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
		const settings = await this.cache.get(guild.id);
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
				leaveChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'LEAVE_INVITED_BY_UNKNOWN' },
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
		if (inviterId && settings.autoSubtractLeaves === 'true') {
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

			leaveChannel.createMessage(msg);
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

				const sets = await this.cache.get(guildId);
				const perms = guild.members.get(this.user.id).permission.json;

				let joinChannelPerms: { [key: string]: boolean } = {};
				if (sets.joinMessageChannel) {
					const joinChannel = guild.channels.get(sets.joinMessageChannel);
					if (joinChannel) {
						joinChannelPerms = joinChannel.permissionsOf(this.user.id).json;
					} else {
						joinChannelPerms = { 'Invalid channel': true };
					}
				}

				let leaveChannelPerms: { [key: string]: boolean } = {};
				if (sets.leaveMessageChannel) {
					const leaveChannel = guild.channels.get(sets.leaveMessageChannel);
					if (leaveChannel) {
						leaveChannelPerms = leaveChannel.permissionsOf(this.user.id).json;
					} else {
						leaveChannelPerms = { 'Invalid channel': true };
					}
				}

				let annChannelPerms: { [key: string]: boolean } = {};
				if (sets.rankAnnouncementChannel) {
					const annChannel = guild.channels.get(sets.rankAnnouncementChannel);
					if (annChannel) {
						annChannelPerms = annChannel.permissionsOf(this.user.id).json;
					} else {
						annChannelPerms = { 'Invalid channel': true };
					}
				}

				this.sendCommandToGuild(originGuildId, {
					cmd: ShardCommand.RESPONSE,
					id,
					settings: sets,
					perms,
					joinChannelPerms,
					leaveChannelPerms,
					announceChannelPerms: annChannelPerms
				});
				break;

			case ShardCommand.FLUSH_PREMIUM_CACHE:
				console.log(`FLUSHING PREMIUM FOR ${guildId}`);
				this.cache.flushPremium(guildId);
				break;

			case ShardCommand.FLUSH_SETTINGS_CACHE:
				console.log(`FLUSHING SETTINGS FOR ${guildId}`);
				this.cache.flush(guildId);
				break;

			/*case ShardCommand.SUDO:
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
				break;*/

			case ShardCommand.RESPONSE:
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

	public async logAction(
		guild: Guild,
		message: Message,
		action: LogAction,
		data: any
	) {
		const logChannelId = (await this.cache.get(guild.id)).logChannel;

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

				const embed = createEmbed(this, {
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
				sendEmbed(this, logChannel, embed);
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
				memberCount: guild.memberCount
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
		inviter?: Member,
		invites: InviteCounts = {
			total: 0,
			regular: 0,
			custom: 0,
			fake: 0,
			leave: 0
		}
	): Promise<string | Embed> {
		if (!inviter && template.indexOf('{inviterName}') >= 0) {
			inviter = await guild.getRESTMember(inviterId).catch(() => undefined);
		}
		// Override the inviter name with the display name, if the member is still here
		inviterName = inviter && inviter.nick ? inviter.nick : inviterName;

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

		const lang = (await this.cache.get(guild.id)).lang;
		const unknown = i18n.__({ locale: lang, phrase: 'TEMPLATE_UNKNOWN' });

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
				inviterImage: inviter ? inviter.user.avatarURL : undefined,
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
	): Promise<Embed | string> {
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
			if (await this.cache.isPremium(guild.id)) {
				msg = createEmbed(this, temp);
			} else {
				const lang = (await this.cache.get(guild.id)).lang;
				msg +=
					'\n\n' +
					i18n.__({ locale: lang, phrase: 'JOIN_LEAVE_EMBEDS_IS_PREMIUM' });
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
			this.dbl.postStats(this.guilds.size, this.shardId, this.numShards);
		}

		const numGuilds = await this.getGuildsCount();
		this.editStatus('online', {
			name: `invitemanager.co - ${numGuilds} servers!`,
			type: 2
		});
	}

	private async _onGuildMemberAddOrig(guild: Guild, member: Member) {
		const guildId = guild.id;

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
	}

	private async _onGuildMemberRemoveOrig(member: Member) {
		const guildId = member.guild.id;

		// If the pro version of our bot left, re-enable this version
		if (member.user.bot && member.user.id === config.proBotId) {
			this.disabledGuilds.delete(guildId);
			console.log(`ENABLING BOT IN ${guildId} BECAUSE PRO VERSION LEFT`);
		}
	}

	private async _onConnect() {
		console.log('DISCORD CONNECT');
	}

	private async _onDisconnect() {
		console.log('DISCORD DISCONNECT');
	}

	private async _onGuildUnavailable(guild: Guild) {
		console.log('DISCORD GUILD_UNAVAILABLE:', guild.id);
	}

	private async _onWarn(info: string) {
		console.log('DISCORD WARNING:', info);
	}

	private async _onError(error: Error) {
		console.log('DISCORD ERROR:', error);
	}
}
