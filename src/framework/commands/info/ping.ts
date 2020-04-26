import { Message } from 'eris';

import { IMModule } from '../../Module';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'ping',
			aliases: [],
			group: 'Info',
			defaultAdminOnly: false,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[], flags: {}, context: CommandContext): Promise<any> {
		const msg = await message.channel.createMessage('Pong!').catch(() => undefined);
		if (msg) {
			msg.edit(`Pong! (${(msg.createdAt - message.createdAt).toFixed(0)}ms)`);
		}
	}
}
