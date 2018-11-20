import { Message, User } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { InviteCodeSettingsKey } from '../../models/InviteCodeSetting';
import { UserResolver } from '../../resolvers';
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
		[user]: [User],
		{ guild, t, settings }: Context
	): Promise<any> {
		let target = user ? user : message.author;

		const invs = await this.repo.invCodes.find({
			where: {
				guildId: guild.id,
				inviterId: target.id,
				inviteCodeSettings: {
					guildId: guild.id,
					key: InviteCodeSettingsKey.name
				}
			},
			order: { uses: 'DESC' },
			relations: ['inviteCodeSettings']
		});

		const lang = settings.lang;

		let invText = '';
		invs.slice(0, 100).forEach(inv => {
			const name = (inv as any)['inviteCodeSettings.value'];

			invText +=
				t('cmd.inviteDetails.entry', {
					uses: inv.uses,
					code: name ? `**${name}** (${inv.code})` : `**${inv.code}**`,
					createdAt: moment(inv.createdAt)
						.locale(lang)
						.fromNow()
				}) + '\n';
		});

		this.sendReply(message, invText);
	}
}
