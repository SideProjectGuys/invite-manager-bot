import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandGroup, ModerationCommand } from '../../../types';
import { NAME_DEHOIST_PREFIX, NAME_HOIST_REGEX } from '../../services/Moderation';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.unhoist,
			aliases: ['dehoist'],
			args: [],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(message: Message, args: [], flags: {}, { guild, t, settings }: Context): Promise<any> {
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
