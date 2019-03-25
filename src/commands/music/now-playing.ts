import { Message } from 'eris';

import { IMClient } from '../../client';
import { BooleanResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.nowPlaying,
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

		const msg = await this.sendEmbed(
			message.channel,
			this.client.music.createPlayingEmbed(conn.getNowPlaying())
		);

		if (pin) {
			conn.setNowPlayingMessage(msg);
		}
	}
}
