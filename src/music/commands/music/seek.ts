import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver } from '../../../framework/resolvers';
import { MusicPlatform } from '../../models/MusicPlatform';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'seek',
			aliases: [],
			args: [
				{
					name: 'duration',
					resolver: NumberResolver,
					rest: false
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [duration]: [number], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		const musicPlatform: MusicPlatform = conn.getNowPlaying().getPlatform();

		if (!musicPlatform.supportsSeek) {
			await this.sendReply(
				message,
				t('cmd.seek.notSupported', {
					platform: musicPlatform.getType()
				})
			);
			return;
		}

		await conn.seek(duration);
	}
}
