import { Message } from 'eris';
import { Context } from 'vm';

import { IMClient } from '../../../client';
import { Command } from '../../../framework/commands/Command';
import { EnumResolver, NumberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';

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
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[punishmentType, strikes, args]: [PunishmentType, number, string],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.punishmentConfig.title')
		});

		const punishmentConfigList = await this.client.cache.punishments.get(guild.id);

		if (typeof punishmentType === typeof undefined) {
			const allPunishments: PunishmentType[] = Object.values(PunishmentType);
			const unusedPunishment = allPunishments.filter((p) => punishmentConfigList.map((pcl) => pcl.type).indexOf(p) < 0);
			embed.description = punishmentConfigList
				.map((pcl) =>
					t('cmd.punishmentConfig.text', {
						punishment: `**${pcl.type}**`,
						strikes: `**${pcl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.punishmentConfig.unusedPunishment'),
				value: `\n${unusedPunishment.map((v) => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const pc = punishmentConfigList.find((c) => c.type === punishmentType);
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${pc ? pc.type : punishmentType}**`,
				strikes: `**${pc ? pc.amount : 0}**`
			});
		} else if (strikes === 0) {
			await this.client.db.removePunishmentConfig(guild.id, punishmentType);
			embed.description = t('cmd.punishmentConfig.deletedText', {
				punishment: `**${punishmentType}**`
			});
		} else {
			await this.client.db.savePunishmentConfig({
				guildId: guild.id,
				type: punishmentType,
				amount: strikes,
				args: args
			});
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${punishmentType}**`,
				strikes: `**${strikes}**`
			});
		}

		this.client.cache.punishments.flush(guild.id);
		await this.sendReply(message, embed);
	}
}
