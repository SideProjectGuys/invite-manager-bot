import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { NumberResolver, StringResolver } from '../../../../framework/resolvers';
import { strikes } from '../../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.caseDelete,
			aliases: ['case-delete', 'deleteCase', 'delete-case'],
			args: [
				{
					name: 'caseNumber',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true,
			extraExamples: ['!caseDelete 5434 User apologized']
		});
	}

	public async action(message: Message, [caseNumber]: [number], flags: {}, { guild, t }: Context): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.caseDelete.title', {
				number: caseNumber
			})
		});

		const strike = await strikes.findOne({
			where: {
				id: caseNumber,
				guildId: guild.id
			}
		});

		if (strike) {
			await strike.destroy();
			embed.description = t('cmd.caseDelete.done', {
				id: `${strike.id}`
			});
		} else {
			embed.description = t('cmd.caseDelete.notFound');
		}

		await this.sendReply(message, embed);
	}
}
