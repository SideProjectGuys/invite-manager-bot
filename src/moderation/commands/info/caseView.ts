import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { NumberResolver } from '../../../framework/resolvers';
import { BasicUser, CommandGroup } from '../../../types';
import { StrikeService } from '../../services/StrikeService';

export default class extends IMCommand {
	@Service() private strikes: StrikeService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'caseView',
			aliases: ['case-view', 'viewCase', 'view-case'],
			args: [
				{
					name: 'caseNumber',
					resolver: NumberResolver,
					required: true
				}
			],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true,
			extraExamples: ['!caseView 5434']
		});
	}

	public async action(
		message: Message,
		[caseNumber]: [number],
		flags: {},
		{ guild, settings, t }: CommandContext
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.caseView.title', { id: caseNumber })
		});

		const strike = await this.strikes.getStrike(guild.id, caseNumber);

		if (strike) {
			let user: BasicUser = await guild
				.getRESTMember(strike.memberId)
				.then((m) => ({
					id: m.user.id,
					username: m.username,
					discriminator: m.discriminator,
					createdAt: m.createdAt,
					avatarURL: m.avatarURL
				}))
				.catch(() => undefined);

			if (!user) {
				user = {
					id: strike.memberId,
					username: strike.memberName,
					discriminator: strike.memberDiscriminator,
					createdAt: moment(strike.memberCreatedAt).valueOf(),
					avatarURL: undefined
				};
			}

			embed.description = t('cmd.caseView.strike', {
				id: `${strike.id}`,
				amount: `**${strike.amount}**`,
				violation: `**${strike.type}**`,
				date: '**' + moment(strike.createdAt).locale(settings.lang).fromNow() + '**',
				member: `**${user.username}#${user.discriminator}** (${user.id})`
			});
		} else {
			embed.description = t('cmd.caseView.notFound');
		}

		await this.sendReply(message, embed);
	}
}
