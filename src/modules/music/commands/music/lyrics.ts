import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BooleanResolver } from '../../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../../types';
import { MusicConnection } from '../../models/MusicConnection';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.lyrics,
			aliases: [],
			args: [],
			flags: [
				{
					name: 'live',
					short: 'l',
					resolver: BooleanResolver
				}
			],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: [],
		{ live }: { live: boolean },
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isConnected() || !conn.isPlaying()) {
			this.sendReply(message, 'I am currently not playing any music');
			return;
		}

		const item = conn.getNowPlaying();

		const lyrics = await this.client.music.getLyrics(item);

		if (!live) {
			this.sendReply(
				message,
				lyrics.map(l => `${l.start}: ${l.text}`).join('\n')
			);
			return;
		}

		const index = lyrics.findIndex(l => l.start >= conn.getPlayTime());
		const msg = await this.sendReply(message, 'Loading...');

		this.scheduleNext(msg, conn, lyrics, index);
	}

	private scheduleNext(
		msg: Message,
		conn: MusicConnection,
		lyrics: { start: number; dur: number; text: string }[],
		index: number
	) {
		const now = lyrics[index];
		let text = '**' + now.text + '**\n\n';

		const last = lyrics[index - 1];
		if (last) {
			text = last.text + '\n\n' + text;
		}

		index++;
		const next = lyrics[index];
		if (next) {
			text += next.text;
			setTimeout(
				() => this.scheduleNext(msg, conn, lyrics, index),
				Math.max(0, (next.start - conn.getPlayTime()) * 1000 - 200)
			);
		} else {
			setTimeout(() => msg.delete(), now.dur * 1000 + 500);
		}

		msg.edit({
			embed: this.createEmbed({ description: text })
		});
	}
}
