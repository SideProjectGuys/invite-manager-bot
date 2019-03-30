import AWS from 'aws-sdk';
import axios from 'axios';
import { Guild, Message, VoiceChannel, VoiceConnection } from 'eris';
import { Stream } from 'stream';
import { URLSearchParams } from 'url';

import { MusicCache } from '../cache/MusicCache';
import { IMClient } from '../client';
import { MusicQueue, MusicQueueItem } from '../types';

interface YoutubeVideo {
	id: string;
	videoId?: string;
	contentDetails: YoutubeVideoContentDetails;
	snippet: {
		channelTitle: string;
		description: string;
		thumbnails: {
			default: {
				height: number;
				url: string;
				width: number;
			};
		};
		title: string;
	};
}

interface YoutubeVideoContentDetails {
	duration: string;
}

const VOL_FADE_TIME = 1.5;
const USELESS_WORDS = [/official.*?video/gi, /original.*?video/gi];

class MusicConnection {
	private service: MusicService;
	private guild: Guild;
	private musicQueueCache: MusicQueue;
	private voiceChannel: VoiceChannel;
	private connection: VoiceConnection;
	private nowPlayingMessage: Message;
	private volume: number = 1.0;
	private doPlayNext: boolean = true;
	private speaking: Set<string> = new Set();
	private doneCallback: () => void;

	public constructor(
		service: MusicService,
		guild: Guild,
		musicQueueCache: MusicQueue
	) {
		this.service = service;
		this.guild = guild;
		this.musicQueueCache = musicQueueCache;
	}

	private getSettings() {
		return this.service.client.cache.settings.get(this.guild.id);
	}

	public switchChannel(voiceChannel: VoiceChannel) {
		this.voiceChannel = voiceChannel;
		this.connection.switchChannel(voiceChannel.id);
	}

	public isPlaying(): boolean {
		return this.connection && this.connection.playing;
	}

	public isPaused(): boolean {
		return this.connection && this.connection.paused;
	}

	public isConnected(): boolean {
		return !!this.connection;
	}

	public async play(item: MusicQueueItem, voiceChannel?: VoiceChannel) {
		console.log(item);

		if (voiceChannel) {
			await this.connect(voiceChannel);
		} else if (!this.connection) {
			if (this.voiceChannel) {
				await this.connect(this.voiceChannel);
			} else {
				throw new Error('Not connected and no voice channel specified');
			}
		}

		this.musicQueueCache.queue.push(item);
		if (!this.musicQueueCache.current) {
			this.playNext();
		}

		this.updateNowPlayingMessage();
	}

	public pause() {
		if (this.connection) {
			this.connection.pause();
		}
	}

	public resume() {
		if (this.connection) {
			this.connection.resume();
		}
	}

	public async rewind() {
		if (!this.connection) {
			if (this.voiceChannel) {
				await this.connect(this.voiceChannel);
			} else {
				throw new Error('Not connected to a voice channel');
			}
		}

		this.musicQueueCache.queue.unshift({ ...this.musicQueueCache.current });
		this.playNext();
	}

	public async skip() {
		if (this.connection) {
			this.playNext();
		}
	}

	public setVolume(volume: number) {
		if (this.connection) {
			this.volume = volume;
			this.connection.setVolume(volume);
		}
	}

	public fadeVolume(volume: number) {
		if (this.connection) {
			this.volume = volume;
			this.fadeVolumeTo(volume);
		}
	}

	public getNowPlaying() {
		return this.musicQueueCache.current;
	}

	public getPlayTime() {
		return this.connection ? this.connection.current.playTime / 1000 : null;
	}

	public getQueue() {
		return this.musicQueueCache.queue;
	}

	public setNowPlayingMessage(message: Message) {
		this.nowPlayingMessage = message;
	}

