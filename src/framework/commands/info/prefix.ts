import { Message } from 'eris';

import { IMModule } from '../../Module';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
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
