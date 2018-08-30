import { Message } from 'eris';

import { IMClient } from '../../../client';

import {
	EnumResolver,
	NumberResolver,
	StringResolver
} from '../../../resolvers';
import { punishmentConfigs, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.punishmentConfig,
			aliases: ['punishment-config'],
			args: [
				{
					name: 'punishment',
					resolver: new EnumResolver(client, Object.values(PunishmentType)),
					required: true
				},
				{
					name: 'strikes',
					resolver: NumberResolver
				},
				{
					name: 'args',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[punishment, strikes, args]: [PunishmentType, number, string],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: t('cmd.punishmentConfig.title')
		});

		if (typeof strikes !== typeof undefined) {
			punishmentConfigs.insertOrUpdate({
				id: null,
				guildId: guild.id,
				punishmentType: punishment,
				amount: strikes,
				args: args
			});
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${punishment}**`,
				strikes: `**${strikes}**`
			});
		} else {
			const pc = await punishmentConfigs.find({
				where: {
					guildId: guild.id,
					punishmentType: punishment
				}
			});
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${pc.punishmentType}**`,
				strikes: `**${pc.amount}**`
			});
		}

		this.client.sendReply(message, embed);
	}
}
