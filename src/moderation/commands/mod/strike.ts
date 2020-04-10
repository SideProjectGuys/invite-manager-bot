import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { EnumResolver, MemberResolver, NumberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup } from '../../../types';
import { ViolationType } from '../../models/StrikeConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'strike',
			aliases: [],
			args: [
				{
					name: 'member',
					resolver: MemberResolver,
					required: true
				},
				{
					name: 'type',
					resolver: new EnumResolver(client, Object.values(ViolationType)),
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
					required: false,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, type, amount, reason]: [Member, ViolationType, number, string],
		flags: {},
		{ guild }: CommandContext
	): Promise<any> {
		await this.mod.addStrikesAndPunish(guild, member.user, type, amount, { user: message.author, reason });
	}
}
