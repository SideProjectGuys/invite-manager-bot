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
import { customInvites, LogAction, members } from '../sequelize';
import {
	CommandGroup,
	createEmbed,
	getInviteCounts,
	promoteIfQualified,
	RP,
	sendEmbed
} from '../utils/util';

const { resolve, expect } = Middleware;
const { using, localizable } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

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
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User, amount: Number, ...reason: String'))
	@using(expect('user: User, amount: Number'))
	@localizable
	public async action(
		message: Message,
		[rp, user, amount, reason]: [RP, User, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const member = await message.guild.members.fetch(user.id);
		if (amount === 0) {
			await message.channel.send(rp.CMD_ADDINVITES_ZERO());
			return;
		}

		const invites = await getInviteCounts(message.guild.id, member.id);
		const totalInvites = invites.total + amount;

		if (!user.bot) {
			await promoteIfQualified(message.guild, member, totalInvites);
		}

		await members.insertOrUpdate({
			id: member.id,
			name: member.user.username,
			discriminator: member.user.discriminator
		});

		const createdInv = await customInvites.create({
			id: null,
			guildId: message.guild.id,
			memberId: member.id,
			creatorId: message.author.id,
			amount,
			reason,
			generatedReason: null
		});

		await this.client.logAction(message, LogAction.addInvites, {
			customInviteId: createdInv.id,
			targetId: member.id,
			amount,
			reason
		});

		const embed = createEmbed(this.client);
		embed.setTitle(member.displayName);

		if (amount > 0) {
			embed.setDescription(
				rp.CMD_ADDINVITES_AMOUNT_POS({
					amount: amount.toString(),
					member: member.id,
					totalInvites: totalInvites.toString()
				})
			);
		} else {
			embed.setDescription(
				rp.CMD_ADDINVITES_AMOUNT_NEG({
					amount: (-amount).toString(),
					member: member.id,
					totalInvites: totalInvites.toString()
				})
			);
		}

		await sendEmbed(message.channel, embed, message.author);
	}
}
