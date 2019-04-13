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
		flags: {},
		{ t, me, guild }: Context
	): Promise<any> {
		if (role.mentionable) {
			return this.sendReply(
				message,
				t('cmd.mentionRole.alreadyDone', { role: `<@&${role.id}>` })
			);
		} else {
			let myRole: Role;
			me.roles.forEach(r => {
				const gRole = guild.roles.get(r);
				if (!myRole || gRole.position > myRole.position) {
					myRole = gRole;
				}
			});
			// Check if we are higher then the role we want to edit
			if (myRole.position < role.position) {
				return this.sendReply(
					message,
					t('cmd.mentionRole.roleTooHigh', {
						role: role.name,
						myRole: myRole.name
					})
				);
			}

			await role.edit({ mentionable: true }, 'Pinging role');
			await message.channel.createMessage(`<@&${role.id}>`);
			await role.edit({ mentionable: false }, 'Done pinging role');
			await message.delete().catch(() => undefined);
		}
	}
}
