import { Guild, VoiceChannel } from 'eris';

import { AnnouncementVoice } from '../../../sequelize';
import { SettingsObject } from '../../../settings';
import { LavaPlayer, MusicQueue, MusicQueueItem } from '../../../types';
import { MusicService } from '../services/MusicService';

const DEFAULT_DIM_VOLUME_FACTOR = 0.2;
const IGNORED_ANNOUNCEMENT_WORDS = [
	/official/gi,
	/originals?/gi,
	/videos?/gi,
	/songs?/gi,
	/lyrics?/gi,
	/[\(\[\{].*?[\)\[\{]/gi
];

export class MusicConnection {
	private service: MusicService;
	private guild: Guild;
	private settings: SettingsObject;
	private musicQueueCache: MusicQueue;
	private voiceChannel: VoiceChannel;
	private player: LavaPlayer;
	private volume: number = 100;
	private doPlayNext: boolean = true;
	private speaking: Set<string> = new Set();
	private repeat: boolean;
	private doneCallback: () => void;
	private playStart: number = 0;
	private pauseStart: number = 0;

	public constructor(
		service: MusicService,
		guild: Guild,
		musicQueueCache: MusicQueue
	) {
		this.service = service;
		this.guild = guild;
		this.musicQueueCache = musicQueueCache;

		this.onSpeakingStart = this.onSpeakingStart.bind(this);
		this.onSpeakingEnd = this.onSpeakingEnd.bind(this);
		this.onStreamEnd = this.onStreamEnd.bind(this);
	}

	public switchChannel(voiceChannel: VoiceChannel) {
		this.voiceChannel = voiceChannel;
		this.player.switchChannel(voiceChannel.id);
	}

	public isPlaying(): boolean {
		return this.player && this.player.playing;
	}

	public isPaused(): boolean {
		return this.player && this.player.paused;
	}

	public isConnected(): boolean {
		return !!this.player;
	}

	public async play(
		item: MusicQueueItem,
		voiceChannel?: VoiceChannel,
		next?: boolean
	) {
		if (voiceChannel) {
			await this.connect(voiceChannel);
		} else if (!this.player) {
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
	}

	public pause() {
		if (!this.player.paused) {
			this.pauseStart = new Date().getTime();
			this.player.pause();
		}
	}

	public resume() {
		if (this.player.paused) {
			this.playStart += new Date().getTime() - this.pauseStart;
			this.pauseStart = 0;
			this.player.resume();
		}
	}

	public async rewind() {
		this.seek(0);
	}

	public async skip() {
		this.playNext();
	}

	public isRepeating() {
		return this.repeat;
	}

	public setRepeat(repeat: boolean) {
		this.repeat = repeat;
	}

	public setVolume(volume: number) {
		this.volume = volume;
		this.player.setVolume(volume);
	}

	public getNowPlaying() {
		return this.musicQueueCache.current;
	}

	public getPlayTime() {
		return (new Date().getTime() - this.playStart) / 1000;
	}

	public getQueue() {
		return this.musicQueueCache.queue;
	}

	private stopSpeakingTimeout: NodeJS.Timer;
	public async connect(channel: VoiceChannel) {
		if (this.player) {
			this.switchChannel(channel);
		} else {
			this.settings = await this.service.client.cache.settings.get(
				this.guild.id
			);
			this.volume = this.settings.musicVolume;

			this.voiceChannel = channel;
			this.player = (await channel.join({})) as LavaPlayer;
			this.player.setVolume(this.volume);
			this.player.on('warn', error => console.error(error));
			this.player.on('error', error => console.error(error));
			this.player.on('speakingStart', this.onSpeakingStart);
			this.player.on('speakingStop', this.onSpeakingEnd);
			this.player.on('end', this.onStreamEnd);
			this.player.on('reconnect', () => {
				console.error(`Reconnected lavalink player for guild ${this.guild.id}`);
			});
			this.player.on('disconnect', () => {
				console.error(`Player disconnected for guild ${this.guild.id}`);
				this.player = null;
			});
		}
	}

	private onSpeakingStart(userId: string) {
		if (this.settings.fadeMusicOnTalk && this.speaking.size === 0) {
			if (this.stopSpeakingTimeout) {
				clearTimeout(this.stopSpeakingTimeout);
				this.stopSpeakingTimeout = null;
			} else {
				this.player.setVolume(DEFAULT_DIM_VOLUME_FACTOR * this.volume);
			}
		}

		this.speaking.add(userId);
	}

	private onSpeakingEnd(userId: string) {
		this.speaking.delete(userId);

		if (this.settings.fadeMusicOnTalk && this.speaking.size === 0) {
			const func = () => {
				this.stopSpeakingTimeout = null;
				this.player.setVolume(this.volume);
			};
			this.stopSpeakingTimeout = setTimeout(
				func,
				this.settings.fadeMusicEndDelay * 1000
			);
		}
	}

	private onStreamEnd(data: any) {
		console.log(data);

		if (data.reason && data.reason === 'REPLACED') {
			return;
		}

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
	}

	public async playAnnouncement(
		voice: AnnouncementVoice,
		message: string,
		channel?: VoiceChannel
	) {
		if (!this.player || channel) {
			await this.connect(channel);
		}

		this.doPlayNext = false;

		return new Promise<void>(async resolve => {
			this.doneCallback = async () => {
				this.doPlayNext = true;
				resolve();
			};

			const url = await this.service.getAnnouncementUrl(voice, message);
			const tracks = await this.service.resolveTracks(url);
			this.player.play(tracks[0].track);
		});
	}

	private async playNext() {
		const next = this.musicQueueCache.queue.shift();
		if (next) {
			console.log(next);

			let sanitizedTitle = next.title;
			IGNORED_ANNOUNCEMENT_WORDS.forEach(
				word => (sanitizedTitle = sanitizedTitle.replace(word, ''))
			);

			if (this.settings.announceNextSong) {
				await this.playAnnouncement(
					this.settings.announcementVoice,
					'Playing: ' + sanitizedTitle
				);
			}

			const stream = await next.getStreamUrl();
			const tracks = await this.service.resolveTracks(stream);

			this.playStart = new Date().getTime() + 400; // This additional time is lavalink buffering
			this.musicQueueCache.current = next;
			this.player.play(tracks[0].track);
		}
	}

	public async seek(offsetSeconds: number) {
		const now = new Date().getTime();
		this.playStart = now - offsetSeconds * 1000 + 200;
		this.player.seek(offsetSeconds * 1000);
	}

	public disconnect() {
		this.player.stop();
		this.voiceChannel.leave();
		this.player = null;
	}
}
