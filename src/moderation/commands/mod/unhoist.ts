import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { IMModule } from '../../../framework/Module';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { NAME_DEHOIST_PREFIX, NAME_HOIST_REGEX } from '../../services/AutoModeration';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'unhoist',
			aliases: ['dehoist'],
			args: [],
			group: 'Moderation',
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: [],
		flags: {},
		{ guild, t, settings }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		const total = guild.memberCount;
		const batches = Math.ceil(total / 1000);

		const embed = this.createEmbed({
			title: t('cmd.unhoist.title'),
			description: t('cmd.unhoist.starting')
		});

		const msg = await this.sendReply(message, embed);
		if (!msg) {
			return;
		}

		let processed = 0;
		let changed = 0;
		let excluded = 0;
		let errored = 0;
		let lastId: string = undefined;

		embed.description = t('cmd.unhoist.processing', {
			total,
			processed,
			changed,
			excluded,
			errored
		});
		await msg.edit({ embed });

		for (let i = 0; i < batches; i++) {
			const members = await guild.getRESTMembers(1000, lastId);
			lastId = members[members.length - 1].user.id;

			for (const member of members) {
				processed++;

				if (processed % 500 === 0) {
					embed.description = t('cmd.unhoist.processing', {
						total,
						processed,
						changed,
						excluded,
						errored
					});
					await msg.edit({ embed });
				}

				// Ignore bots
				if (member.bot) {
					excluded++;
					continue;
				}

				// If moderated roles are set then only moderate those roles
				if (settings.autoModModeratedRoles && settings.autoModModeratedRoles.length > 0) {
					if (!settings.autoModModeratedRoles.some((r) => member.roles.indexOf(r) >= 0)) {
						excluded++;
						continue;
					}
				}

				// Don't moderate ignored roles
				if (settings.autoModIgnoredRoles && settings.autoModIgnoredRoles.some((ir) => member.roles.indexOf(ir) >= 0)) {
					excluded++;
					continue;
				}

				const name = member.nick ? member.nick : member.username;

				if (!NAME_HOIST_REGEX.test(name)) {
					continue;
				}

				const newName = (NAME_DEHOIST_PREFIX + ' ' + name).substr(0, 32);
				await guild
					.editMember(member.user.id, { nick: newName }, 'Unhoist command')
					.then(() => changed++)
					.catch(() => errored++);
			}
		}

		embed.description = t('cmd.unhoist.done', {
			total,
			processed,
			changed,
			excluded,
			errored
		});
		await msg.edit({ embed });
	}
}
