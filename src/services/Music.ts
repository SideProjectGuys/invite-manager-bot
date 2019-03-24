import { Guild, VoiceChannel, VoiceConnection } from 'eris';
import { Readable } from 'stream';

import { IMClient } from '../client';
import { NowPlayingInfo } from '../types';

interface ConnectionInfo {
	voiceChannel: VoiceChannel;
	connection: VoiceConnection;
	nowPlaying: NowPlayingInfo | null;
	play: (info: NowPlayingInfo, stream: string | Readable) => void;
	disconnect: () => void;
}

export class MusicService {
	private client: IMClient = null;
	private connections: Map<string, ConnectionInfo>;

	public constructor(client: IMClient) {
		this.client = client;
		this.connections = new Map();
	}

	public async connect(channel: VoiceChannel) {
		let conn = this.connections.get(channel.guild.id);

		if (conn) {
			conn.voiceChannel = channel;
			conn.connection.switchChannel(channel.id);
		} else {
			conn = {
				voiceChannel: channel,
				connection: await channel.join({}),
				nowPlaying: null,
				play: (info, stream) => this.play(channel.guild, info, stream),
				disconnect: () => this.disconnect(channel.guild)
			};
			this.connections.set(channel.guild.id, conn);
		}

		return conn;
	}

	public play(guild: Guild, info: NowPlayingInfo, stream: string | Readable) {
		const conn = this.connections.get(guild.id);
		if (!conn) {
			throw new Error('Must create a connection before playing audio');
		}

		conn.nowPlaying = info;
		conn.connection.play(stream);
	}

	public disconnect(guild: Guild) {
		const conn = this.connections.get(guild.id);
		if (conn) {
			conn.connection.stopPlaying();
			conn.voiceChannel.leave();
		}
		this.connections.delete(guild.id);
	}

	public createPlayingEmbed(info: NowPlayingInfo) {
		return this.client.msg.createEmbed({
			author: {
				name: `${info.source.username}#${info.source.discriminator}`,
				icon_url: info.source.avatarURL
			},
			image: { url: info.imageURL },
			color: 255, // blue
			title: info.title,
			fields: info.extras
		});
	}
}
