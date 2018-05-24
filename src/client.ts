import { DMChannel, GuildMember, RichEmbed, TextChannel } from 'discord.js';
import * as moment from 'moment';
import * as path from 'path';
import {
	Client,
	Guild,
	GuildSettings,
	GuildStorage,
	ListenerUtil,
	Message
} from 'yamdbf';

import {
	channels,
	commandUsage,
	customInvites,
	guilds,
	inviteCodes,
	joins,
	LogAction,
	members,
	sequelize,
	settings,
	SettingsKey
} from './sequelize';
import { BooleanResolver } from './utils/BooleanResolver';
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

export class IMClient extends Client {
	public version: string;
	public config: any;

	public startedAt: moment.Moment;
	public dbQueue: DBQueue;
	public messageQueue: MessageQueue;
	public activityInterval: NodeJS.Timer;

	public numGuilds: number = 0;
	public guildsCachedAt: number = 0;

	public numMembers: number = 0;
	public membersCachedAt: number = 0;

	public constructor(version: string, shardId: number, shardCount: number) {
		super(
			{
				provider: IMStorageProvider,
				customResolvers: [BooleanResolver],
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
				shardId,
				shardCount,
				disabledEvents: ['TYPING_START', 'USER_UPDATE', 'PRESENCE_UPDATE'],
				messageCacheMaxSize: 2,
				messageCacheLifetime: 10,
				messageSweepInterval: 30
			}
		);

		this.version = version;
		this.config = config;
		this.startedAt = moment();

		this.messageQueue = new MessageQueue(this);
		this.dbQueue = new DBQueue(this);
	}

	@once('pause')
	private async _onPause() {
		this.continue();
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		this.messageQueue.addMessage('clientReady executed');
		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);

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
				config.botSupport
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

			let oldMessages = await message.channel.fetchMessages({ limit: 2 });
			const isInitialMessage = oldMessages.size <= 1;
			if (isInitialMessage) {
				const initialMessage =
					`Hi there, thanks for writing me!\n\n` +
					`To invite me to your own server, just click here: https://invitemanager.co/add-bot?ref=initial-dm \n\n` +
					`If you need help, you can either write me here (try "help") or join our discord support server: ` +
					`https://discord.gg/Z7rtDpe.\n\nHave a good day!`;
				const embed = createEmbed(this);
				embed.setDescription(initialMessage);
				sendEmbed(user, embed);
			}

