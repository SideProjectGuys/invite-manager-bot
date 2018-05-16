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
	customInvites,
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

		const msg = joinMessageFormat
			.replace('{memberName}', member.displayName)
			.replace('{memberMention}', `<@${member.id}>`)
			.replace('{inviterName}', inviter ? inviter.displayName : inviterName)
			.replace('{inviterMention}', `<@${inviterId}>`)
			.replace('{numInvites}', invites.total.toString())
			.replace('{memberCount}', member.guild.memberCount.toString());

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

		const inviter = await member.guild.fetchMember(inviterId).catch(() => null);

		const leaveMessageFormat = (await sets.get(
			SettingsKey.leaveMessage
		)) as string;
		if (!leaveMessageFormat) {
			console.log(`Guild ${member.guild.id} has no leave message`);
			return;
		}

		// This is an optimization to only fetch the number if invites if the variable is used in the message
		let invites = { code: 0, custom: 0, auto: 0, total: 0 };
		if (leaveMessageFormat.indexOf('{numInvites}') > 0) {
			invites = await getInviteCounts(member.guild.id, inviterId);
		}

		const msg = leaveMessageFormat
			.replace('{memberName}', member.displayName)
			.replace('{inviterName}', inviter ? inviter.displayName : inviterName)
			.replace('{inviterMention}', `<@${inviterId}>`)
			.replace('{numInvites}', invites.total.toString())
			.replace('{memberCount}', member.guild.memberCount.toString());

		leaveChannel.send(msg);
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
								attributes: ['inviterId'],
								model: inviteCodes,
								as: 'exactMatch',
								include: [
									{
										attributes: ['name'],
										model: members,
										as: 'inviter'
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

	private setActivity() {
		const guildCount =
			this.shard && this.shard.count > 1
				? this.guilds.size * this.shard.count
				: this.guilds.size;

		let user: any = this.user;
		user.setPresence({
			game: { name: `invitemanager.co - ${guildCount} servers!`, type: 0 }
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
