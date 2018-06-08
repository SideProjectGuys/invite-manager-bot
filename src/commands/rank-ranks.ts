import { Command, Logger, logger, Message } from 'yamdbf';

import { IMClient } from '../client';
import { ranks } from '../sequelize';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'ranks',
			aliases: ['show-ranks', 'showRanks'],
			desc: 'Show all ranks.',
			usage: '<prefix>show-ranks',
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const rs = await ranks.findAll({
			where: {
				guildId: message.guild.id
			},
			order: ['numInvites'],
			raw: true
		});

		let output = '';

		if (rs.length === 0) {
			message.channel.send(`No ranks have been created yet.`);
		} else {
			rs.forEach(r => {
				let description = '';
				if (r.description) {
					description = `: ${r.description}`;
				}
				output += `<@&${r.roleId}>: **${
					r.numInvites
				} invites**${description}\n`;
			});
			const embed = createEmbed(this.client);
			embed.setAuthor('Ranks');
			embed.setDescription(output);

			sendEmbed(message.channel, embed, message.author);
		}
	}
}
