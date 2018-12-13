import { Message } from 'eris';

import { IMClient } from '../../client';
import { NAME_HOIST_REGEX } from '../../services/Moderation';
import { CommandGroup, ModerationCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.unhoist,
			aliases: ['dehoist'],
			args: [],
			group: CommandGroup.Moderation,
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: [],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: t('cmd.unhoist.title'),
			description: ''
		});

		const members = await guild.getRESTMembers(1000);
		members.forEach(member => {
			if (!member || member.bot) {
				return;
			}

			const name = member.nick ? member.nick : member.username;

			if (!NAME_HOIST_REGEX.test(name)) {
				return;
			}

			const newName = '▼ ' + name;
			guild
				.editMember(member.user.id, { nick: newName }, 'Dehoist command')
				.catch(() => undefined);

			embed.description += name + '\n';
		});

		this.client.sendReply(message, embed);
	}
}
