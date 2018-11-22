import { Message, User } from 'eris';

import { IMClient } from '../../client';
import { NumberResolver, StringResolver, UserResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.removeInvites,
			aliases: ['remove-invites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					required: true
				},
				{
					name: 'amount',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[user, amount, reason]: [User, number, string],
		context: Context
	): Promise<any> {
		const cmd = this.client.cmds.commands.find(
			c => c.name === BotCommand.addInvites
		);
		return cmd.action(message, [user, -amount, reason], context);
	}
}
