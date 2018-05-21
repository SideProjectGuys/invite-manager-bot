import {
	DMChannel,
	GuildMember,
	Message,
	RichEmbed,
	TextChannel
} from 'discord.js';
import * as moment from 'moment';
import * as path from 'path';
import {
	Client,
	Guild,
	GuildSettings,
	GuildStorage,
	ListenerUtil
} from 'yamdbf';

import {
	channels,
	customInvites,
	guilds,
	inviteCodes,
	joins,
	members,
	sequelize,
	settings,
	SettingsKey
} from './sequelize';
import { BooleanResolver } from './utils/BooleanResolver';
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
	}

	@once('pause')
	private async _onPause() {
		// await this.setDefaultSetting('prefix', '!');
		this.continue();
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		this.messageQueue = new MessageQueue(this);
		this.messageQueue.addMessage('clientReady executed');
		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);

		this.setActivity();
		this.activityInterval = setInterval(() => this.setActivity(), 30000);
	}

	@on('guildCreate')
	private async _onGuildCreate(guild: Guild): Promise<void> {
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
		let join = await this.findJoin(
			member.id,
			member.guild.id,
			member.joinedTimestamp,
			2000
		);
		if (!join) {
			join = await this.findJoin(
				member.id,
				member.guild.id,
				member.joinedTimestamp,
				5000
			);
		}

		if (!join) {
			console.log(
				`Could not find join for ${member.id} in ${member.guild.id} at ${
					member.joinedTimestamp
				}`
			);
			return;
		}

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
		if (!joinMessageFormat) {
			console.log(`Guild ${member.guild.id} has no join message`);
			return;
		}

		const msg = await this.fillTemplate(
			joinMessageFormat,
			member,
			inviteCode,
			channelId,
			channelName,
			inviterId,
			inviterName,
			inviter,
			invites
		);

		joinChannel.send(msg);
	}

	@on('guildMemberRemove')
	private async _onGuildMemberRemove(member: GuildMember): Promise<void> {
		let join = await this.findJoin(
			member.id,
			member.guild.id,
			member.joinedTimestamp,
			2000
		);
		if (!join) {
			join = await this.findJoin(
				member.id,
				member.guild.id,
				member.joinedTimestamp,
				5000
			);
		}

		if (!join) {
			console.log(
				`Could not find join for ${member.id} in ${member.guild.id} at ${
					member.joinedTimestamp
				}`
			);
			return;
		}

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
			channelId,
			channelName,
			inviterId,
			inviterName
		);

		leaveChannel.send(msg);
	}

	public async fillTemplate(
		template: string,
		member: GuildMember,
		inviteCode: string,
		channelId: string,
		channelName: string,
		inviterId: string,
		inviterName: string,
		inviter?: GuildMember,
		invites?: InviteCounts
	) {
		const userSince = moment(member.user.createdAt);

		const joinedAt = moment(member.joinedAt);

		if (
			typeof inviter === 'undefined' &&
			template.indexOf('{inviterName}') > 0
		) {
			inviter = await member.guild.fetchMember(inviterId).catch(() => null);
		}

		if (
			typeof invites === 'undefined' &&
			template.indexOf('{numInvites}') > 0
		) {
			invites = await getInviteCounts(member.guild.id, inviterId);
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') > 0) {
			numJoins = Math.max(
				await joins.count({
					where: {
						guildId: member.guild.id,
						memberId: member.id
					}
				}),
				1
			);
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin}') > 0) {
			firstJoin = moment(
				(await joins.find({
					where: {
						guildId: member.guild.id,
						memberId: member.id
					},
					order: [['createdAt', 'DESC']],
					limit: 1
				})).createdAt
			);
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin}') > 0) {
			const temp = await joins.find({
				where: {
					guildId: member.guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'DESC']],
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
		msg = this.fillDatePlaceholder(msg, 'joinedAt', joinedAt);

		return msg
			.replace('{inviteCode}', inviteCode)
			.replace('{memberName}', member.displayName)
			.replace('{memberMention}', `<@${member.id}>`)
			.replace('{numJoins}', `${numJoins}`)
			.replace('{inviterName}', inviter ? inviter.displayName : inviterName)
			.replace('{inviterMention}', `<@${inviterId}>`)
			.replace('{numInvites}', `${invites.total}`)
			.replace('{numRegularInvites}', `${invites.code}`)
			.replace('{numBonusInvites}', `${invites.custom}`)
			.replace('{numInvites}', `${invites.total}`)
			.replace('{memberCount}', `${member.guild.memberCount}`)
			.replace('{channelMention}', `<#${channelId}>`)
			.replace('{channelName}', `${channelName}`);
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

	private async findJoin(
		memberId: string,
		guildId: string,
		createdAt: number,
		timeOut: number
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const func = async () => {
				resolve(
					await joins.find({
						attributes: [],
						where: {
							memberId,
							guildId,
							createdAt
						},
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
