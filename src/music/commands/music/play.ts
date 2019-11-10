import { Message, VoiceChannel } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { BooleanResolver, EnumResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, MusicCommand, MusicPlatformType } from '../../../types';
import { MusicItem } from '../../models/MusicItem';
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
					required: true,
					rest: true
				}
			],
			flags: [
				{
					name: 'platform',
					short: 'p',
					resolver: new EnumResolver(client, Object.values(MusicPlatformType))
				},
				{
					name: 'next',
					short: 'n',
					resolver: BooleanResolver
				}
			],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(
		message: Message,
		[link]: [string],
		{ platform, next }: { platform: MusicPlatformType; next: boolean },
		{ t, guild, settings }: Context
	): Promise<any> {
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			await this.sendReply(message, t('music.voiceChannelRequired'));
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
			musicPlatform = this.client.music.platforms.get(platform);
		} else {
			musicPlatform = this.client.music.platforms.getForLink(link);
		}

		let item: MusicItem;
		if (musicPlatform) {
			item = await musicPlatform.getByLink(link);
		} else {
			musicPlatform = this.client.music.platforms.get(settings.defaultMusicPlatform);
			const items = await musicPlatform.search(link, 1);
			if (items.length > 0) {
				item = items[0];
			}
		}

		if (item) {
			item.setAuthor(message.author);
			const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

			await conn.play(item, voiceChannel, next);

			await this.sendEmbed(message.channel, this.client.music.createPlayingEmbed(item));
		}
	}
}
