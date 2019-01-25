import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { BasicUser, UserResolver } from '../../resolvers';
import { inviteCodes } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.inviteDetails,
			aliases: ['invite-details'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		flags: {},
		{ guild, t, settings }: Context
	): Promise<any> {
		const target = user ? user : message.author;

		const invs = await inviteCodes.findAll({
			where: {
				guildId: guild.id,
				inviterId: target.id
			},
			order: [['uses', 'DESC']],
			raw: true
		});

		if (invs.length === 0) {
			this.sendReply(message, t('cmd.inviteDetails.noInviteCodes'));
			return;
		}

		const lang = settings.lang;
		const allSets = await this.client.cache.inviteCodes.get(guild.id);

		let invText = '';
		for (const inv of invs.slice(0, 25)) {
			const sets = allSets.get(inv.code);
			const name =
				sets && sets.name
					? `**${sets.name}** (${inv.code})`
					: `**${inv.code}**`;

			invText +=
				t('cmd.inviteDetails.entry', {
					uses: inv.uses,
					code: name,
					createdAt: moment(inv.createdAt)
						.locale(lang)
						.fromNow()
				}) + '\n';
		}

		this.sendReply(message, invText);
	}
}
