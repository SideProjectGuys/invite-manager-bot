import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../types';
import { MusicPlatform } from '../../models/MusicPlatform';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.seek,
			aliases: [],
			args: [
				{
					name: 'duration',
					resolver: NumberResolver,
					rest: false
				}
			],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [duration]: [number], flags: {}, { t, guild }: Context): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
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
