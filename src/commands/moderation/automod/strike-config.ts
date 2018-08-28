import { Message } from 'eris';

import { IMClient } from '../../../client';

import { EnumResolver, NumberResolver } from '../../../resolvers';
import { strikeConfigs, ViolationType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.strikeConfig,
			aliases: [],
			args: [
				{
					name: 'violation',
					resolver: new EnumResolver(client, Object.values(ViolationType)),
					description: 'Violation type',
					required: true
				},
				{
					name: 'strikes',
					resolver: NumberResolver,
					description: 'Number of strikes'
				}
			],
			desc: 'Add or edit strike config',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[violation, strikes]: [ViolationType, number],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: 'Strike Config'
		});

		if (typeof strikes !== typeof undefined) {
			strikeConfigs.insertOrUpdate({
				id: null,
				guildId: guild.id,
				violationType: violation,
				amount: strikes
			});
			embed.description = `The violation ${violation} gives a user ${strikes} strikes.`;
		} else {
			let strike = await strikeConfigs.find({
				where: {
					guildId: guild.id,
					violationType: violation
				}
			});
			embed.description = `The violation ${strike.violationType} gives a user ${
				strike.amount
			} strikes.`;
			// TODO: expiration
		}

		this.client.sendReply(message, embed);
	}
}
