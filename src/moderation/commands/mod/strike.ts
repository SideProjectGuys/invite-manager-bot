import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { EnumResolver, MemberResolver, NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { ViolationType } from '../../models/StrikeConfig';

export default class extends Command {
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
		{ guild, settings }: Context
	): Promise<any> {
		const source = `${message.author.username}#${message.author.discriminator} ` + `(ID: ${message.author.id})`;
		await this.client.mod.logViolationModAction(guild, member.user, type, amount, [
			{ name: 'Issued by', value: source }
		]);

		await this.client.mod.addStrikesAndPunish(member, type, amount, {
			guild,
			settings
		});
	}
}
