import { Client, ListenerUtil, Guild } from 'yamdbf';
import * as path from 'path';
import { commandUsage } from 'yamdbf-command-usage';

import { MessageQueue } from './utils/MessageQueue';
import { sequelize } from './sequelize';

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
			}, {
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
		this.activityInterval = setInterval(() => {
			this.setActivity();
		}, 30000);
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
