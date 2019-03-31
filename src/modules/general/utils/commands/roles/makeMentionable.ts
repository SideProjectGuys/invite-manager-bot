import { Message, Role } from 'eris';

import { IMClient } from '../../../../../client';
import { RoleResolver } from '../../../../../framework/resolvers';
import { BotCommand, CommandGroup } from '../../../../../types';
import { Command, Context } from '../../../../../framework/commands/Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.makeMentionable,
			aliases: ['make-mentionable', 'mm'],
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
				t('cmd.makeMentionable.alreadyDone', { role: `<@&${role.id}>` })
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

			const func = async (msg: Message) => {
				if (msg.roleMentions.includes(role.id)) {
					await role.edit({ mentionable: false }, 'Done pinging role');
					this.client.removeListener('messageCreate', func);
				}
			};

			this.client.on('messageCreate', func);

			const timeOut = () => {
				this.client.removeListener('messageCreate', func);
			};

			setTimeout(timeOut, 60000);

			await message.delete();
		}
	}
}
