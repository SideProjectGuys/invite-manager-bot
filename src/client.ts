import {
	Client,
	Guild,
	GuildSettings,
	ListenerUtil,
	Message
} from '@yamdbf/core';
import * as amqplib from 'amqplib';
import { DMChannel, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import moment from 'moment';
import * as path from 'path';

import {
	channels,
	customInvites,
	CustomInvitesGeneratedReason,
	guilds,
	inviteCodes,
	JoinAttributes,
	joins,
	LeaveAttributes,
	LogAction,
	members,
	sequelize,
	SettingsKey
} from './sequelize';
import { DBQueue } from './utils/DBQueue';
import { MessageQueue } from './utils/MessageQueue';
import { IMStorageProvider } from './utils/StorageProvider';
import {
	createEmbed,
	getInviteCounts,
	InviteCounts,
	promoteIfQualified,
	sendEmbed
} from './utils/util';

const { on, once } = ListenerUtil;
const config = require('../config.json');

interface RabbitMqMember {
	id: string;
	joinedAt: number;
	nick: string;
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
	public channelJoins: amqplib.Channel;
	public channelLeaves: amqplib.Channel;
	public qJoinsName: string;
	public qLeavesName: string;

	public startedAt: moment.Moment;
	public dbQueue: DBQueue;
	public messageQueue: MessageQueue;
	public activityInterval: NodeJS.Timer;

	public numGuilds: number = 0;
	public guildsCachedAt: number = 0;

	public numMembers: number = 0;
	public membersCachedAt: number = 0;

	public constructor(
		version: string,
		conn: amqplib.Connection,
		shardId: number,
		shardCount: number
	) {
		super(
			{
				provider: IMStorageProvider,
				commandsDir: path.join(__dirname, 'commands'),
				token: config.discordToken,
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
					'ping',
					'help'
				],
				unknownCommandError: false
			},
			{
				apiRequestMethod: 'burst',
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

		this.messageQueue = new MessageQueue(this);
		this.dbQueue = new DBQueue(this);

		// Setup RabbitMQ channels
		this.qJoinsName = 'joins-' + shardId + '-' + shardCount;
		conn.createChannel().then(async channel => {
			this.channelJoins = channel;

			await channel.assertQueue(this.qJoinsName, {
				durable: true
			});
		});

		this.qLeavesName = 'leaves-' + shardId + '-' + shardCount;
		conn.createChannel().then(async channel => {
			this.channelLeaves = channel;

			await channel.assertQueue(this.qLeavesName, {
				durable: true
			});
		});
	}

	@once('pause')
	private async _onPause() {
		this.continue();
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		this.messageQueue.addMessage('clientReady executed');
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

		this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 30000);
	}

	@on('guildCreate')
	private async _onGuildCreate(guild: Guild): Promise<void> {
		// Send welcome message to owner with setup instructions
		let owner = guild.owner;
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
		this.messageQueue.addMessage(
			`EVENT(guildCreate): ${guild.id} ${guild.name} ${guild.memberCount}`
		);
	}

	@on('guildDelete')
	private async _onGuildDelete(guild: Guild): Promise<void> {
		this.messageQueue.addMessage(
			`EVENT(guildDelete): ${guild.id} ${guild.name} ${guild.memberCount}`
		);
	}

	@on('command')
	private async _onCommand(
		name: string,
		args: any[],
		execTime: number,
		message: Message
	) {
		// Ignore messages that are not in guild chat
		if (!message.guild) {
			return;
		}

		// We have to add the members too, in case our DB doens't have them yet
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
					`To invite me to your own server, just click here: https://invitemanager.co/add-bot?ref=initial-dm \n\n` +
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
		const sets: GuildSettings = this.storage.guilds.get(guild.id).settings;
		const joinChannelId = (await sets.get(
			SettingsKey.joinMessageChannel
		)) as string;

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
		const autoSubtractFakes = (await sets.get(
			SettingsKey.autoSubtractFakes
		)) as string;
		if (autoSubtractFakes === 'true') {
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
		const autoSubtractLeaves = await sets.get(SettingsKey.autoSubtractLeaves);
		if (autoSubtractLeaves === 'true') {
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
				const id = member.id;
				const msg =
					`<@${id}> joined the server using a temporary invite, ` +
					`so I can't figure out who invited them.`;
				joinChannel.send(msg);
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

		// Promote the inviter if required
		if (inviter && !inviter.user.bot) {
			await promoteIfQualified(guild, inviter, invites.total);
		}

		const joinMessageFormat = (await sets.get(
			SettingsKey.joinMessage
		)) as string;
		if (joinChannel && joinMessageFormat) {
			const msg = await this.fillTemplate(
				joinMessageFormat,
				guild,
				member,
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
		const sets: GuildSettings = this.storage.guilds.get(guild.id).settings;
		const leaveChannelId = (await sets.get(
			SettingsKey.leaveMessageChannel
		)) as string;

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
				const tag = member.user.username + '#' + member.user.discriminator;
				const msg = `${tag} left the server, but I couldn't figure out who invited them`;
				leaveChannel.send(msg);
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
		const autoSubtractLeaves = await sets.get(SettingsKey.autoSubtractLeaves);
		if (inviterId && autoSubtractLeaves === 'true') {
			// Delete any old entries for the leaving of this member
			await customInvites.destroy({
				where: {
					guildId: guild.id,
					reason: member.id,
					generatedReason: CustomInvitesGeneratedReason.leave
				}
			});

			const threshold = await sets.get(SettingsKey.autoSubtractLeaveThreshold);
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

		const leaveMessageFormat = (await sets.get(
			SettingsKey.leaveMessage
		)) as string;
		if (leaveChannel && leaveMessageFormat) {
			const msg = await this.fillTemplate(
				leaveMessageFormat,
				guild,
				member,
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

	public async logAction(message: Message, action: LogAction, data: any) {
		const logChannelId = (await message.guild.storage.settings.get(
			SettingsKey.logChannel
		)) as string;
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
				id: message.author.id,
				discriminator: message.author.discriminator,
				name: message.author.username
			}
		);
	}

	public async fillTemplate(
		template: any,
		guild: Guild,
		member: RabbitMqMember,
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
		const userSince = moment(member.user.createdAt);

		const joinedAt = moment(member.joinedAt);

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
				order: [['createdAt', 'ASC']],
				limit: 1
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
				order: [['createdAt', 'ASC']],
				limit: 1,
				offset: 1
			});
			if (temp) {
				prevJoin = moment(temp.createdAt);
			}
		}

		const memberFullName =
			member.user.username + '#' + member.user.discriminator;
		const inviterFullName = inviter
			? inviter.user.username + '#' + inviter.user.discriminator
			: inviterName
				? inviterName + '#' + inviterDiscriminator
				: 'Unknown';

		let msg = template;
		msg = this.fillDatePlaceholder(msg, 'memberCreated', userSince);
		msg = this.fillDatePlaceholder(msg, 'firstJoin', firstJoin);
		msg = this.fillDatePlaceholder(msg, 'previousJoin', prevJoin);
		msg = this.fillDatePlaceholder(msg, 'joinedAt', joinedAt);
		msg = msg
			.replace('{inviteCode}', inviteCode ? inviteCode : 'Unknown')
			.replace('{memberName}', member.nick ? member.nick : member.user.username)
			.replace('{memberFullName}', memberFullName)
			.replace('{memberMention}', `<@${member.id}>`)
			.replace('{memberImage}', member.user.avatarUrl)
			.replace('{numJoins}', `${numJoins}`)
			.replace('{inviterName}', inviterName ? inviterName : 'Unknown')
			.replace('{inviterFullName}', inviterFullName)
			.replace('{inviterMention}', inviterId ? `<@${inviterId}>` : 'Unknown')
			.replace('{inviterImage}', inviter ? inviter.user.avatarURL : undefined)
			.replace('{numInvites}', `${invites.total}`)
			.replace('{numRegularInvites}', `${invites.regular}`)
			.replace('{numBonusInvites}', `${invites.custom}`)
			.replace('{numFakeInvites}', `${invites.fake}`)
			.replace('{numLeaveInvites}', `${invites.leave}`)
			.replace('{memberCount}', `${guild.memberCount}`)
			.replace('{channelMention}', channelId ? `<#${channelId}>` : 'Unknown')
			.replace('{channelName}', channelName ? channelName : 'Unknown');

		try {
			msg = JSON.parse(msg);
			msg = createEmbed(this, msg);
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
			.replace(`{${name}:date}`, date)
			.replace(`{${name}:duration}`, duration)
			.replace(`{${name}:timeAgo}`, timeAgo);
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
		const numGuilds = await this.getGuildsCount();

		let user: any = this.user;
		user.setPresence({
			game: { name: `invitemanager.co - ${numGuilds} servers!`, type: 0 }
		});
	}

	@on('reconnecting')
	private async _onReconnecting() {
		console.log('DISCORD RECONNECTING:');
		try {
			this.messageQueue.addMessage(`EVENT(reconnecting)`);
		} catch (e) {
			console.error('DISCORD RECONNECTING:', e);
		}
	}

	@on('disconnect')
	private async _onDisconnect() {
		console.log('DISCORD DISCONNECT:');
		try {
			this.messageQueue.addMessage(`EVENT(disconnect)`);
		} catch (e) {
			console.error('DISCORD DISCONNECT:', e);
		}
	}

	@on('resume')
	private async _onResume(replayed: number) {
		console.log('DISCORD RESUME:', replayed);
		try {
			this.messageQueue.addMessage(`EVENT(resume):${replayed}`);
		} catch (e) {
			console.error('DISCORD RESUME:', e);
		}
	}

	@on('guildUnavailable')
	private async _onGuildUnavailable(guild: Guild) {
		console.log('DISCORD GUILD_UNAVAILABLE:', guild.id);
		try {
			this.messageQueue.addMessage(
				`EVENT(guildUnavailable):${guild.id} ${guild.name} ${guild.memberCount}`
			);
		} catch (e) {
			console.error('DISCORD GUILD_UNAVAILABLE:', e);
		}
	}

	@on('warn')
	private async _onWarn(info: string) {
		console.log('DISCORD WARNING:', info);
		try {
			this.messageQueue.addMessage(`EVENT(warn):${JSON.stringify(info)}`);
		} catch (e) {
			console.error('DISCORD WARNING:', e);
		}
	}

	@on('error')
	private async _onError(error: Error) {
		console.log('DISCORD ERROR:', error);
		try {
			this.messageQueue.addMessage(`EVENT(error):${JSON.stringify(error)}`);
		} catch (e) {
			console.error('DISCORD ERROR:', e);
		}
	}
}
