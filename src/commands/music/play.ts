import axios from 'axios';
import { Message, VoiceChannel } from 'eris';

import { IMClient } from '../../client';
import { StringResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

const ytdl = require('ytdl-core');
const soundCloud = require('soundcloud-audio');
const iheart = require('iheart');

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

			const conn = await voiceChannel.join({});
			conn.play(stream);

			const embed = this.createEmbed({
				author: {
					name: message.author.id,
					icon_url: message.author.avatarURL
				},
				image: { url: info.thumbnail_url },
				title: info.player_response.videoDetails.title,
				fields: [
					{ name: 'Duration', value: `${info.length_seconds} seconds` },
					{ name: 'Channel', value: info.author.name }
				]
			});
			this.sendEmbed(message.channel, embed);

			const time = Number(info.length_seconds) * 1000;
			setTimeout(() => voiceChannel.leave(), time);
		} else if (link.startsWith('https://soundcloud.com')) {
			const player = new soundCloud();
			player.resolve(link, function(track: any) {
				console.log(track);

				// once track is loaded it can be played
				player.play();
			});
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

			const embed = this.createEmbed({
				author: {
					name: message.author.id,
					icon_url: message.author.avatarURL
				},
				image: { url: data.thumbnails.default },
				title: data.title,
				fields: [
					{ name: 'First', value: data.media[0].title },
					{ name: 'Second', value: data.media[1].title }
				]
			});
			this.sendEmbed(message.channel, embed);

			const conn = await voiceChannel.join({});
			conn.play(data.urls.audio);

			const time = Number(data.duration) * 1000;
			setTimeout(() => voiceChannel.leave(), time);
		} else if (link.startsWith('iheart')) {
			const search = link.substr(6).trim();

			const matches = await iheart.search(search);
			console.log(matches.stations);

			const station = matches.stations[0];
			console.log(station);

			const url = await iheart.streamURL(station);
			console.log(url);

			const embed = this.createEmbed({
				author: {
					name: message.author.id,
					icon_url: message.author.avatarURL
				},
				image: { url: station.newlogo },
				title: station.name,
				fields: [
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
			});
			this.sendEmbed(message.channel, embed);

			const conn = await voiceChannel.join({});
			conn.play(url);
		} else {
			this.sendReply(
				message,
				'Currently only YouTube, SoundCloud and Rave DJ links are supported'
			);
		}
	}
}
