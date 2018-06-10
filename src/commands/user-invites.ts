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
	RP,
	sendEmbed
} from '../utils/util';

const { resolve } = Middleware;
const { using, localizable } = CommandDecorators;

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
	@localizable
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let target = user ? user : message.author;
		const invites = await getInviteCounts(message.guild.id, target.id);

		let textMessage =
			rp.CMD_INVITES_AMOUNT({
				self: message.author.id,
				target: target.id,
				total: invites.total.toString(),
				regular: invites.regular.toString(),
				custom: invites.custom.toString(),
				fake: invites.fake.toString(),
				leave: invites.leave.toString()
			}) + '\n';

		if (!target.bot) {
			let targetMember = await message.guild.members.fetch(target.id);
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(
				message.guild,
				targetMember,
				invites.total
			);

			if (nextRank) {
				let nextRankPointsDiff = nextRank.numInvites - invites.total;
				textMessage += rp.CMD_INVITES_NEXT_RANK({
					self: message.author.id,
					target: target.id,
					nextRankPointsDiff: nextRankPointsDiff.toString(),
					nextRankName
				});
			} else {
				if (numRanks > 0) {
					textMessage += rp.CMD_INVITES_HIGHEST_RANK();
				}
			}
		}

		const embed = createEmbed(this.client);
		embed.setTitle(target.username);
		embed.setDescription(textMessage);

		await sendEmbed(message.channel, embed, message.author);
	}
}
