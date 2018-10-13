import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { RoleResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.mentionRole,
			aliases: ['mention-role', 'mr'],
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					required: true
				}
			],
			group: CommandGroup.Other,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[role]: [Role],
		{ t }: Context
	): Promise<any> {
		await message.delete();

		if (role.mentionable) {
			return this.client.sendReply(
				message,
				t('cmd.mentionRole.alreadyDone', { role: `<@&${role.id}>` })
			);
		} else {
			await role.edit({ mentionable: true }, 'Pinging role');
			await message.channel.createMessage(`<@&${role.id}>`);
			await role.edit({ mentionable: false }, 'Done pinging role');
		}
	}
}
