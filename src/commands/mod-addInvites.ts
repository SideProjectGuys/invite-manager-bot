import { Role, User } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { customInvites, LogAction, ranks } from '../sequelize';
import { CommandGroup, getInviteCounts, logAction, promoteIfQualified } from '../utils/util';

const { resolve, expect } = Middleware;
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
			info: '`' +
				'@user    The user that will receive/lose the bonus invites\n' +
				'amount   The amount of invites the user will get/lose.\n' +
				'           Use a negative (-) number to remove invites.\n' +
				'reason   The reason why the user is receiving/losing the invites.' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Invites,
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
		const totalInvites = invites.total + amount;

		if (!user.bot) {
			const { nextRank, nextRankName, numRanks } = await promoteIfQualified(message.guild, member, totalInvites);
		}

		const createdInv = await customInvites.create({
			id: null,
			guildId: message.guild.id,
			memberId: member.id,
			creatorId: message.author.id,
			amount,
			reason,
			generated: false,
		});

		await logAction(LogAction.addInvites, message.guild.id, message.author.id, {
			customInviteId: createdInv.id,
			targetId: member.id,
			amount,
			reason,
		});

		const msg = amount > 0 ? `Added **${amount}** invites for` : `Removed **${-amount}** invites from`;
		message.channel.send(msg + ` <@${member.id}>, now at: **${totalInvites}** invites`);
	}
}
