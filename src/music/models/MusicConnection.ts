import { Guild, VoiceChannel } from 'eris';

import { AnnouncementVoice } from '../../framework/models/GuildSetting';
import { GuildSettingsObject } from '../../settings';
import { LavaPlayer, LavaPlayerState, MusicQueue } from '../../types';
import { MusicService } from '../services/MusicService';

import { MusicItem } from './MusicItem';

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
	private settings: GuildSettingsObject;
	private musicQueueCache: MusicQueue;
	private voiceChannel: VoiceChannel;
	private player: LavaPlayer;
	private volume: number = 100;
	private doPlayNext: boolean = true;
	private speaking: Set<string> = new Set();
	private repeat: boolean;
	private doneCallback: () => void;
	private lastUpdate: number = 0;
	private playStart: number = 0;

	public constructor(service: MusicService, guild: Guild, musicQueueCache: MusicQueue) {
		this.service = service;
		this.guild = guild;
		this.musicQueueCache = musicQueueCache;

		this.onSpeakingStart = this.onSpeakingStart.bind(this);
		this.onSpeakingEnd = this.onSpeakingEnd.bind(this);
		this.onStateUpdate = this.onStateUpdate.bind(this);
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

	public async play(item: MusicItem, voiceChannel?: VoiceChannel, next?: boolean) {
		if (!item.author) {
			throw new Error(`No author on music item ${item.toString()}`);
		}

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
			await this.playNext();
		}
	}

	public pause() {
		if (!this.player.paused) {
			this.player.pause();
		}
	}

	public resume() {
		if (this.player.paused) {
			this.player.resume();
		}
	}

	public async rewind() {
		await this.seek(0);
	}

	public async skip(amount: number = 1) {
		await this.playNext(amount - 1);
	}

	public isRepeating() {
		return this.repeat;
	}

	public setRepeat(repeat: boolean) {
		this.repeat = repeat;
	}

	public getVolume() {
		return this.volume;
	}
	public setVolume(volume: number) {
		this.volume = volume;
		this.player.setVolume(volume);
	}

	public getNowPlaying() {
		return this.musicQueueCache.current;
	}

	public getPlayTime() {
		const time = this.player && this.player.paused ? this.lastUpdate : new Date().getTime();
		return (time - this.playStart) / 1000;
	}

	public getQueue() {
		return this.musicQueueCache.queue;
	}

	private stopSpeakingTimeout: NodeJS.Timer;
	public async connect(channel: VoiceChannel) {
		if (this.player) {
			this.switchChannel(channel);
		} else {
			this.settings = await this.service.getGuildSettings(this.guild.id);
			this.volume = this.settings.musicVolume;

			this.voiceChannel = channel;
			this.player = (await channel.join({})) as LavaPlayer;
			this.player.setVolume(this.volume);
			this.player.on('warn', (error) => console.error(error));
			this.player.on('error', (error) => console.error(error));
			this.player.on('speakingStart', this.onSpeakingStart);
			this.player.on('speakingStop', this.onSpeakingEnd);
			this.player.on('stateUpdate', this.onStateUpdate);
			this.player.on('end', this.onStreamEnd);
			this.player.on('reconnect', () => {
				console.error(`Reconnected lavalink player for guild ${this.guild.id}`);
			});
			this.player.on('disconnect', async () => {
				console.error(`Player disconnected for guild ${this.guild.id}`);
				this.player = null;
				this.voiceChannel.leave();
				await this.service.removeConnection(this.guild);
			});
		}
	}

	private onStateUpdate(data: LavaPlayerState) {
		this.lastUpdate = new Date().getTime();
		this.playStart = this.lastUpdate - data.position;
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
			this.stopSpeakingTimeout = setTimeout(func, this.settings.fadeMusicEndDelay * 1000);
		}
	}

	private async onStreamEnd(data: any) {
		console.log(data);

		if (data.reason && data.reason === 'REPLACED') {
			return;
		}

		if (this.repeat && this.musicQueueCache.current) {
			this.musicQueueCache.queue.push(this.musicQueueCache.current.clone());
		}

		this.musicQueueCache.current = null;

		if (this.doneCallback) {
			this.doneCallback();
			this.doneCallback = null;
		}

		if (this.doPlayNext) {
			await this.playNext();
		}
	}

	public async playAnnouncement(voice: AnnouncementVoice, message: string, channel?: VoiceChannel) {
		if (!this.player || channel) {
			await this.connect(channel);
		}

		this.doPlayNext = false;

		return new Promise<void>(async (resolve) => {
			this.doneCallback = async () => {
				this.doPlayNext = true;
				resolve();
			};

			const url = await this.service.getAnnouncementUrl(voice, message);
			const tracks = await this.service.resolveTracks(url);
			this.player.play(tracks[0].track);
		});
	}

	private preparingNext: boolean = false;
	private async playNext(skip: number = 0) {
		if (this.preparingNext) {
			return;
		}

		this.preparingNext = true;

		for (let i = 0; i < skip; i++) {
			this.musicQueueCache.queue.shift();
		}

		const next = this.musicQueueCache.queue.shift();
		if (next) {
			if (this.settings.announceNextSong) {
				let sanitizedTitle = next.title || '';
				IGNORED_ANNOUNCEMENT_WORDS.forEach((word) => (sanitizedTitle = sanitizedTitle.replace(word, '')));
				if (sanitizedTitle) {
					await this.playAnnouncement(this.settings.announcementVoice, 'Playing: ' + sanitizedTitle).catch(
						() => undefined
					);
				}
			}

			const stream = await next.getStreamUrl().catch(() => undefined);
			const tracks = await this.service.resolveTracks(stream).catch(() => []);

			if (tracks.length === 0) {
				this.preparingNext = false;
				await this.playNext();
				return;
			}

			// +400 is the additional time lavalink is buffering, we sync up later so it's no that important
			this.playStart = new Date().getTime() + 400;
			this.player.playing = true;
			this.player.paused = false;
			this.musicQueueCache.current = next;
			this.player.play(tracks[0].track);
		} else if (this.musicQueueCache.current) {
			this.player.stop();
		}

		this.preparingNext = false;
	}

	public async seek(offsetSeconds: number) {
		const now = new Date().getTime();
		this.playStart = now - offsetSeconds * 1000 + 200;
		this.player.seek(offsetSeconds * 1000);
	}

	public async disconnect() {
		this.player.stop();
		this.voiceChannel.leave();
		this.player = null;
		await this.service.removeConnection(this.guild);
	}
}
