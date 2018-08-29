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
			desc: 'Configure strikes received for various violations',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[violation, strikes]: [ViolationType, number],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: t('cmd.strikeConfig.title')
		});

		if (typeof strikes !== typeof undefined) {
			strikeConfigs.insertOrUpdate({
				id: null,
				guildId: guild.id,
				violationType: violation,
				amount: strikes
			});
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${violation}**`,
				strikes: `**${strikes}**`
			});
		} else {
			let strike = await strikeConfigs.find({
				where: {
					guildId: guild.id,
					violationType: violation
				}
			});
			embed.description = t('cmd.strikeConfig.text', {
				violation: `**${strike.violationType}**`,
				strikes: `**${strike.amount}**`
			});
			// TODO: expiration
		}

		this.client.sendReply(message, embed);
	}
}
