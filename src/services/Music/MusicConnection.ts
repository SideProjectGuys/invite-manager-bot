import { Guild, Message, VoiceChannel, VoiceConnection } from 'eris';
import { Stream } from 'stream';

import { AnnouncementVoice } from '../../sequelize';
import { MusicQueue, MusicQueueItem } from '../../types';

import { MusicService } from '.';

const VOL_FADE_TIME = 1.5;
const USELESS_WORDS = [/official.*?video/gi, /original.*?video/gi, /video/gi];

export class MusicConnection {
	private service: MusicService;
	private guild: Guild;
	private musicQueueCache: MusicQueue;
	private voiceChannel: VoiceChannel;
	private connection: VoiceConnection;
	private nowPlayingMessage: Message;
	private volume: number = 1.0;
	private doPlayNext: boolean = true;
	private speaking: Set<string> = new Set();
	private repeat: boolean;
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

	public async play(
		item: MusicQueueItem,
		voiceChannel?: VoiceChannel,
		next?: boolean
	) {
		if (voiceChannel) {
			await this.connect(voiceChannel);
		} else if (!this.connection) {
			if (this.voiceChannel) {
				await this.connect(this.voiceChannel);
			} else {
				throw new Error('Not connected and no voice channel specified');
			}
		}

		if (next) {
			this.musicQueueCache.queue.unshift(item);
		} else {
			this.musicQueueCache.queue.push(item);
		}

		if (!this.isPlaying()) {
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

	public isRepeating() {
		return this.repeat;
	}

	public setRepeat(repeat: boolean) {
		this.repeat = repeat;
	}

	public setVolume(volume: number) {
		if (this.connection) {
			this.cancelFadeVolume();

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
			this.connection.on('speakingStart', this.onSpeakingStart);
			this.connection.on('speakingStop', this.onSpeakingEnd);
			this.connection.on('end', this.onStreamEnd);
		}
	}

	private onSpeakingStart = (userId: string) => {
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
	};

	private onSpeakingEnd = (userId: string) => {
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
	};

	private onStreamEnd = () => {
		console.log('STREAM END');

		if (this.repeat && this.musicQueueCache.current) {
			this.musicQueueCache.queue.push({ ...this.musicQueueCache.current });
		}

		this.musicQueueCache.current = null;

		if (this.doneCallback) {
			this.doneCallback();
			this.doneCallback = null;
		}

		if (this.doPlayNext) {
			this.playNext();
		}
	};

	public async playAnnouncement(
		voice: AnnouncementVoice,
		message: string,
		channel?: VoiceChannel
	) {
		if (!this.connection || channel) {
			await this.connect(channel);
		} else if (this.connection.playing) {
			this.doPlayNext = false;
			this.connection.stopPlaying();
		}

		return new Promise<void>(resolve => {
			this.service.polly.synthesizeSpeech(
				{
					Text: message,
					LanguageCode: 'en-US',
					OutputFormat: 'ogg_vorbis',
					VoiceId: voice
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

			console.log(next);

			let sanitizedTitle = next.title;
			USELESS_WORDS.forEach(
				word => (sanitizedTitle = sanitizedTitle.replace(word, ''))
			);

			const sets = await this.getSettings();

			if (sets.announceNextSong) {
				await this.playAnnouncement(
					sets.announcementVoice,
					'Playing: ' + sanitizedTitle
				);
			}

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
