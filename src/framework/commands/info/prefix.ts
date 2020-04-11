import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'prefix',
			aliases: [],
			group: 'Info',
			defaultAdminOnly: false,
			guildOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { settings, t }: CommandContext): Promise<any> {
		return this.sendReply(
			message,
			t('cmd.prefix.title', {
				prefix: settings.prefix
			})
		);
	}
}
