import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { GuildMember, User } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { customInvites, LogAction, members } from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';
import { getInviteCounts, promoteIfQualified } from '../../util';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-invites',
			aliases: ['addInvites'],
			desc: 'Adds/Removes invites to/from a member',
			usage: '<prefix>add-invites @user amount (reason)',
			info:
				'`@user`:\n' +
				'The user that will receive/lose the bonus invites\n\n' +
				'`amount`:\n' +
				'The amount of invites the user will get/lose. ' +
				'Use a negative (-) number to remove invites.\n\n' +
				'`reason`:\n' +
				'The reason for adding/removing the invites.\n\n',
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.addInvites))
	@using(resolve('user: User, amount: Number, ...reason: String'))
	@using(expect('user: User, amount: Number'))
	@using(localize)
	public async action(
		message: Message,
		[rp, user, amount, reason]: [RP, User, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (amount === 0) {
			return sendReply(message, rp.CMD_ADDINVITES_ZERO());
		}

		const invites = await getInviteCounts(message.guild.id, user.id);
		const totalInvites = invites.total + amount;

		await members.insertOrUpdate({
			id: user.id,
			name: user.username,
			discriminator: user.discriminator
		});

		const createdInv = await customInvites.create({
			id: null,
			guildId: message.guild.id,
			memberId: user.id,
			creatorId: message.author.id,
			amount,
			reason,
			generatedReason: null
		});

		await this.client.logAction(message, LogAction.addInvites, {
			customInviteId: createdInv.id,
			targetId: user.id,
			amount,
			reason
		});

		const embed = createEmbed(this.client);
		embed.setTitle(user.username);

		let descr = '';
		if (amount > 0) {
			descr += rp.CMD_ADDINVITES_AMOUNT_POS({
				amount,
				member: user.id,
				totalInvites
			});
		} else {
			descr += rp.CMD_ADDINVITES_AMOUNT_NEG({
				amount: -amount,
				member: user.id,
				totalInvites
			});
		}

		// Promote the member if it's not a bot
		if (!user.bot) {
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
		}

		embed.setDescription(descr);

		return sendReply(message, embed);
	}
}
