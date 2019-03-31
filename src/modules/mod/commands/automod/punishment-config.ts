import { Message } from 'eris';
import { Context } from 'vm';

import { IMClient } from '../../../../client';
import { Command } from '../../../../framework/commands/Command';
import {
	EnumResolver,
	NumberResolver,
	StringResolver
} from '../../../../framework/resolvers';
import { punishmentConfigs, PunishmentType } from '../../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../../types';

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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[punishment, strikes, args]: [PunishmentType, number, string],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.punishmentConfig.title')
		});

		const punishmentQuery = {
			guildId: guild.id,
			type: punishment
		};
		if (typeof punishment === typeof undefined) {
			const allPunishments: PunishmentType[] = Object.values(PunishmentType);
			const punishmentConfigList = await punishmentConfigs.findAll({
				where: { guildId: guild.id },
				order: [['amount', 'DESC']]
			});
			const unusedPunishment = allPunishments.filter(
				p => punishmentConfigList.map(pcl => pcl.type).indexOf(p) < 0
			);
			embed.description = punishmentConfigList
				.map(pcl =>
					t('cmd.punishmentConfig.text', {
						punishment: `**${pcl.type}**`,
						strikes: `**${pcl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.punishmentConfig.unusedPunishment'),
				value: `\n${unusedPunishment.map(v => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const pc = await punishmentConfigs.find({ where: punishmentQuery });
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${pc ? pc.type : punishment}**`,
				strikes: `**${pc ? pc.amount : 0}**`
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

		this.client.cache.punishments.flush(guild.id);
		this.sendReply(message, embed);
	}
}
