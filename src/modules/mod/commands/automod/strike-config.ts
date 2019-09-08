import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { EnumResolver, NumberResolver } from '../../../../framework/resolvers';
import { strikeConfigs, ViolationType } from '../../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../../types';

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
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[violation, strikes]: [ViolationType, number],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.strikeConfig.title')
		});

		const violationQuery = {
			guildId: guild.id,
			type: violation
		};

		if (typeof violation === typeof undefined) {
			const allViolations: ViolationType[] = Object.values(ViolationType);
			const strikeConfigList = await strikeConfigs.findAll({
				where: { guildId: guild.id },
				order: [['amount', 'DESC']]
			});
			const unusedViolations = allViolations.filter(
				v => strikeConfigList.map(scl => scl.type).indexOf(v) < 0
			);
			embed.description = strikeConfigList
				.map(scl =>
					t('cmd.strikeConfig.text', {
						violation: `**${scl.type}**`,
						strikes: `**${scl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.strikeConfig.unusedViolations'),
				value: `\n${unusedViolations.map(v => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const strike = await strikeConfigs.find({ where: violationQuery });
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${strike ? strike.type : violation}**`,
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
		this.sendReply(message, embed);
	}
}
