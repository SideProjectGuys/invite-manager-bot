import { Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { Role, User } from 'discord.js';
import { IMClient } from '../client';
import { ranks, customInvites, inviteCodes } from '../sequelize';
import { getInviteCounts, promoteIfQualified } from '../utils/util';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-invites',
			aliases: ['addInvites'],
			desc: 'Adds invites to a member',
			usage: '<prefix>add-invites @user amountOfInvites (reason)',
			info: '',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('user: User, amount: Number, ...reason: String'))
	@using(expect('user: User, amount: Number'))
	public async action(message: Message, [user, amount, reason]: [User, number, string]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const member = await message.guild.fetchMember(user.id);
		if (amount === 0) {
			message.channel.send(`Adding zero invites doesn't really make sense...`);
			return;
		}

		const invites = await getInviteCounts(message.guild.id, member.id);
		const totalInvites = invites.code + invites.custom + amount;

		if (!user.bot) {
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(message.guild, member, totalInvites);
		}

		await customInvites.create({
			guildId: message.guild.id,
			memberId: member.id,
			creatorId: message.author.id,
			amount,
			reason,
		});

		const msg = amount > 0 ? `Added **${amount}** invites for` : `Removed **${-amount}** invites from`;
		message.channel.send(msg + ` <@${member.id}>, now at: **${totalInvites}** invites`);
	}
}
