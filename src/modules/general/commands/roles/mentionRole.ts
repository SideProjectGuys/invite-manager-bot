import { Message, Role } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { RoleResolver } from '../../../../framework/resolvers';
import { BotCommand, CommandGroup } from '../../../../types';

const MISSING_PERMISSIONS = 50013;

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
			strict: true,
			extraExamples: ['!mentionRole @Role', '!mentionRole "Role with space"']
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

			const res = await role
				.edit({ mentionable: true }, 'Pinging role')
				.catch(e => {
					if (e.code === MISSING_PERMISSIONS) {
						this.sendReply(message, 'cmd.mentionRole.missingPermissions');
					}
					return null as Role;
				});
			if (!res) {
				return;
			}

			const msg = await message.channel
				.createMessage(`<@&${role.id}>`)
				.catch(() => null as Message);
			if (!msg) {
				return;
			}

			await role.edit({ mentionable: false }, 'Done pinging role');
			await message.delete().catch(() => undefined);
		}
	}
}
