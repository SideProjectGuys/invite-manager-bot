import { Message } from 'eris';

import { IMModule } from '../../../framework/Module';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'disconnect',
			aliases: [],
			group: 'Music',
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

		await conn.disconnect();
	}
}
