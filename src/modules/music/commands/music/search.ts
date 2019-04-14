import { Emoji, Message, VoiceChannel } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { EnumResolver, StringResolver } from '../../../../framework/resolvers';
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
			name: MusicCommand.search,
			aliases: [],
			args: [
				{
					name: 'search',
					resolver: StringResolver,
					rest: true
				}
			],
			flags: [
				{
					name: 'platform',
					short: 'p',
					resolver: new EnumResolver(client, Object.values(MusicPlatformTypes))
				}
			],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[searchTerm]: [string],
		{ platform }: { platform: MusicPlatformTypes },
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

		let musicPlatform: MusicPlatform;
		if (platform) {
			musicPlatform = this.client.music.platforms.get(platform);
		} else {
			musicPlatform = this.client.music.platforms.get(
				MusicPlatformTypes.YouTube
			);
		}

		if (!musicPlatform.supportsSearch) {
			this.sendReply(
				message,
				`Search is not supported on platform ${musicPlatform.getType()}`
			);
			return;
		}

		const items = await musicPlatform.search(searchTerm);

		const msg = await this.sendReply(message, {
			author: {
				name: `${message.author.username}#${message.author.discriminator}`,
				icon_url: message.author.avatarURL
			},
			color: 6737151, // lightblue
			title: `Search for ${searchTerm}`,
			fields: items.map((item, index) => item.toSearchEntry(index + 1))
		});

		for (let i = 0; i < this.choices.length; i++) {
			msg.addReaction(this.choices[i]);
		}

		msg.addReaction(this.cancel);

		const choice = await this.awaitChoice(message.author.id, msg);
		if (choice === null) {
			return;
		}

		msg.delete();
		message.delete();

		const musicItem = items[choice];

		const queueItem: MusicQueueItem = await musicItem.toQueueItem(
			message.author
		);

		const conn = await this.client.music.getMusicConnection(guild);

		const voiceChannel = guild.channels.get(voiceChannelId) as VoiceChannel;

		conn.play(queueItem, voiceChannel);

		this.sendEmbed(
			message.channel,
			this.client.music.createPlayingEmbed(queueItem)
		);

		// this.client.music.disconnect(guild);
	}

	private cancel: string = '❌';
	private choices: string[] = [
		'1⃣',
		'2⃣',
		'3⃣',
		'4⃣',
		'5⃣',
		'6⃣',
		'7⃣',
		'8⃣',
		'9⃣',
		'🔟'
	];

	private async awaitChoice(authorId: string, msg: Message) {
		return new Promise<number>(async resolve => {
			let timeOut: NodeJS.Timer;
			const func = async (resp: Message, emoji: Emoji, userId: string) => {
				if (resp.id !== msg.id || authorId !== userId) {
					return;
				}

				clearTimeout(timeOut);
				this.client.removeListener('messageReactionAdd', func);

				if (emoji.name === this.cancel) {
					await msg.delete();
					resolve(null);
					return;
				}

				const id = this.choices.indexOf(emoji.name);
				await resp.removeReaction(emoji.name, userId);

				resolve(id);
			};

			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageReactionAdd', func);

				msg.delete();

				resolve(undefined);
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
	}
}
