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
					resolver: new EnumResolver(client, Object.values(PunishmentType))
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

		let punishmentQuery = {
			guildId: guild.id,
			punishmentType: punishment
		};
		if (typeof punishment === typeof undefined) {
			let allPunishments: PunishmentType[] = Object.values(PunishmentType);
			let punishmentConfigList =
				await punishmentConfigs.findAll({ where: { guildId: guild.id }, order: [['amount', 'DESC']] });
			let unusedPunishment =
				allPunishments.filter(p => punishmentConfigList.map(pcl => pcl.punishmentType).indexOf(p) < 0);
			embed.description =
				punishmentConfigList.map(pcl => t('cmd.punishmentConfig.text', {
					punishment: `**${pcl.punishmentType}**`,
					strikes: `**${pcl.amount}**`
				})).join('\n');
			embed.fields.push({
				name: t('cmd.punishmentConfig.unusedPunishment'),
				value: `\n${unusedPunishment.map(v => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const pc = await punishmentConfigs.find({ where: punishmentQuery });
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${pc.punishmentType}**`,
				strikes: `**${pc.amount}**`
			});
		} else if (strikes === 0) {
			await punishmentConfigs.destroy({ where: punishmentQuery });
			embed.description = t('cmd.punishmentConfig.deletedText', {
				punishment: `**${punishment}**`
			});
		} else {
			punishmentConfigs.insertOrUpdate({
				id: null,
				amount: strikes,
				args: args,
				...punishmentQuery
			});
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${punishment}**`,
				strikes: `**${strikes}**`
			});
		}

		this.client.sendReply(message, embed);
	}
}
