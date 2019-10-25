import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { StringResolver } from '../../../framework/resolvers';
import { CommandGroup, MusicCommand, MusicPlatformType } from '../../../types';
import { RaveDJ } from '../../models/ravedj/RaveDJ';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.mashup,
			aliases: [],
			args: [
				{
					name: 'videos',
					resolver: StringResolver,
					required: true,
					rest: true
				}
			],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [videos]: [string], flags: {}, { t, guild }: Context): Promise<any> {
		// TODO
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			await this.sendReply(message, t('music.voiceChannelRequired'));
			return;
		}

		const [link1, link2] = videos.split(' ');
		if (!link2) {
			await this.sendReply(message, t('cmd.mashup.missingSecondVideo'));
			return;
		}
		const platform1 = this.client.music.platforms.getForLink(link1);
		const platform2 = this.client.music.platforms.getForLink(link2);

		const musicPlatform = this.client.music.platforms.get(MusicPlatformType.RaveDJ) as RaveDJ;

		let mashupId;

		if (
			platform1 &&
			platform1.getType() === MusicPlatformType.YouTube &&
			platform2 &&
			platform2.getType() === MusicPlatformType.YouTube
		) {
			const video1 = await platform1.getByLink(link1);
			const video2 = await platform2.getByLink(link2);
			mashupId = await musicPlatform.mix(video1.id, video2.id);
		} else {
			const [search1, search2] = videos.split(',');

			const youtubePlatform = this.client.music.platforms.get(MusicPlatformType.YouTube);
			const [result1] = await youtubePlatform.search(search1, 1);
			const [result2] = await youtubePlatform.search(search2, 1);

			mashupId = await musicPlatform.mix(result1.id, result2.id);
		}

		await this.sendReply(message, `RaveDJ Link: https://rave.dj/${mashupId}`);
	}
}