	private startSpeakingTimeout: NodeJS.Timer;
	private stopSpeakingTimeout: NodeJS.Timer;
	public async connect(channel: VoiceChannel) {
		if (this.connection) {
			this.switchChannel(channel);
		} else {
			this.voiceChannel = channel;
			this.connection = await channel.join({ inlineVolume: true });
			this.connection.setVolume(this.volume);
			this.connection.on('error', error => console.error(error));
			this.connection.on('speakingStart', userId => {
				if (this.speaking.size === 0) {
					if (this.stopSpeakingTimeout) {
						clearTimeout(this.stopSpeakingTimeout);
						this.stopSpeakingTimeout = null;
					} else {
						this.cancelFadeVolume();
						this.fadeVolumeTo(0.2 * this.volume, 500);
					}
				}
				this.speaking.add(userId);
			});
			this.connection.on('speakingStop', userId => {
				this.speaking.delete(userId);
				if (this.speaking.size === 0) {
					if (this.startSpeakingTimeout) {
						clearTimeout(this.startSpeakingTimeout);
						this.startSpeakingTimeout = null;
					}
					const func = () => {
						this.stopSpeakingTimeout = null;
						this.fadeVolumeTo(this.volume);
					};
					this.stopSpeakingTimeout = setTimeout(func, 1000);
				}
			});
			this.connection.on('end', () => {
				console.log('STREAM END');
				this.musicQueueCache.current = null;

				if (this.doneCallback) {
					this.doneCallback();
					this.doneCallback = null;
				}

				if (this.doPlayNext) {
					this.playNext();
				}
			});
		}
	}

	public async playAnnouncement(message: string, channel?: VoiceChannel) {
		if (!this.connection || channel) {
			await this.connect(channel);
		} else if (this.connection.playing) {
			this.doPlayNext = false;
			this.connection.stopPlaying();
		}

		const sets = await this.getSettings();

		return new Promise(resolve => {
			this.service.polly.synthesizeSpeech(
				{
					Text: message,
					LanguageCode: 'en-US',
					OutputFormat: 'ogg_vorbis',
					VoiceId: sets.announcementVoice
				},
				(err, data) => {
					if (err) {
						console.error(err);
						this.doneCallback();
						return;
					}

					this.doneCallback = async () => {
						this.doPlayNext = true;
						resolve();
					};

					const bufferStream = new Stream.PassThrough();
					bufferStream.end(data.AudioStream);

					this.connection.play(bufferStream);
				}
			);
		});
	}

	private async playNext() {
		const next = this.musicQueueCache.queue.shift();
		if (next) {
			if (this.connection.playing) {
				this.doPlayNext = false;
				this.connection.stopPlaying();
			}

			let sanitizedTitle = next.title;
			USELESS_WORDS.forEach(
				word => (sanitizedTitle = sanitizedTitle.replace(word, ''))
			);

			await this.playAnnouncement('Playing: ' + sanitizedTitle);

			const stream = await next.getStream();

			this.musicQueueCache.current = next;
			this.connection.play(stream, {
				inlineVolume: true
			});
			this.updateNowPlayingMessage();
		}
	}

	public async seek(time: number) {
		this.doPlayNext = false;

		const current = { ...this.musicQueueCache.current };

		this.doneCallback = async () => {
			const stream = await current.getStream();

			this.musicQueueCache.current = current;
			this.connection.play(stream, {
				inlineVolume: true,
				inputArgs: [`-ss`, `${time}`]
			});

			this.doPlayNext = true;
		};

		this.connection.stopPlaying();
	}

	private fadeTimeouts: NodeJS.Timer[] = [];
	private fadeVolumeTo(
		newVolume: number,
		fadeDuration: number = VOL_FADE_TIME
	) {
		this.cancelFadeVolume();

		const startVol = this.connection.volume;
		const diff = newVolume - startVol;
		const step = diff / (fadeDuration * 10);
		for (let i = 0; i < fadeDuration * 10; i++) {
			const newVol = Math.max(0, Math.min(startVol + i * step, 2));
			this.fadeTimeouts.push(
				setTimeout(() => this.connection.setVolume(newVol), i * 100)
			);
		}
	}

	private cancelFadeVolume() {
		this.fadeTimeouts.forEach(t => clearTimeout(t));
		this.fadeTimeouts = [];
	}

	private updateNowPlayingMessage() {
		if (this.nowPlayingMessage) {
			this.nowPlayingMessage.edit({
				embed: this.service.createPlayingEmbed(null)
			});
		}
	}

	public disconnect() {
		if (this.connection) {
			this.connection.stopPlaying();
			this.voiceChannel.leave();
			this.connection = null;
		}
	}
}

