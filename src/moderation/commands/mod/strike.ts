import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { EnumResolver, MemberResolver, NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { ViolationType } from '../../models/StrikeConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.strike,
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
				}
			],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, type, amount]: [Member, ViolationType, number],
		flags: {},
		{ guild, settings }: CommandContext
	): Promise<any> {
		const source = `${message.author.username}#${message.author.discriminator} ` + `(ID: ${message.author.id})`;
		await this.mod.logViolationModAction(guild, member.user, type, amount, [{ name: 'Issued by', value: source }]);

		await this.mod.addStrikesAndPunish(member, type, amount, {
			guild,
			settings
		});
	}
}
