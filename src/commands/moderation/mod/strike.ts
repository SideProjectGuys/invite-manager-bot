import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	EnumResolver,
	MemberResolver,
	NumberResolver
} from '../../../resolvers';
import { ViolationType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, type, amount]: [Member, ViolationType, number],
		flags: {},
		{ guild, settings }: Context
	): Promise<any> {
		const source =
			`${message.author.username}#${message.author.discriminator} ` +
			`(ID: ${message.author.id})`;
		this.client.mod.logViolationModAction(guild, member.user, type, amount, [
			{ name: 'Issued by', value: source }
		]);

		await this.client.mod.addStrikesAndPunish(member, type, amount, {
			guild,
			settings
		});
	}
}
