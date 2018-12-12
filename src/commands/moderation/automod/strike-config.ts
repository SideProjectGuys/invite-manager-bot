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
			aliases: ['strike-config'],
			args: [
				{
					name: 'violation',
					resolver: new EnumResolver(client, Object.values(ViolationType))
				},
				{
					name: 'strikes',
					resolver: NumberResolver
				}
			],
			group: CommandGroup.Moderation,
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[violation, strikes]: [ViolationType, number],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: t('cmd.strikeConfig.title')
		});

		let violationQuery = {
			guildId: guild.id,
			violationType: violation
		};

		if (typeof violation === typeof undefined) {
			let allViolations: ViolationType[] = Object.values(ViolationType);
			let strikeConfigList = await strikeConfigs.findAll({
				where: { guildId: guild.id },
				order: [['amount', 'DESC']]
			});
			let unusedViolations = allViolations.filter(
				v => strikeConfigList.map(scl => scl.violationType).indexOf(v) < 0
			);
			embed.description = strikeConfigList
				.map(scl =>
					t('cmd.strikeConfig.text', {
						violation: `**${scl.violationType}**`,
						strikes: `**${scl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.strikeConfig.unusedViolations'),
				value: `\n${unusedViolations.map(v => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			let strike = await strikeConfigs.find({ where: violationQuery });
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${strike ? strike.violationType : violation}**`,
				strikes: `**${strike ? strike.amount : 0}**`
			});
		} else if (strikes === 0) {
			await strikeConfigs.destroy({ where: violationQuery });
			embed.description = t('cmd.strikeConfig.deletedText', {
				violation: `**${violation}**`
			});
		} else {
			strikeConfigs.insertOrUpdate({
				id: null,
				amount: strikes,
				...violationQuery
			});
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${violation}**`,
				strikes: `**${strikes}**`
			});
			// TODO: expiration
		}

		this.client.cache.strikes.flush(guild.id);
		this.client.sendReply(message, embed);
	}
}
