import { RichEmbed, User } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, ranks } from '../sequelize';
import { createEmbed, getInviteCounts, promoteIfQualified } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'invites',
			aliases: ['invite', 'rank'],
			desc: 'Show personal invites',
			usage: '<prefix>invites (user)',
			clientPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		let target = user ? user : message.author;

		const invites = await getInviteCounts(message.guild.id, target.id);

		let subject = target.id === message.author.id ? 'You have' : `<@${target.id}> has`;
		let textMessage = `${subject} **${invites.total}** invites! (**${invites.custom}** bonus)\n`;

		if (!message.member.user.bot) {
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(message.guild, message.member, invites.total);

			if (nextRank) {
				let nextRankPointsDiff = nextRank.numInvites - invites.total;
				subject = target.id === message.author.id ? 'You need' : `<@${target.id}> needs`;
				textMessage += `${subject} **${nextRankPointsDiff}** more invites to reach **${nextRankName}** rank!`;
			} else {
				if (numRanks > 0) {
					textMessage += (target.id === message.author.id) ?
						`Congratulations, you currently have the highest rank!` :
						`<@${target.id} currently has the highest rank!`;
				}
			}
		}

		const embed = new RichEmbed();
		embed.setTitle(target.username);
		embed.setDescription(textMessage);
		createEmbed(message.client, embed);

		message.channel.send({ embed });
	}
}
