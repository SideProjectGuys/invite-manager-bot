import {
	Message,
} from 'eris';

import { IMClient } from '../../../client';

import { EnumResolver, NumberResolver, StringResolver } from '../../../resolvers';
import {
	punishmentConfigs,
	PunishmentType,
} from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.punishmentConfig,
			aliases: [],
			args: [
				{
					name: 'punishment',
					resolver: new EnumResolver(client, Object.values(PunishmentType)),
					description: 'Punishment type',
					required: true
				},
				{
					name: 'strikes',
					resolver: NumberResolver,
					description: 'Number of strikes'
				},
				{
					name: 'args',
					resolver: StringResolver,
					description: 'Arguments passed to the punishment command',
					rest: true
				}
			],
			desc: 'Add or edit strike config',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[punishment, strikes, args]: [PunishmentType, number, string],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: 'Punishment Config'
		});

		if (typeof strikes !== typeof undefined) {
			punishmentConfigs.insertOrUpdate({
				id: null,
				guildId: guild.id,
				punishmentType: punishment,
				amount: strikes,
				args: args
			});
			embed.description = `The punishment ${punishment} gives a user ${strikes} strikes.`;
		} else {
			let punishmentConfig = await punishmentConfigs.find({
				where: {
					guildId: guild.id,
					punishmentType: punishment
				}
			});
			embed.description =
				`The violation ${punishmentConfig.punishmentType} gives a user ${punishmentConfig.amount} strikes.`;
		}

		this.client.sendReply(message, embed);
	}
}
