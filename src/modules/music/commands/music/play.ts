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

		const musicPlatform = this.client.music.musicPlatformService.getPlatformForLink(
			link
		);

		// Try and guess the music platform according to the argument
		if (!platform) {
			if (musicPlatform) {
				platform = musicPlatform.getPlatform();
			}
		}
		/*
		if (!platform) {
			this.sendReply(
				message,
				'Currently only YouTube, SoundCloud, Rave.DJ and iHeartRADIO are supported'
			);
			return;
		}
*/
		let item: MusicQueueItem;

		try {
			item = await musicPlatform.getVideoInfoForUrl(this.client, message, link);
		} catch (error) {
			this.sendReply(message, 'That does not seem to be a valid YouTube link');
			return;
		}

		switch (platform) {
			case MusicPlatform.YouTube:
				break;

			case MusicPlatform.SoundCloud:
				break;

			case MusicPlatform.RaveDJ:
				break;

			case MusicPlatform.iHeartRADIO:
				break;

			default:
				const { items } = await this.client.music.searchYoutube(link, 1);
				if (items.length > 0) {
					const videoInfo2 = items[0];
					const dur = this.client.music.parseYoutubeDuration(
						videoInfo2.contentDetails.duration
					);

					const ytLink = `https://youtube.com/watch?v=${videoInfo2.id}`;

					item = {
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

				break;
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
