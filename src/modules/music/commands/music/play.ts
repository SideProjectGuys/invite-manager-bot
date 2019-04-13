import { Message, VoiceChannel } from 'eris';

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
	MusicPlatformTypes,
	MusicQueueItem
} from '../../../../types';
import { MusicPlatform } from '../../models/MusicPlatform';

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
					resolver: new EnumResolver(client, Object.values(MusicPlatformTypes))
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
		{ platform, next }: { platform: MusicPlatformTypes; next: boolean },
		{ t, guild }: Context
	): Promise<any> {
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			this.sendReply(
				message,
				'Please join a voice channel before using this command'
			);
			return;
		}

		const conn = await this.client.music.getMusicConnection(guild);

		if (!link) {
			if (conn.isPaused()) {
				conn.resume();
			}
			return;
		}

		let musicPlatform: MusicPlatform;
		if (platform) {
			musicPlatform = this.client.music.musicPlatformService.getPlatform(
				platform
			);
		} else {
			musicPlatform = this.client.music.musicPlatformService.getPlatformForLink(
				link
			);
		}

		let item: MusicQueueItem;
		if (musicPlatform) {
			const musicItem = await musicPlatform.getByLink(link);
			if (musicItem) {
				item = await musicItem.toQueueItem(message.author);
			}
		} else {
			musicPlatform = this.client.music.musicPlatformService.getPlatform(
				MusicPlatformTypes.YouTube
			);
			const items = await musicPlatform.search(link, 1);
			if (items.length > 0) {
				const musicItem = items[0];
				if (musicItem) {
					item = await musicItem.toQueueItem(message.author);
				}
			}
		}

		if (item) {
			const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

			conn.play(item, voiceChannel, next);

			this.sendEmbed(
				message.channel,
				this.client.music.createPlayingEmbed(item)
			);
		}
	}
}
