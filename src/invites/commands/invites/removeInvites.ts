import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { NumberResolver, StringResolver, UserResolver } from '../../../framework/resolvers';
import { CommandsService } from '../../../framework/services/Commands';
import { BasicUser, CommandGroup } from '../../../types';

export default class extends IMCommand {
	@Service() private cmds: CommandsService;

	public constructor(client: IMClient) {
		super(client, {
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
			group: CommandGroup.Invites,
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
		const cmd = this.cmds.commands.find((c) => c.name === 'addInvites');
		return cmd.action(message, [user, -amount, reason], flags, context);
	}
}
