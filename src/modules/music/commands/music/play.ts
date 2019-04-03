import { Message, VoiceChannel } from 'eris';
import ytdl from 'ytdl-core';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	BooleanResolver,
	EnumResolver,
	StringResolver
} from '../../../../framework/resolvers';
import {
	CommandGroup,
	MusicCommand,
	MusicPlatform,
	MusicQueueItem
} from '../../../../types';
import { Platform } from '../../models/platforms/PlatformInterface';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.play,
			aliases: ['p'],
			args: [
				{
					name: 'link',
					resolver: StringResolver,
					rest: true
				}
			],
			flags: [
				{
					name: 'platform',
					short: 'p',
					resolver: new EnumResolver(client, Object.values(MusicPlatform))
				},
				{
					name: 'next',
					short: 'n',
					resolver: BooleanResolver
				}
			],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[link]: [string],
		{ platform, next }: { platform: MusicPlatform; next: boolean },
		{ t, guild }: Context
	): Promise<any> {
		// TODO
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			this.sendReply(
				message,
				'Please join a voice channel before using this command'
			);
			return;
		}

		let musicPlatform: Platform;
		if (platform) {
			musicPlatform = this.client.music.musicPlatformService.getPlatform(
				platform
			);
		} else {
			musicPlatform = this.client.music.musicPlatformService.getPlatformForLink(
				link
			);
		}

		let item: MusicQueueItem;
		if (musicPlatform) {
			item = await musicPlatform.getVideoInfoForUrl(message, link);
		} else {
			musicPlatform = this.client.music.musicPlatformService.getPlatform(
				MusicPlatform.YouTube
			);
			const { items } = await musicPlatform.search(link, 1);
			if (items.length > 0) {
				const videoInfo2 = items[0];
				const dur = this.client.music.parseYoutubeDuration(
					videoInfo2.contentDetails.duration
				);

				const ytLink = `https://youtube.com/watch?v=${videoInfo2.id}`;

				item = {
					id: videoInfo2.id,
					title: videoInfo2.snippet.title,
					imageURL: videoInfo2.snippet.thumbnails.default.url,
					user: message.author,
					link: ytLink,
					platform: MusicPlatform.YouTube,
					getStream: async () =>
						ytdl(ytLink, {
							filter: 'audioonly'
						}),
					duration: dur,
					extras: [
						{
							name: 'Duration',
							value: this.client.music.formatTime(dur)
						},
						{ name: 'Channel', value: videoInfo2.snippet.channelTitle }
					]
				};
			}
		}

		if (item) {
			const conn = await this.client.music.getMusicConnection(guild);

			const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

			conn.play(item, voiceChannel, next);

			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(item)
			);
		}
	}
}
