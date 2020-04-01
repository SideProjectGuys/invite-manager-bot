import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandGroup, MusicCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.queue,
			aliases: [],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t, guild }: Context): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		const nowPlaying = conn.getNowPlaying();
		const queue = conn.getQueue();

		if (!nowPlaying) {
			await this.sendReply(message, t('cmd.queue.empty'));
			return;
		}

		await this.sendReply(message, {
			author: {
				name: `${nowPlaying.author.username}#${nowPlaying.author.discriminator}`,
				icon_url: nowPlaying.author.avatarURL
			},
			description: nowPlaying.toQueueEntry().value,
			thumbnail: { url: nowPlaying.imageUrl },
			title: nowPlaying.title,
			fields: queue.map((item) => item.toQueueEntry())
		});
	}
}
