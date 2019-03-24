import axios from 'axios';
import { Message, VoiceChannel } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { BotCommand, CommandGroup, NowPlayingInfo } from '../../types';
import { Command, Context } from '../Command';

const ytdl = require('ytdl-core');
const iheart = require('iheart');

const SOUNDCLOUD_CLIENT_ID = '';

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
			aliases: ['p'],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[link]: [string],
		flags: {},
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

		if (link.startsWith('https://www.youtube.com')) {
			const info = await ytdl.getInfo(link);
			if (!info) {
				this.sendReply(
					message,
					'That does not seem to be a valid YouTube link'
				);
				return;
			}

			console.log(info);

			const stream = ytdl(link, { filter: 'audioonly' });

			const playingInfo: NowPlayingInfo = {
				title: info.player_response.videoDetails.title,
				imageURL: info.thumbnail_url,
				source: message.author,
				extras: [
					{ name: 'Duration', value: `${info.length_seconds} seconds` },
					{ name: 'Channel', value: info.author.name }
				]
			};

			const conn = await this.client.music.connect(voiceChannel);
			conn.play(playingInfo, stream);
			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(playingInfo)
			);

			const time = Number(info.length_seconds) * 1000;
			setTimeout(() => conn.disconnect(), time);
		} else if (link.startsWith('https://soundcloud.com')) {
			const res = await axios.get(
				`http://api.soundcloud.com/resolve?url=${link}&client_id=${SOUNDCLOUD_CLIENT_ID}`
			);
			const data = res.data;

			if (data.kind !== 'track') {
				this.sendReply(
					message,
					'You must specify a valid SoundCloud track to play'
				);
				return;
			}

			// Resolve redirect
			const response = await axios.get(
				`${data.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`
			);
			const url = response.request.res.responseUrl;

			const playingInfo: NowPlayingInfo = {
				title: data.title,
				imageURL: data.artwork_url,
				source: message.author,
				extras: [
					{ name: 'Duration', value: `${data.duration / 1000} seconds` },
					{ name: 'Artist', value: data.user.username }
				]
			};

			const conn = await this.client.music.connect(voiceChannel);
			conn.play(playingInfo, url);
			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(playingInfo)
			);

			const time = data.duration;
			setTimeout(() => conn.disconnect(), time);
		} else if (link.startsWith('https://rave.dj')) {
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

			console.log(data);

			const playingInfo: NowPlayingInfo = {
				title: data.title,
				imageURL: data.thumbnails.default,
				source: message.author,
				extras: [
					{ name: 'First', value: data.media[0].title },
					{ name: 'Second', value: data.media[1].title }
				]
			};

			const conn = await this.client.music.connect(voiceChannel);
			conn.play(playingInfo, data.urls.audio);
			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(playingInfo)
			);

			const time = Number(data.duration) * 1000;
			setTimeout(() => conn.disconnect(), time);
		} else if (link.startsWith('iheart')) {
			const search = link.substr(6).trim();

			const matches = await iheart.search(search);
			console.log(matches.stations);

			const station = matches.stations[0];
			console.log(station);

			const url = await iheart.streamURL(station);
			console.log(url);

			const playingInfo: NowPlayingInfo = {
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

			const conn = await this.client.music.connect(voiceChannel);
			conn.play(playingInfo, url);
			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(playingInfo)
			);
		} else {
			this.sendReply(
				message,
				'Currently only YouTube, SoundCloud, Rave.DJ and iHeartRADIO are supported'
			);
		}
	}
}
