import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser, CommandGroup, InvitesCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.inviteDetails,
			aliases: ['invite-details'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!inviteDetails @User', '!inviteDetails "User with space"']
		});
	}

	public async action(message: Message, [user]: [BasicUser], flags: {}, { guild, t, settings }: Context): Promise<any> {
		const target = user ? user : message.author;

		const invs = await this.client.db.getInviteCodesForMember(guild.id, target.id);

		if (invs.length === 0) {
			await this.sendReply(message, t('cmd.inviteDetails.noInviteCodes'));
			return;
		}

		const lang = settings.lang;
		const allSets = await this.client.cache.inviteCodes.get(guild.id);

		let invText = '';
		for (const inv of invs.slice(0, 25)) {
			const sets = allSets.get(inv.code);
			const name = sets && sets.name ? `**${sets.name}** (${inv.code})` : `**${inv.code}**`;

			invText +=
				t('cmd.inviteDetails.entry', {
					uses: inv.uses,
					code: name,
					createdAt: moment(inv.createdAt).locale(lang).fromNow()
				}) + '\n';
		}

		await this.sendReply(message, invText);
	}
}
