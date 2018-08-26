import { Message, User } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { getInviteCounts } from '../../util';
import { Command, Context } from '../Command';
import { UserResolver } from '../resolvers/UserResolver';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.invites,
			aliases: ['invite', 'rank'],
			desc: 'Show personal invites',
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					description: 'The user for whom you want to show invites.'
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [User],
		{ guild, t }: Context
	): Promise<any> {
		let target = user ? user : message.author;
		const invites = await getInviteCounts(guild.id, target.id);

		let textMessage =
			t('CMD_INVITES_AMOUNT', {
				self: message.author.id,
				target: target.id,
				total: invites.total,
				regular: invites.regular,
				custom: invites.custom,
				fake: invites.fake,
				leave: invites.leave
			}) + '\n';

		/*if (!target.bot) {
			let targetMember = await guild.members
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
							textMessage += t('CMD_INVITES_HIGHEST_RANK');
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
		}*/

		const embed = createEmbed(this.client, {
			title: target.username,
			description: textMessage
		});

		return sendReply(this.client, message, embed);
	}
}
