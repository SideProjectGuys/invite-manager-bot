import { Emoji, Message, VoiceChannel } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { EnumResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, MusicCommand, MusicPlatformType } from '../../../types';
import { MusicPlatform } from '../../models/MusicPlatform';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.search,
			aliases: [],
			args: [
				{
					name: 'search',
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
		[searchTerm]: [string],
		{ platform }: { platform: MusicPlatformType },
		{ t, guild, settings }: Context
	): Promise<any> {
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			await this.sendReply(message, t('music.voiceChannelRequired'));
			return;
		}

		let musicPlatform: MusicPlatform;
		if (platform) {
			musicPlatform = this.client.music.platforms.get(platform);
		} else {
			musicPlatform = this.client.music.platforms.get(settings.defaultMusicPlatform);
		}

		if (!musicPlatform.supportsSearch) {
			await this.sendReply(
				message,
				t('cmd.search.notSupported', {
					platform: musicPlatform.getType()
				})
			);
			return;
		}

		const items = await musicPlatform.search(searchTerm);

		if (items.length === 0) {
			await this.sendReply(message, t('cmd.search.noResults'));
			return;
		}

		const msg = await this.sendReply(message, {
			author: {
				name: `${message.author.username}#${message.author.discriminator}`,
				icon_url: message.author.avatarURL
			},
			title: t('cmd.search.title', { term: searchTerm }),
			fields: items.map((item, index) => item.toSearchEntry(index + 1))
		});

		for (let i = 0; i < Math.min(items.length, this.choices.length); i++) {
			msg.addReaction(this.choices[i]).catch(() => undefined);
		}

		msg.addReaction(this.cancel).catch(() => undefined);

		const choice = await this.awaitChoice(message.author.id, msg);
		if (choice === null) {
			return;
		}

		msg.delete().catch(() => undefined);
		message.delete().catch(() => undefined);

		const musicItem = items[choice];
		musicItem.setAuthor(message.author);

		const conn = await this.client.music.getMusicConnection(guild);

		const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

		await conn.play(musicItem, voiceChannel);

		await this.sendEmbed(message.channel, this.client.music.createPlayingEmbed(musicItem));
	}

	private cancel: string = '❌';
	private choices: string[] = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

	private async awaitChoice(authorId: string, msg: Message) {
		return new Promise<number>(async (resolve) => {
			let timeOut: NodeJS.Timer;
			const func = async (resp: Message, emoji: Emoji, userId: string) => {
				if (resp.id !== msg.id || authorId !== userId) {
					return;
				}

				clearTimeout(timeOut);
				this.client.removeListener('messageReactionAdd', func);

				if (emoji.name === this.cancel) {
					await msg.delete().catch(() => undefined);
					resolve(null);
					return;
				}

				const id = this.choices.indexOf(emoji.name);
				await resp.removeReaction(emoji.name, userId).catch(() => undefined);

				resolve(id);
			};

			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageReactionAdd', func);

				msg.delete().catch(() => undefined);

				resolve(null);
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
	}
}
