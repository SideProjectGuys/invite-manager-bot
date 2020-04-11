import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BooleanResolver } from '../../../framework/resolvers';
import { MusicConnection } from '../../models/MusicConnection';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'lyrics',
			aliases: [],
			args: [],
			flags: [
				{
					name: 'live',
					short: 'l',
					resolver: BooleanResolver
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(
		message: Message,
		args: [],
		{ live }: { live: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		const musicPlatform = conn.getNowPlaying().getPlatform();

		if (!musicPlatform.supportsLyrics) {
			await this.sendReply(
				message,
				t('cmd.lyrics.notSupported', {
					platform: musicPlatform.getType()
				})
			);
			return;
		}

		const item = conn.getNowPlaying();

		const lyrics = await this.music.getLyrics(item);
		if (lyrics.length === 0) {
			await this.sendReply(message, t('cmd.lyrics.notFound'));
			return;
		}

		if (!live) {
			await this.sendReply(message, lyrics.map((l) => `${this.music.formatTime(l.start)}: ${l.text}`).join('\n'));
			return;
		}

		const index = Math.max(0, lyrics.findIndex((l) => l.start >= conn.getPlayTime()) - 1);
		const msg = await this.sendReply(message, 'Loading...');

		await this.scheduleNext(msg, conn, lyrics, index);
	}

	private async scheduleNext(
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
				Math.max(0, (next.start - conn.getPlayTime()) * 1000)
			);
		} else {
			setTimeout(() => msg.delete(), now.dur * 1000 + 500);
		}

		await msg.edit({
			embed: this.createEmbed({ description: text })
		});
	}
}
