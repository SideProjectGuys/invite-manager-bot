import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';
import { InvitesCache } from '../../cache/InvitesCache';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;
	@Cache() private invitesCache: InvitesCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'invites',
			aliases: ['invite', 'rank'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: false,
			extraExamples: ['!invites @User', '!invites "User with space"']
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		flags: {},
		{ guild, t, me }: CommandContext
	): Promise<any> {
		const target = user ? user : message.author;
		const invites = await this.invitesCache.getOne(guild.id, target.id);

		let textMessage = '';
		if (target.id === message.author.id) {
			textMessage = t('cmd.invites.amount.self', {
				total: `**${invites.total}**`,
				regular: `**${invites.regular}**`,
				custom: `**${invites.custom}**`,
				fake: `**${invites.fake}**`,
				leave: `**${invites.leave}**`
			});
		} else {
			textMessage = t('cmd.invites.amount.other', {
				target: `<@${target.id}>`,
				total: `**${invites.total}**`,
				regular: `**${invites.regular}**`,
				custom: `**${invites.custom}**`,
				fake: `**${invites.fake}**`,
				leave: `**${invites.leave}**`
			});
		}
		textMessage += '\n';

		let targetMember = guild.members.get(target.id);
		if (!targetMember) {
			targetMember = await guild.getRESTMember(target.id).catch(() => undefined);
		}
		// Only process if the user is still in the guild
		if (targetMember && !targetMember.user.bot) {
			const promoteInfo = await this.invs.promoteIfQualified(guild, targetMember, me, invites.total);

			if (promoteInfo) {
				const { nextRank, nextRankName, numRanks, shouldHave, shouldNotHave, dangerous } = promoteInfo;

				if (nextRank) {
					const nextRankPointsDiff = nextRank.numInvites - invites.total;
					if (message.author.id === target.id) {
						textMessage += t('cmd.invites.nextRank.self', {
							nextRankPointsDiff,
							nextRankName
						});
					} else {
						textMessage += t('cmd.invites.nextRank.other', {
							target: `<@${target.id}>`,
							nextRankPointsDiff,
							nextRankName
						});
					}
					textMessage += '\n';
				} else {
					if (numRanks > 0) {
						if (message.author.id === target.id) {
							textMessage += t('cmd.invites.highestRank.self');
						} else {
							textMessage += t('cmd.invites.highestRank.other', {
								target: `<@${target.id}>`
							});
						}
						textMessage += '\n';
					}
					textMessage += '\n';
				}

				if (shouldHave.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.shouldHave', {
							shouldHave: shouldHave.map((r) => `<@&${r.id}>`).join(', ')
						});
				}
				if (shouldNotHave.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.shouldNotHave', {
							shouldNotHave: shouldNotHave.map((r) => `<@&${r.id}>`).join(', ')
						});
				}
				if (dangerous.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.dangerous', {
							dangerous: dangerous.map((r) => `<@&${r.id}>`).join(', ')
						});
				}
			}
		}

		const embed = this.createEmbed({
			title: target.username,
			description: textMessage
		});

		return this.sendReply(message, embed);
	}
}
