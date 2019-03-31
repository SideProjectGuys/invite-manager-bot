import { Message } from 'eris';

import { IMClient } from '../../../../../client';
import { UserResolver } from '../../../../../framework/resolvers';
import {
	customInvites,
	inviteCodes,
	members,
	sequelize
} from '../../../../../sequelize';
import { InviteCounts } from '../../../services/Invites';
import { BasicUser, BotCommand, CommandGroup } from '../../../../../types';
import { Command, Context } from '../../../../../framework/commands/Command';

enum CustomInvitesGeneratedReason {
	clear_regular = 'clear_regular',
	clear_custom = 'clear_custom',
	clear_fake = 'clear_fake',
	clear_leave = 'clear_leave',
	fake = 'fake',
	leave = 'leave'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.legacyInvites,
			aliases: ['legacy-invites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		flags: {},
		{ guild, t, me }: Context
	): Promise<any> {
		const target = user
			? user
			: await members
					.findOne({ where: { id: message.author.id }, raw: true })
					.then(u => ({ ...u, username: u.name }));
		const invites = await this.getInviteCounts(guild.id, target.id);

		let textMessage = '';
		if (target.id === message.author.id) {
			textMessage = t('cmd.invites.amount.self', {
				total: invites.total,
				regular: invites.regular,
				custom: invites.custom,
				fake: invites.fake,
				leave: invites.leave
			});
		} else {
			textMessage = t('cmd.invites.amount.other', {
				target: `<@${target.id}>`,
				total: invites.total,
				regular: invites.regular,
				custom: invites.custom,
				fake: invites.fake,
				leave: invites.leave
			});
		}
		textMessage += '\n';

		let targetMember = guild.members.get(target.id);
		if (!targetMember) {
			targetMember = await guild
				.getRESTMember(target.id)
				.catch(() => undefined);
		}
		// Only process if the user is still in the guild
		if (targetMember && !targetMember.bot) {
			const promoteInfo = await this.client.invs.promoteIfQualified(
				guild,
				targetMember,
				me,
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
				}

				if (shouldHave.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.shouldHave', {
							shouldHave: shouldHave.map(r => `<@&${r.id}>`).join(', ')
						});
				}
				if (shouldNotHave.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.shouldNotHave', {
							shouldNotHave: shouldNotHave.map(r => `<@&${r.id}>`).join(', ')
						});
				}
				if (dangerous.length > 0) {
					textMessage +=
						'\n\n' +
						t('roles.dangerous', {
							dangerous: dangerous.map(r => `<@&${r.id}>`).join(', ')
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

	private async getInviteCounts(
		guildId: string,
		memberId: string
	): Promise<InviteCounts> {
		const regularPromise = inviteCodes.sum('uses', {
			where: {
				guildId: guildId,
				inviterId: memberId
			}
		});
		const customPromise = customInvites.findAll({
			attributes: [
				'generatedReason',
				[sequelize.fn('SUM', sequelize.col('amount')), 'total']
			],
			where: {
				guildId: guildId,
				memberId: memberId
			},
			group: ['generatedReason'],
			raw: true
		});
		const values = await Promise.all([regularPromise, customPromise]);

		const reg = values[0] || 0;

		const customUser = values[1].find(
			(ci: any) => ci.generatedReason === null
		) as any;
		const ctm = customUser ? parseInt(customUser.total, 10) : 0;

		const generated: { [x in CustomInvitesGeneratedReason]: number } = {
			[CustomInvitesGeneratedReason.clear_regular]: 0,
			[CustomInvitesGeneratedReason.clear_custom]: 0,
			[CustomInvitesGeneratedReason.clear_fake]: 0,
			[CustomInvitesGeneratedReason.clear_leave]: 0,
			[CustomInvitesGeneratedReason.fake]: 0,
			[CustomInvitesGeneratedReason.leave]: 0
		};

		values[1].forEach((ci: any) => {
			if (ci.generatedReason === null) {
				return;
			}
			const reason = ci.generatedReason as CustomInvitesGeneratedReason;
			const amount = parseInt(ci.total, 10);
			generated[reason] = amount;
		});

		const regular = reg + generated[CustomInvitesGeneratedReason.clear_regular];
		const custom = ctm + generated[CustomInvitesGeneratedReason.clear_custom];
		const fake =
			generated[CustomInvitesGeneratedReason.fake] +
			generated[CustomInvitesGeneratedReason.clear_fake];
		const leave =
			generated[CustomInvitesGeneratedReason.leave] +
			generated[CustomInvitesGeneratedReason.clear_leave];

		return {
			regular,
			custom,
			fake,
			leave,
			total: regular + custom + fake + leave
		};
	}
}
