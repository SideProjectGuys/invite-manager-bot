import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.queue,
			aliases: [],
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
		const nowPlaying = conn.getNowPlaying();
		const queue = conn.getQueue();

		this.sendReply(message, {
			author: {
				name: `${nowPlaying.user.username}#${nowPlaying.user.discriminator}`,
				icon_url: nowPlaying.user.avatarURL
			},
			description: `x/${nowPlaying.duration} played`,
			thumbnail: { url: nowPlaying.imageURL },
			color: 255, // blue
			title: nowPlaying.title,
			fields: queue.map(item => ({
				name: `${item.title} by ${item.user.username}`,
				value: `${item.duration}`
			}))
		});
	}
}