export class MusicService {
	public client: IMClient;
	public cache: MusicCache;
	public polly: AWS.Polly;

	private musicConnections: Map<string, MusicConnection>;

	public constructor(client: IMClient) {
		this.client = client;
		this.cache = client.cache.music;
		this.musicConnections = new Map();
		this.polly = new AWS.Polly({
			signatureVersion: 'v4',
			region: 'us-east-1',
			credentials: client.config.bot.aws
		});
	}

	public async getMusicConnection(guild: Guild) {
		let conn = this.musicConnections.get(guild.id);
		if (!conn) {
			conn = new MusicConnection(this, guild, await this.cache.get(guild.id));
			const sets = await this.client.cache.settings.get(guild.id);
			conn.setVolume(sets.musicVolume);

			this.musicConnections.set(guild.id, conn);
		}
		return conn;
	}

	public createPlayingEmbed(item: MusicQueueItem) {
		if (!item) {
			return this.client.msg.createEmbed({
				author: { name: 'InvMan Music', icon_url: this.client.user.avatarURL },
				color: 255, // blue
				title: 'Not playing',
				fields: []
			});
		}

		return this.client.msg.createEmbed({
			author: {
				name: `${item.user.username}#${item.user.discriminator}`,
				icon_url: item.user.avatarURL
			},
			url: item.link,
			image: { url: item.imageURL },
			color: 255, // blue
			title: item.title,
			fields: [...item.extras]
		});
	}

	public async searchYoutube(searchTerm: string, maxResults?: number) {
		const params: URLSearchParams = new URLSearchParams();
		params.set('key', this.client.config.bot.youtubeApiKey);
		params.set('type', 'video');
		// params.set('videoEmbeddable', "true");
		// params.set('videoSyndicated', "true");
		params.set('videoCategoryId', '10'); // only music videos
		params.set('maxResults', (maxResults || 10).toString());
		params.set('part', 'id');
		params.set('fields', 'items(id(videoId))');
		params.set('q', searchTerm);

		const { data } = await axios(
			`https://www.googleapis.com/youtube/v3/search?${params}`
		);

		return this.getVideoDetails(
			data.items.map((item: any) => item.id.videoId).join(',')
		);
	}

	private async getVideoDetails(
		idList: string
	): Promise<{ items: Array<YoutubeVideo> }> {
		const params: URLSearchParams = new URLSearchParams();
		params.set('key', this.client.config.bot.youtubeApiKey);
		params.set('id', idList);
		params.set('part', 'contentDetails,snippet');
		params.set(
			'fields',
			'items(id,snippet(title,description,thumbnails(default),channelTitle),contentDetails(duration))'
		);

		const { data } = await axios(
			`https://www.googleapis.com/youtube/v3/videos?${params}`
		);

		return data;
	}

	public formatTime(timeInSeconds: number) {
		const h = Math.floor(timeInSeconds / 3600);
		const m = Math.floor((timeInSeconds - 3600 * h) / 60);
		const s = Math.floor(timeInSeconds - h * 3600 - m * 60);
		return (
			h.toString().padStart(2, '0') +
			':' +
			m.toString().padStart(2, '0') +
			':' +
			s.toString().padStart(2, '0')
		);
	}

	public parseYoutubeDuration(PT: string) {
		let durationInSec = 0;
		const matches = PT.match(
			/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i
		);
		const parts = [
			{
				// years
				pos: 1,
				multiplier: 86400 * 365
			},
			{
				// months
				pos: 2,
				multiplier: 86400 * 30
			},
			{
				// weeks
				pos: 3,
				multiplier: 604800
			},
			{
				// days
				pos: 4,
				multiplier: 86400
			},
			{
				// hours
				pos: 5,
				multiplier: 3600
			},
			{
				// minutes
				pos: 6,
				multiplier: 60
			},
			{
				// seconds
				pos: 7,
				multiplier: 1
			}
		];
		for (var i = 0; i < parts.length; i++) {
			if (typeof matches[parts[i].pos] !== 'undefined') {
				durationInSec +=
					parseInt(matches[parts[i].pos], 10) * parts[i].multiplier;
			}
		}
		return durationInSec;
	}
}
