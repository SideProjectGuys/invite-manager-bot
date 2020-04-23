import { Message } from 'eris';

import { IMClient } from '../../../client';
import { MusicPlatform } from '../../models/MusicPlatform';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'rewind',
			aliases: ['replay'],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		const musicPlatform: MusicPlatform = conn.getNowPlaying().getPlatform();

		if (!musicPlatform.supportsRewind) {
			await this.sendReply(message, t('cmd.rewind.notSupported', { platform: musicPlatform.name }));
			return;
		}

		await conn.rewind();
	}
}
