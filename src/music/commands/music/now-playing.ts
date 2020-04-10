import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BooleanResolver } from '../../../framework/resolvers';
import { CommandGroup } from '../../../types';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

const PIN_UPDATE_INTERVAL = 5000;
const PREMIUM_PIN_UPDATE_INTERVAL = 2000;

export default class extends IMMusicCommand {
	private timerMap: Map<string, NodeJS.Timer> = new Map();

	public constructor(client: IMClient) {
		super(client, {
			name: 'nowPlaying',
			aliases: ['np', 'now-playing'],
			flags: [
				{
					name: 'pin',
					short: 'p',
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
		args: any[],
		{ pin }: { pin: boolean },
		{ guild, t, isPremium }: CommandContext
	): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);

		let item = conn.getNowPlaying();
		const embed = this.music.createPlayingEmbed(item);
		if (!pin && item) {
			embed.fields.push({
				name: t('cmd.nowPlaying.playTime'),
				value: item.getProgress(conn.getPlayTime())
			});
		}

		const msg = await this.sendEmbed(message.channel, embed);

		if (pin) {
			const timer = this.timerMap.get(guild.id);
			if (timer) {
				clearInterval(timer);
			}

			let msg2: Message = null;
			const func = async () => {
				const oldId = item ? item.id : null;
				item = conn.getNowPlaying();
				const newId = item ? item.id : null;

				if (oldId !== newId) {
					await msg.edit({ embed: this.music.createPlayingEmbed(item) });
				}

				if (item) {
					const progress = item.getProgress(conn.getPlayTime());
					const progressEmbed = this.createEmbed({ description: progress });

					if (msg2) {
						await msg2.edit({ embed: progressEmbed });
					} else {
						msg2 = await this.sendEmbed(message.channel, progressEmbed);
					}
				} else {
					if (msg2) {
						await msg2.delete().catch(() => undefined);
						msg2 = null;
					}
				}
			};

			const interval = isPremium ? PREMIUM_PIN_UPDATE_INTERVAL : PIN_UPDATE_INTERVAL;

			await func();
			this.timerMap.set(guild.id, setInterval(func, interval));
		}
	}
}
