import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { EnumResolver, NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { ViolationType } from '../../models/StrikeConfig';

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
		[violationType, strikes]: [ViolationType, number],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.strikeConfig.title')
		});

		const strikeConfigList = await this.client.cache.strikes.get(guild.id);

		if (typeof violationType === typeof undefined) {
			const allViolations: ViolationType[] = Object.values(ViolationType);
			const unusedViolations = allViolations.filter((v) => strikeConfigList.map((scl) => scl.type).indexOf(v) < 0);
			embed.description = strikeConfigList
				.map((scl) =>
					t('cmd.strikeConfig.text', {
						violation: `**${scl.type}**`,
						strikes: `**${scl.amount}**`
					})
				)
				.join('\n');
			embed.fields.push({
				name: t('cmd.strikeConfig.unusedViolations'),
				value: `\n${unusedViolations.map((v) => `\`${v}\``).join(', ')}`
			});
		} else if (typeof strikes === typeof undefined) {
			const strike = strikeConfigList.find((c) => c.type === violationType);
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${strike ? strike.type : violationType}**`,
				strikes: `**${strike ? strike.amount : 0}**`
			});
		} else if (strikes === 0) {
			await this.client.db.removeStrikeConfig(guild.id, violationType);
			embed.description = t('cmd.strikeConfig.deletedText', {
				violation: `**${violationType}**`
			});
		} else {
			await this.client.db.saveStrikeConfig({
				guildId: guild.id,
				type: violationType,
				amount: strikes
			});
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${violationType}**`,
				strikes: `**${strikes}**`
			});
			// TODO: expiration
		}

		this.client.cache.strikes.flush(guild.id);
		await this.sendReply(message, embed);
	}
}
