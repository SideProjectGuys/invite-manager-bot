import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { NumberResolver } from '../../../../framework/resolvers';
import { BotCommand, CommandGroup } from '../../../../types';
import { Command, Context } from '../../../../framework/commands/Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.volume,
			aliases: [],
			args: [
				{
					name: 'volume',
					resolver: new NumberResolver(client, 0, 200)
				}
			],
			group: CommandGroup.Music,
			guildOnly: true,
			premiumOnly: true
		});
	}

	public async action(
		message: Message,
		[volume]: [number],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			this.sendReply(message, 'I am currently not playing any music');
			return;
		}

		conn.setVolume(volume / 100);

		this.sendReply(message, `Changed volume to ${volume}`);
	}
}
