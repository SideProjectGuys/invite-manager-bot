import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { NumberResolver } from '../../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../../types';
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
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[duration]: [number],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			this.sendReply(message, 'I am currently not playing any music');
			return;
		}

		const musicPlatform: MusicPlatform = this.client.music.musicPlatformService.getPlatform(
			conn.getNowPlaying().platform
		);

		if (!musicPlatform.supportsSeek) {
			this.sendReply(
				message,
				`Seeking is not supported on platform ${musicPlatform.getPlatform()}`
			);
			return;
		}

		conn.seek(duration);
	}
}
