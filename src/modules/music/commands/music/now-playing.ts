import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BooleanResolver } from '../../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../../types';

export default class extends Command {
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
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);

		const item = conn.getNowPlaying();
		if (!item) {
			const msg = await this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(item)
			);
			if (pin) {
				conn.setNowPlayingMessage(msg);
			}
			return;
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

		const msg2 = await this.sendEmbed(message.channel, embed);

		if (pin) {
			conn.setNowPlayingMessage(msg2);
		}
	}
}
