import { Message } from 'eris';

import { IMClient } from '../../client';
import { NumberResolver, StringResolver, UserResolver } from '../../resolvers';
import { BasicUser, BotCommand, CommandGroup } from '../../types';
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
			strict: true,
			extraExamples: [
				'!removeInvites @User 5',
				'!removeInvites "User with space" 23 Removed for cheating',
				'!removeInvites @User -6 Added for apologizing'
			]
		});
	}

	public async action(
		message: Message,
		[user, amount, reason]: [BasicUser, number, string],
		flags: {},
		context: Context
	): Promise<any> {
		const cmd = this.client.cmds.commands.find(
			c => c.name === BotCommand.addInvites
		);
		return cmd.action(message, [user, -amount, reason], flags, context);
	}
}
