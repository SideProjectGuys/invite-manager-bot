import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { RoleResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.mentionRole,
			aliases: ['mention-role', 'mr'],
			desc: 'Mention an unmentionable role',
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					description: 'The role that you want to mention.'
				}
			],
			// clientPermissions: ['MANAGE_ROLES'],
			guildOnly: true,
			group: CommandGroup.Other
		});
	}

	public async action(
		message: Message,
		[role]: [Role],
		{ t }: Context
	): Promise<any> {
		await message.delete();

		if (role.mentionable) {
			return sendReply(
				this.client,
				message,
				t('CMD_MENTIONROLE_ALREADY_DONE', { role })
			);
		} else {
			await role.edit({ mentionable: true }, 'Pinging role');
			await message.channel.createMessage(`${role}`);
			await role.edit({ mentionable: false }, 'Done pinging role');
		}
	}
}
