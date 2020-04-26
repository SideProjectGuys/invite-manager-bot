import { Message, VoiceChannel } from 'eris';

import { IMModule } from '../../../framework/Module';
import { BooleanResolver, StringResolver } from '../../../framework/resolvers';
import { MusicGuildSettings } from '../../models/GuildSettings';
import { MusicItem } from '../../models/MusicItem';
import { MusicPlatform } from '../../models/MusicPlatform';
import { PlatformResolver } from '../../resolvers/PlatformResolver';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'play',
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
					resolver: PlatformResolver
				},
				{
					name: 'next',
					short: 'n',
					resolver: BooleanResolver
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(
		message: Message,
		[link]: [string],
		{ platform, next }: { platform: MusicPlatform; next: boolean },
		{ t, guild, settings }: CommandContext<MusicGuildSettings>
	): Promise<any> {
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			await this.sendReply(message, t('music.voiceChannelRequired'));
			return;
		}

		const conn = await this.music.getMusicConnection(guild);

		if (!link) {
			if (conn.isPaused()) {
				conn.resume();
			}
			return;
		}

		let musicPlatform = platform || this.music.getPlatformForLink(link);

		let item: MusicItem;
		if (musicPlatform) {
			item = await musicPlatform.getByLink(link);
		} else {
			musicPlatform = this.music.getPlatformByName(settings.defaultMusicPlatform);
			const items = await musicPlatform.search(link, 1);
			if (items.length > 0) {
				item = items[0];
			}
		}

		if (item) {
			item.setAuthor(message.author);
			const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

			await conn.play(item, voiceChannel, next);

			await this.sendEmbed(message.channel, this.music.createPlayingEmbed(item));
		}
	}
}
