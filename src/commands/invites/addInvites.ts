import { Message, User } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { customInvites, LogAction, members } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { getInviteCounts } from '../../util';
import { Command, Context } from '../Command';
import { NumberResolver, StringResolver, UserResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.addInvites,
			aliases: ['add-invites'],
			desc: 'Adds/Removes invites to/from a member',
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					description: 'The user that will receive/lose the bonus invites',
					required: true
				},
				{
					name: 'amount',
					resolver: NumberResolver,
					description:
						'The amount of invites the user will get/lose. ' +
						'Use a negative (-) number to remove invites.\n\n',
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					description: 'The reason for adding/removing the invites.'
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user, amount, reason]: [User, number, string],
		{ guild, t, settings }: Context
	): Promise<any> {
		if (amount === 0) {
			return sendReply(this.client, message, t('CMD_ADDINVITES_ZERO'));
		}

		const invites = await getInviteCounts(guild.id, user.id);
		const totalInvites = invites.total + amount;

		await members.insertOrUpdate({
			id: user.id,
			name: user.username,
			discriminator: user.discriminator
		});

		const createdInv = await customInvites.create({
			id: null,
			guildId: guild.id,
			memberId: user.id,
			creatorId: message.author.id,
			amount,
			reason,
			generatedReason: null
		});

		await this.client.logAction(guild, message, LogAction.addInvites, {
			customInviteId: createdInv.id,
			targetId: user.id,
			amount,
			reason
		});

		const embed = createEmbed(this.client, {
			title: user.username
		});

		let descr = '';
		if (amount > 0) {
			descr += t('CMD_ADDINVITES_AMOUNT_POS', {
				amount,
				member: user.id,
				totalInvites
			});
		} else {
			descr += t('CMD_ADDINVITES_AMOUNT_NEG', {
				amount: -amount,
				member: user.id,
				totalInvites
			});
		}

		// Promote the member if it's not a bot
		/*if (!user.bot) {
			const member: GuildMember = await message.guild.members
				.fetch(user.id)
				.catch(() => undefined);
			// Only if the member is still in the guild try and promote them
			if (member) {
				const promoteInfo = await promoteIfQualified(
					message.guild,
					member,
					totalInvites
				);

				if (promoteInfo) {
					const { shouldHave, shouldNotHave, dangerous } = promoteInfo;

					if (shouldHave.length > 0) {
						descr +=
							'\n\n' +
							rp.ROLES_SHOULD_HAVE({
								shouldHave: shouldHave.map(r => `<@&${r.id}>`).join(', ')
							});
					}
					if (shouldNotHave.length > 0) {
						descr +=
							'\n\n' +
							rp.ROLES_SHOULD_NOT_HAVE({
								shouldNotHave: shouldNotHave.map(r => `<@&${r.id}>`).join(', ')
							});
					}
					if (dangerous.length > 0) {
						descr +=
							'\n\n' +
							rp.ROLES_DANGEROUS({
								dangerous: dangerous.map(r => `<@&${r.id}>`).join(', ')
							});
					}
				}
			}
		}*/

		embed.description = descr;

		return sendReply(this.client, message, embed);
	}
}
