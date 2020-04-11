import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { NumberResolver, StringResolver } from '../../../framework/resolvers';
import { StrikeService } from '../../services/StrikeService';

export default class extends IMCommand {
	@Service() private strikes: StrikeService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'caseDelete',
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
			group: 'Moderation',
			defaultAdminOnly: true,
			guildOnly: true,
			extraExamples: ['!caseDelete 5434 User apologized']
		});
	}

	public async action(message: Message, [caseNumber]: [number], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.caseDelete.title', {
				number: caseNumber
			})
		});

		const strike = await this.strikes.getStrike(guild.id, caseNumber);

		if (strike) {
			await this.strikes.removeStrike(strike.guildId, strike.id);
			embed.description = t('cmd.caseDelete.done', {
				id: `${strike.id}`
			});
		} else {
			embed.description = t('cmd.caseDelete.notFound');
		}

		await this.sendReply(message, embed);
	}
}
