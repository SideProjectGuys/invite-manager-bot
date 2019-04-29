import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { CommandGroup, MusicCommand } from '../../../../types';
import { MusicPlatform } from '../../models/MusicPlatform';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.rewind,
			aliases: ['replay'],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			this.sendReply(message, t('music.notPlaying'));
			return;
		}

		const musicPlatform: MusicPlatform = conn.getNowPlaying().getPlatform();

		if (!musicPlatform.supportsRewind) {
			this.sendReply(
				message,
				t('cmd.rewind.notSupported', {
					platform: musicPlatform.getType()
				})
			);
			return;
		}

		conn.rewind();
	}
}
