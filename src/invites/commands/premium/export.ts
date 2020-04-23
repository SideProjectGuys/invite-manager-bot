import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'exportLeaderboard',
			aliases: [],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true,
			premiumOnly: true
		});
	}

	public async action(message: Message, args: [], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.export.title')
		});

		embed.description = t('cmd.export.preparing');

		const msg = await this.sendReply(message, embed);
		if (!msg) {
			return;
		}

		let csv = 'Id,Name,Total Invites,Regular,Custom,Fake,Leaves\n';

		const invs = await this.invs.generateLeaderboard(guild.id);
		invs.forEach((inv) => {
			csv +=
				`${inv.id},` +
				`"${inv.name.replace(/"/g, '\\"')}",` +
				`${inv.total},` +
				`${inv.regular},` +
				`${inv.custom},` +
				`${inv.fakes},` +
				`${inv.leaves},` +
				`\n`;
		});

		return message.channel
			.createMessage('', {
				file: Buffer.from(csv),
				name: 'InviteManagerExport.csv'
			})
			.then(() => msg.delete().catch(() => undefined))
			.catch(() => undefined);
	}
}
