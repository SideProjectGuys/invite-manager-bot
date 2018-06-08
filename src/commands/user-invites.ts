import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';

import { IMClient } from '../client';
import {
	CommandGroup,
	createEmbed,
	getInviteCounts,
	promoteIfQualified,
	sendEmbed
} from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'invites',
			aliases: ['invite', 'rank'],
			desc: 'Show personal invites',
			usage: '<prefix>invites (@user)',
			info: '`@user`:\n' + 'The user for whom you want to show invites.\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User'))
	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let target = user ? user : message.author;

		const invites = await getInviteCounts(message.guild.id, target.id);

		let subject =
			target.id === message.author.id ? 'You have' : `<@${target.id}> has`;
		let textMessage =
			`${subject} **${invites.total}** invites! ` +
			`(**${invites.regular}** regular, ` +
			`**${invites.custom}** bonus, ` +
			`**${invites.fake}** fake, ` +
			`**${invites.leave}** leaves)\n`;

		if (!target.bot) {
			let targetMember = await message.guild.members.fetch(target.id);
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(
				message.guild,
				targetMember,
				invites.total
			);

			if (nextRank) {
				let nextRankPointsDiff = nextRank.numInvites - invites.total;
				subject =
					target.id === message.author.id
						? 'You need'
						: `<@${target.id}> needs`;
				textMessage += `${subject} **${nextRankPointsDiff}** more invites to reach **${nextRankName}** rank!`;
			} else {
				if (numRanks > 0) {
					textMessage +=
						target.id === message.author.id
							? `Congratulations, you currently have the highest rank!`
							: `<@${target.id}> currently has the highest rank!`;
				}
			}
		}

		const embed = createEmbed(this.client);
		embed.setTitle(target.username);
		embed.setDescription(textMessage);

		await sendEmbed(message.channel, embed, message.author);
	}
}
