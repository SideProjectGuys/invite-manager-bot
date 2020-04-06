import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandGroup, MusicCommand } from '../../../types';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.repeat,
			aliases: ['loop'],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isConnected()) {
			await this.sendReply(message, t('music.notConnected'));
			return;
		}

		conn.setRepeat(!conn.isRepeating());

		if (conn.isRepeating()) {
			await this.sendReply(message, t('cmd.repeat.enabled'));
		} else {
			await this.sendReply(message, t('cmd.repeat.disabled'));
		}
	}
}
