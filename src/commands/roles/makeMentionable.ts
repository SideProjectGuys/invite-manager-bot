import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { RoleResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.makeMentionable,
			aliases: ['make-mentionable', 'mm'],
			desc: 'Make a role mentionable for 60 seconds or until it was used.',
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					description: 'The role that you want to mention.'
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
				t('cmd.makeMentionable.alreadyDone', { role })
			);
		} else {
			await role.edit({ mentionable: true }, 'Pinging role');

			const func = async (msg: Message) => {
				if (msg.roleMentions.includes(role.id)) {
					await role.edit({ mentionable: false }, 'Done pinging role');
					this.client.removeListener('messageCreate', func);
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);
				}
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageCreate', func);

			const timeOut = () => {
				this.client.removeListener('messageCreate', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);
			};

			setTimeout(timeOut, 60000);
		}
	}
}
