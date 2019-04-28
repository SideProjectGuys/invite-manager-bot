import { Guild, Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BooleanResolver } from '../../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../../types';

const PIN_UPDATE_INTERVAL = 5000;

export default class extends Command {
	private timerMap: Map<string, NodeJS.Timer> = new Map();

	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.nowPlaying,
			aliases: ['np', 'now-playing'],
			flags: [
				{
					name: 'pin',
					short: 'p',
					resolver: BooleanResolver
				}
			],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ pin }: { pin: boolean },
		{ guild }: Context
	): Promise<any> {
		let embed = await this.createPlayingEmbed(guild);
		const msg = await this.sendEmbed(message.channel, embed);

		if (pin) {
			const timer = this.timerMap.get(guild.id);
			if (timer) {
				clearInterval(timer);
			}

			const func = async () => {
				embed = await this.createPlayingEmbed(guild);
				await msg.edit({ embed });
			};

			this.timerMap.set(guild.id, setInterval(func, PIN_UPDATE_INTERVAL));
		}
	}

	private async createPlayingEmbed(guild: Guild) {
		const conn = await this.client.music.getMusicConnection(guild);

		const item = conn.getNowPlaying();
		if (!item) {
			return this.client.music.createPlayingEmbed(item);
		}

		const time = conn.getPlayTime();
		const progress = Math.max(
			0,
			Math.min(30, Math.round(30 * (time / item.duration)))
		);

		const embed = this.client.music.createPlayingEmbed(item);
		embed.fields.push({
			name: 'Play time',
			value:
				'```\n[' +
				'='.repeat(progress) +
				' '.repeat(30 - progress) +
				'] ' +
				this.client.music.formatTime(time) +
				' / ' +
				this.client.music.formatTime(item.duration) +
				'\n```'
		});

		return embed;
	}
}
