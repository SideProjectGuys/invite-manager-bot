import { Message } from 'eris';

import { IMClient } from '../../../client';

import {
	EnumResolver,
	NumberResolver,
	StringResolver
} from '../../../resolvers';
import {
	CommandGroup,
	ModerationCommand,
	PunishmentType
} from '../../../types';
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
			strict: true,
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

		const embed = this.createEmbed({
			title: t('cmd.punishmentConfig.title')
		});

		let punishmentQuery = {
			guildId: guild.id,
			punishmentType: punishment
		};
		if (typeof punishment === typeof undefined) {
			let allPunishments: PunishmentType[] = Object.values(PunishmentType);
			let punishmentConfigList = await this.repo.punishConfigs.find({
				where: { guildId: guild.id },
				order: { amount: 'DESC' }
			});
			let unusedPunishment = allPunishments.filter(
				p => punishmentConfigList.map(pcl => pcl.punishmentType).indexOf(p) < 0
			);
			embed.description = punishmentConfigList
				.map(pcl =>
					t('cmd.punishmentConfig.text', {
						punishment: `**${pcl.punishmentType}**`,
						strikes: `**${pcl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.punishmentConfig.unusedPunishment'),
				value: `\n${unusedPunishment.map(v => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const pc = await this.repo.punishConfigs.findOne({
				where: punishmentQuery
			});
			embed.description = t('cmd.punishmentConfig.text', {
				punishment: `**${pc.punishmentType}**`,
				strikes: `**${pc.amount}**`
			});
		} else if (strikes === 0) {
			await this.repo.punishConfigs.update(punishmentQuery, {
				deletedAt: new Date()
			});
			embed.description = t('cmd.punishmentConfig.deletedText', {
				punishment: `**${punishment}**`
			});
		} else {
			// TODO: This used to be INSERT OR UPDATE
			await this.repo.punishConfigs.save({
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
