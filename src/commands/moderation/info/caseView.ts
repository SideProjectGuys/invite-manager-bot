import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { NumberResolver } from '../../../resolvers';
import { members, strikes } from '../../../sequelize';
import { BasicUser, CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.caseView,
			aliases: ['case-view', 'viewCase', 'view-case'],
			args: [
				{
					name: 'caseNumber',
					resolver: NumberResolver,
					required: true
				}
			],
			group: CommandGroup.Moderation,
			strict: true,
			guildOnly: true,
			extraExamples: ['!caseView 5434']
		});
	}

	public async action(
		message: Message,
		[caseNumber]: [number],
		flags: {},
		{ guild, settings, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.caseView.title', { id: caseNumber })
		});

		const strike = await strikes.findOne({
			where: {
				id: caseNumber,
				guildId: guild.id
			},
			include: [
				{
					attributes: ['id', 'name', 'discriminator'],
					model: members,
					required: true
				}
			]
		});

		if (strike) {
			let user: BasicUser = await guild
				.getRESTMember(strike.memberId)
				.then(m => ({
					id: m.user.id,
					username: m.username,
					discriminator: m.discriminator,
					createdAt: m.createdAt,
					avatarURL: m.avatarURL
				}))
				.catch(() => undefined);

			if (!user) {
				const mem = strike as any;
				user = {
					id: strike.memberId,
					username: mem['members.name'],
					discriminator: mem['members.discriminator'],
					createdAt: mem['members.createdAt'],
					avatarURL: undefined
				};
			}

			embed.description = t('cmd.caseView.strike', {
				id: `${strike.id}`,
				amount: `**${strike.amount}**`,
				violation: `**${strike.type}**`,
				date:
					'**' +
					moment(strike.createdAt)
						.locale(settings.lang)
						.fromNow() +
					'**',
				member: `**${user.username}#${user.discriminator}** (${user.id})`
			});
		} else {
			embed.description = t('cmd.caseView.notFound');
		}

		this.sendReply(message, embed);
	}
}
