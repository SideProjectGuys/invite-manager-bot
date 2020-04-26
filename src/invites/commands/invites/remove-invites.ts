import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { IMModule } from '../../../framework/Module';
import { NumberResolver, StringResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';

import addInvites from './add-invites';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'removeInvites',
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
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true,
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
		context: CommandContext
	): Promise<any> {
		const cmd = this.client.commands.get(addInvites);
		return cmd.action(message, [user, -amount, reason], flags, context);
	}
}
