import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'volume',
			aliases: [],
			args: [
				{
					name: 'volume',
					resolver: new NumberResolver(client, 0, 1000)
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [volume]: [number], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		if (volume) {
			conn.setVolume(volume);
			await this.sendReply(message, `Changed volume to ${volume}`);
		} else {
			await this.sendReply(message, `Volume is set to ${conn.getVolume()}`);
		}
	}
}
