import { GuildMember, TextChannel } from 'discord.js';
import * as path from 'path';
import { Client, Guild, ListenerUtil } from 'yamdbf';
import { commandUsage } from 'yamdbf-command-usage';

import { customInvites, inviteCodes, joins, members, sequelize, settings } from './sequelize';
import { MessageQueue } from './utils/MessageQueue';
import { getInviteCounts, promoteIfQualified } from './utils/util';

const { on, once } = ListenerUtil;
const config = require('../config.json');

export class IMClient extends Client {
	public config: any;
	public messageQueue: MessageQueue;
	public activityInterval: NodeJS.Timer;

	public constructor() {
		super(
			{
				commandsDir: path.join(__dirname, 'commands'),
				token: config.discordToken,
				owner: config.owner,
				pause: true,
				ratelimit: '2/5s',
				disableBase: ['setlang', 'blacklist', 'eval', 'eval:ts', 'limit', 'reload', 'ping', 'help'],
				plugins: [commandUsage(config.commandLogChannel)],
			},
			{
				disabledEvents: [
					'TYPING_START',
					'USER_UPDATE',
					'PRESENCE_UPDATE',
				]
			}
		);

		this.config = config;
	}

	@once('pause')
	private async _onPause() {
		console.log('Hello');
		await this.setDefaultSetting('prefix', '!');
		this.continue();
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		this.messageQueue = new MessageQueue(this);
		this.messageQueue.addMessage('clientReady executed');
		console.log(`Client ready! Serving ${this.guilds.size} guilds.`);

		this.setActivity();
		this.activityInterval = setInterval(
			() => this.setActivity(),
			30000
		);
	}

	@on('guildMemberAdd')
	private async _onGuildMemberAdd(member: GuildMember): Promise<void> {
		let join = await this.findJoin(member.id, member.guild.id, member.joinedTimestamp, 2000);
		if (!join) {
			join = await this.findJoin(member.id, member.guild.id, member.joinedTimestamp, 5000);
		}

		if (!join) {
			console.log(`Could not find join for ${member.id} in ${member.guild.id} at ${member.joinedTimestamp}`);
			return;
		}

		const joinChannelSetting = await settings.find({
			where: {
				guildId: member.guild.id,
				key: 'joinMessageChannel'
			}
		});

		if (!joinChannelSetting) {
			console.log(`Guild ${member.guild.id} has no join message channel`);
			return;
		}

		const inviter = join.exactMatch.inviter;

		const invites = await getInviteCounts(inviter.guild.id, inviter.id);
		const totalInvites = invites.code + invites.custom;

		const origInviter = await member.guild.fetchMember(inviter.id);
		if (!origInviter.user.bot) {
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(inviter.guild, inviter, totalInvites);
		}

		const inviteChannel = member.guild.channels.get(joinChannelSetting.value) as TextChannel;
		inviteChannel.send(`<@${member.user.id}> was invited by ${inviter.name} (${totalInvites} invites)`);
	}

	private async findJoin(memberId: string, guildId: string, createdAt: number, timeOut: number): Promise<any> {
		return new Promise((resolve, reject) => {
			setTimeout(
				async () => {
					resolve(await joins.find({
						where: {
							memberId,
							guildId,
							createdAt,
						},
						include: [{
							model: inviteCodes,
							as: 'exactMatch',
							include: [{ model: members, as: 'inviter' }]
						}]
					}));
				},
				timeOut
			);
		});
	}

	private setActivity() {
		let user: any = this.user;
		user.setPresence({ game: { name: `invitemanager.co - ${this.guilds.size} servers!`, type: 0 } });
	}

	@on('reconnecting')
	private async _onReconnecting() {
		console.log('DISCORD RECONNECTING:');
		try {
			this.messageQueue.addMessage(`EVENT(reconnecting)`);
		} catch (e) {
			console.log('DISCORD RECONNECTING:', e);
		}
	}

	@on('disconnect')
	private async _onDisconnect() {
		console.log('DISCORD DISCONNECT:');
		try {
			this.messageQueue.addMessage(`EVENT(disconnect)`);
		} catch (e) {
			console.log('DISCORD DISCONNECT:', e);
		}
	}

	@on('resume')
	private async _onResume(replayed: number) {
		console.log('DISCORD RESUME:', replayed);
		try {
			this.messageQueue.addMessage(`EVENT(resume):${replayed}`);
		} catch (e) {
			console.log('DISCORD RESUME:', e);
		}
	}

	@on('guildUnavailable')
	private async _onGuildUnavailable(guild: Guild) {
		console.log('DISCORD GUILD_UNAVAILABLE:', guild.id);
		try {
			this.messageQueue.addMessage(`EVENT(guildUnavailable):${guild.id} ${guild.name} ${guild.memberCount}`);
		} catch (e) {
			console.log('DISCORD GUILD_UNAVAILABLE:', e);
		}
	}

	@on('warn')
	private async _onWarn(info: string) {
		console.log('DISCORD WARNING:', info);
		try {
			this.messageQueue.addMessage(`EVENT(warn):${JSON.stringify(info)}`);
		} catch (e) {
			console.log('DISCORD WARNING:', e);
		}
	}

	@on('error')
	private async _onError(error: Error) {
		console.log('DISCORD ERROR:', error);
		try {
			this.messageQueue.addMessage(`EVENT(error):${JSON.stringify(error)}`);
		} catch (e) {
			console.log('DISCORD ERROR:', e);
		}
	}
}
