import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { BotCommand, CommandGroup, RP } from '../../types';
import { getInviteCounts, promoteIfQualified } from '../../util';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

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

	@using(checkProBot)
	@using(checkRoles(BotCommand.invites))
	@using(resolve('user: User'))
	@using(localize)
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
				total: invites.total,
				regular: invites.regular,
				custom: invites.custom,
				fake: invites.fake,
				leave: invites.leave
			}) + '\n';

		if (!target.bot) {
			let targetMember = await message.guild.members
				.fetch(target.id)
				.catch(() => undefined);

			// Only process if the user is still in the guild
			if (targetMember) {
				const promoteInfo = await promoteIfQualified(
					message.guild,
					targetMember,
					invites.total
				);

				if (promoteInfo) {
					const {
						nextRank,
						nextRankName,
						numRanks,
						shouldHave,
						shouldNotHave,
						dangerous
					} = promoteInfo;

					if (nextRank) {
						let nextRankPointsDiff = nextRank.numInvites - invites.total;
						textMessage += rp.CMD_INVITES_NEXT_RANK({
							self: message.author.id,
							target: target.id,
							nextRankPointsDiff,
							nextRankName
						});
					} else {
						if (numRanks > 0) {
							textMessage += rp.CMD_INVITES_HIGHEST_RANK();
						}
					}

					if (shouldHave.length > 0) {
						textMessage +=
							'\n\n' +
							rp.ROLES_SHOULD_HAVE({
								shouldHave: shouldHave.map(r => `<@&${r.id}>`).join(', ')
							});
					}
					if (shouldNotHave.length > 0) {
						textMessage +=
							'\n\n' +
							rp.ROLES_SHOULD_NOT_HAVE({
								shouldNotHave: shouldNotHave.map(r => `<@&${r.id}>`).join(', ')
							});
					}
					if (dangerous.length > 0) {
						textMessage +=
							'\n\n' +
							rp.ROLES_DANGEROUS({
								dangerous: dangerous.map(r => `<@&${r.id}>`).join(', ')
							});
					}
				}
			}
		}

		const embed = createEmbed(this.client);
		embed.setTitle(target.username);
		embed.setDescription(textMessage);

		return sendReply(message, embed);
	}
}
