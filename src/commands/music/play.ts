import axios from 'axios';
import { Message, VoiceChannel } from 'eris';

import { IMClient } from '../../client';
import { EnumResolver, StringResolver } from '../../resolvers';
import {
	BotCommand,
	CommandGroup,
	MusicPlatform,
	MusicQueueItem
} from '../../types';
import { Command, Context } from '../Command';

const ytdl = require('ytdl-core');
const iheart = require('iheart');

const SOUNDCLOUD_CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.play,
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
				}
			],
			aliases: ['p'],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[link]: [string],
		{ platform }: { platform: MusicPlatform },
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

		// Try and guess the music platform according to the argument
		if (!platform) {
			if (link.startsWith('https://www.youtube.com')) {
				platform = MusicPlatform.YouTube;
			} else if (link.startsWith('https://soundcloud.com')) {
				platform = MusicPlatform.SoundCloud;
			} else if (link.startsWith('https://rave.dj')) {
				platform = MusicPlatform.RaveDJ;
			} else if (link.startsWith('iheart')) {
				platform = MusicPlatform.iHeartRADIO;
			}
		}

		if (!platform) {
			this.sendReply(
				message,
				'Currently only YouTube, SoundCloud, Rave.DJ and iHeartRADIO are supported'
			);
			return;
		}

		let item: MusicQueueItem;

		switch (platform) {
			case MusicPlatform.YouTube:
				const videoInfo = await ytdl.getInfo(link);
				if (!videoInfo) {
					this.sendReply(
						message,
						'That does not seem to be a valid YouTube link'
					);
					return;
				}

				console.log(videoInfo);

				item = {
					title: videoInfo.player_response.videoDetails.title,
					imageURL: videoInfo.thumbnail_url,
					user: message.author,
					platform,
					stream: ytdl(link, { filter: 'audioonly' }),
					duration: Number(videoInfo.length_seconds),
					extras: [
						{ name: 'Duration', value: `${videoInfo.length_seconds} seconds` },
						{ name: 'Channel', value: videoInfo.author.name }
					]
				};
				break;

			case MusicPlatform.SoundCloud:
				const scLink = `http://api.soundcloud.com/resolve?url=${link}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
				const scData = (await axios.get(scLink)).data;

				if (scData.kind !== 'track') {
					this.sendReply(
						message,
						'You must specify a valid SoundCloud track to play'
					);
					return;
				}

				// Resolve redirect
				const redir = await axios.get(
					`${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`
				);

				item = {
					title: scData.title,
					imageURL: scData.artwork_url,
					user: message.author,
					platform,
					stream: redir.request.res.responseUrl,
					duration: scData.duration,
					extras: [
						{ name: 'Duration', value: `${scData.duration / 1000} seconds` },
						{ name: 'Artist', value: scData.user.username }
					]
				};
				break;

			case MusicPlatform.RaveDJ:
				const id = link.substr(link.indexOf('.dj/') + 4);

				const res = await axios({
					method: 'GET',
					url: `https://api.red.wemesh.ca/ravedj/${id}`,
					headers: {
						authorization: 'bearer ???',
						'client-version': '5.0',
						'wemesh-api-version': '5.0',
						'wemesh-platform': 'Android'
					}
				});

				const data = res.data.data;

				item = {
					title: data.title,
					imageURL: data.thumbnails.default,
					user: message.author,
					platform,
					duration: Number(data.duration),
					stream: data.urls.audio,
					extras: [
						{ name: 'First', value: data.media[0].title },
						{ name: 'Second', value: data.media[1].title }
					]
				};
				break;

			case MusicPlatform.iHeartRADIO:
				const search = link.substr(6).trim();

				const matches = await iheart.search(search);
				const station = matches.stations[0];

				item = {
					title: station.name,
					imageURL: station.newlogo,
					user: message.author,
					platform,
					duration: null,
					stream: await iheart.streamURL(station),
					extras: [
						{
							name: 'Air',
							value: station.frequency + ' ' + station.band,
							inline: true
						},
						{
							name: 'Location',
							value: station.city + ', ' + station.state,
							inline: true
						},
						{
							name: 'Description',
							value: station.description,
							inline: false
						}
					]
				};
				break;

			default:
				break;
		}

		if (item) {
			const conn = await this.client.music.getMusicConnection(guild);

			const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

			conn.play(item, voiceChannel);

			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(item)
			);
		}
	}
}
