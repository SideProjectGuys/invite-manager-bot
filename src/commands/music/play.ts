import axios from 'axios';
import { Message, VoiceChannel } from 'eris';
import { Readable } from 'stream';

import { IMClient } from '../../client';
import { EnumResolver, StringResolver } from '../../resolvers';
import { BotCommand, CommandGroup, NowPlayingInfo } from '../../types';
import { Command, Context } from '../Command';

const ytdl = require('ytdl-core');
const iheart = require('iheart');

const SOUNDCLOUD_CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF';

enum MusicPlatform {
	YouTube = 'youtube',
	SoundCloud = 'soundcloud',
	RaveDJ = 'ravedj',
	iHeartRADIO = 'iheartradio'
}

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

		const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

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

		let stream: string | Readable;
		let info: NowPlayingInfo;
		let duration: number;

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

				stream = ytdl(link, { filter: 'audioonly' });
				duration = Number(videoInfo.length_seconds);
				info = {
					title: videoInfo.player_response.videoDetails.title,
					imageURL: videoInfo.thumbnail_url,
					source: message.author,
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

				stream = redir.request.res.responseUrl;
				duration = scData.duration;
				info = {
					title: scData.title,
					imageURL: scData.artwork_url,
					source: message.author,
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

				stream = data.urls.audio;
				duration = Number(data.duration);
				info = {
					title: data.title,
					imageURL: data.thumbnails.default,
					source: message.author,
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

				stream = await iheart.streamURL(station);
				duration = null;
				info = {
					title: station.name,
					imageURL: station.newlogo,
					source: message.author,
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

		if (stream) {
			const conn = await this.client.music.connect(voiceChannel);
			conn.play(info, stream);
			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(info)
			);

			if (duration) {
				const time = duration * 1000;
				setTimeout(() => conn.disconnect(), time);
			}
		}
	}
}
