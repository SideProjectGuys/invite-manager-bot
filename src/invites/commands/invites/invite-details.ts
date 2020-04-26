import { Message } from 'eris';
import moment from 'moment';

import { InviteCodeSettingsCache } from '../../../framework/cache/InviteCodeSettings';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { IMModule } from '../../../framework/Module';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';
import { InvitesInviteCodeSettings } from '../../models/InviteCodeSettings';

export default class extends IMCommand {
	@Cache() private inviteCodeSettingsCache: InviteCodeSettingsCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'inviteDetails',
			aliases: ['invite-details'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!inviteDetails @User', '!inviteDetails "User with space"']
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		flags: {},
		{ guild, t, settings }: CommandContext
	): Promise<any> {
		const target = user ? user : message.author;

		const invs = await this.db.getInviteCodesForMember(guild.id, target.id);

		if (invs.length === 0) {
			await this.sendReply(message, t('cmd.inviteDetails.noInviteCodes'));
			return;
		}

		const lang = settings.lang;
		const allSets = await this.inviteCodeSettingsCache.get<InvitesInviteCodeSettings>(guild.id);

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