			if (dmChannel) {
				const embed = createEmbed(this);
				embed.setAuthor(
					`${user.username}-${user.discriminator}`,
					user.avatarURL
				);
				embed.addField('User ID', user.id, true);
				embed.addField('Initial message', isInitialMessage, true);
				embed.setDescription(message.content);
				sendEmbed(dmChannel, embed);
			}
		}
	}

	@on('guildMemberAdd')
	private async _onGuildMemberAdd(member: GuildMember): Promise<void> {
		const ts = Math.floor(member.joinedTimestamp / 1000) * 1000;

		let js = await this.findJoins(member.guild.id, member.id, 2000);
		if (!js || !js.find((j: any) => j.newestJoinAt.getTime() === ts)) {
			js = await this.findJoins(member.guild.id, member.id, 5000);
		}

		if (!js || !js.find((j: any) => j.newestJoinAt.getTime() === ts)) {
			console.log(
				`Could not find join for ${member.id} in ${member.guild.id} at ${
					member.joinedTimestamp
				}`
			);
			return;
		}

		const join = js.find((j: any) => j.newestJoinAt.getTime() === ts);

		const inviteCode = join['exactMatch.code'];
		const channelName = join['exactMatch.channel.name'];
		const channelId = join['exactMatch.channelId'];

		const inviterId = join['exactMatch.inviterId'];
		const inviterName = join['exactMatch.inviter.name'];
		const inviter: GuildMember = await member.guild
			.fetchMember(inviterId)
			.catch(() => null);
		const invites = await getInviteCounts(member.guild.id, inviterId);

		if (inviter && !inviter.user.bot) {
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(
				member.guild,
				inviter,
				invites.total
			);
		}

		const sets: GuildSettings = this.storage.guilds.get(member.guild.id)
			.settings;
		const joinChannelId = (await sets.get(
			SettingsKey.joinMessageChannel
		)) as string;

		if (!joinChannelId) {
			console.log(`Guild ${member.guild.id} has no join message channel`);
			return;
		}

		const joinChannel = member.guild.channels.get(joinChannelId) as TextChannel;
		if (!joinChannel) {
			console.log(
				`Guild ${
					member.guild.id
				} has invalid join message channel ${joinChannelId}`
			);
			return;
		}

		const joinMessageFormat = (await sets.get(
			SettingsKey.joinMessage
		)) as string;
		if (joinMessageFormat) {
			const msg = await this.fillTemplate(
				joinMessageFormat,
				member,
				inviteCode,
				js.reduce((acc: number, j: any) => acc + parseInt(j.numJoins, 10), 0),
				channelId,
				channelName,
				inviterId,
				inviterName,
				inviter,
				invites
			);

			// Send the message now so it doesn't take too long
			await joinChannel.send(msg);
		}

		const autoSubtractFakes = (await sets.get(
			SettingsKey.autoSubtractFakes
		)) as string;
		if (autoSubtractFakes === 'true') {
			// Delete old duplicate removals
			await customInvites.destroy({
				where: {
					guildId: member.guild.id,
					reason: `fake:${member.id}`,
					generated: true
				}
			});
			// Add removals for duplicate invites
			await customInvites.bulkCreate(
				js.filter((j: any) => parseInt(j.numJoins, 10) > 1).map((j: any) => ({
					guildId: member.guild.id,
					memberId: j['exactMatch.inviterId'],
					amount: -parseInt(j.numJoins, 10),
					reason: `fake:${member.id}`,
					generated: true
				})),
				{
					updateOnDuplicate: ['amount', 'updatedAt']
				}
			);
		}
	}

	@on('guildMemberRemove')
	private async _onGuildMemberRemove(member: GuildMember): Promise<void> {
		const ts = Math.round(member.joinedTimestamp / 1000) * 1000;

		let js = await this.findJoins(member.guild.id, member.id, 2000);
		if (!js || !js.find((j: any) => j.newestJoinAt.getTime() === ts)) {
			js = await this.findJoins(member.guild.id, member.id, 5000);
		}

		if (!js || !js.find((j: any) => j.newestJoinAt.getTime() === ts)) {
			console.log(
				`Could not find join for ${member.id} in ${member.guild.id} at ${
					member.joinedTimestamp
				}`
			);
			return;
		}

		const join = js.find((j: any) => j.newestJoinAt.getTime() === ts);

		const inviteCode = join['exactMatch.code'];
		const channelName = join['exactMatch.channel.name'];
		const channelId = join['exactMatch.channelId'];

		const inviterId = join['exactMatch.inviterId'];
		const inviterName = join['exactMatch.inviter.name'];

		const sets: GuildSettings = this.storage.guilds.get(member.guild.id)
			.settings;
		const leaveChannelId = (await sets.get(
			SettingsKey.leaveMessageChannel
		)) as string;

		if (!leaveChannelId) {
			console.log(`Guild ${member.guild.id} has no leave message channel`);
			return;
		}
		const leaveChannel = member.guild.channels.get(
			leaveChannelId
		) as TextChannel;
		if (!leaveChannel) {
			console.log(
				`Guild ${
					member.guild.id
				} has invalid leave message channel ${leaveChannelId}`
			);
			return;
		}

		const leaveMessageFormat = (await sets.get(
			SettingsKey.leaveMessage
		)) as string;
		if (!leaveMessageFormat) {
			console.log(`Guild ${member.guild.id} has no leave message`);
			return;
		}

		const msg = await this.fillTemplate(
			leaveMessageFormat,
			member,
			inviteCode,
			js.reduce((acc: number, j: any) => acc + parseInt(j.numJoins, 10), 0),
			channelId,
			channelName,
			inviterId,
			inviterName
		);

		leaveChannel.send(msg);
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

		this.dbQueue.addLogAction({
			id: null,
			guildId: message.guild.id,
			memberId: message.author.id,
			action,
			message: message.content,
			data,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	public async fillTemplate(
		template: any,
		member: GuildMember,
		inviteCode: string,
		numJoins: number,
		channelId: string,
		channelName: string,
		inviterId: string,
		inviterName: string,
		inviter?: GuildMember,
		invites: InviteCounts = { total: 0, code: 0, custom: 0, auto: 0 }
	): Promise<string | RichEmbed> {
		const userSince = moment(member.user.createdAt);

		const joinedAt = moment(member.joinedAt);

		if (!inviter && template.indexOf('{inviterName}') >= 0) {
			inviter = await member.guild.fetchMember(inviterId).catch(() => null);
		}

		// invites.total is only zero when we use the predefined value
		// that means if it's zero we have to fetch the invites
		if (
			invites.total === 0 &&
			(template.indexOf('{numInvites}') >= 0 ||
				template.indexOf('{numRegularInvites}') >= 0 ||
				template.indexOf('{numBonusInvites}') >= 0)
		) {
			invites = await getInviteCounts(member.guild.id, inviterId);
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: member.guild.id,
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
					guildId: member.guild.id,
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

		let msg = template;
		msg = this.fillDatePlaceholder(msg, 'memberCreated', userSince);
		msg = this.fillDatePlaceholder(msg, 'firstJoin', firstJoin);
		msg = this.fillDatePlaceholder(msg, 'previousJoin', prevJoin);
		msg = this.fillDatePlaceholder(msg, 'joinedAt', joinedAt);
		msg = msg
			.replace('{inviteCode}', inviteCode)
			.replace('{memberName}', member.displayName)
			.replace('{memberMention}', `<@${member.id}>`)
			.replace('{memberImage}', member.user.avatarURL)
			.replace('{numJoins}', `${numJoins}`)
			.replace('{inviterName}', inviter ? inviter.displayName : inviterName)
			.replace('{inviterMention}', `<@${inviterId}>`)
			.replace('{inviterImage}', inviter ? inviter.user.avatarURL : '')
			.replace('{numInvites}', `${invites.total}`)
			.replace('{numRegularInvites}', `${invites.code}`)
			.replace('{numBonusInvites}', `${invites.custom}`)
			.replace('{memberCount}', `${member.guild.memberCount}`)
			.replace('{channelMention}', `<#${channelId}>`)
			.replace('{channelName}', `${channelName}`);

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

	private async findJoins(
		guildId: string,
		memberId: string,
		timeOut: number
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const func = async () => {
				resolve(
					await joins.findAll({
						attributes: [
							[
								sequelize.fn('COUNT', sequelize.col('exactMatch.code')),
								'numJoins'
							],
							[
								sequelize.fn('MAX', sequelize.col('join.createdAt')),
								'newestJoinAt'
							]
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
								include: [
									{
										attributes: ['name'],
										model: members,
										as: 'inviter'
									},
									{
										attributes: ['name'],
										model: channels
									}
								]
							}
						],
						raw: true
					})
				);
			};
			setTimeout(func, timeOut);
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
